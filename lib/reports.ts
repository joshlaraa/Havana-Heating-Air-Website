import { supabase } from '@/lib/supabase'
import type { ExpenseRow, TripRow } from '@/lib/books-shared'
import { mileageRate } from '@/lib/books'

/** quarter 0 = whole year */
export function periodRange(year: number, quarter: number) {
  if (quarter < 1 || quarter > 4) return { start: `${year}-01-01`, end: `${year}-12-31`, label: `${year}` }
  const startMonth = (quarter - 1) * 3 + 1
  const endMonth = startMonth + 2
  const lastDay = new Date(Date.UTC(year, endMonth, 0)).getUTCDate()
  const p = (n: number) => String(n).padStart(2, '0')
  return { start: `${year}-${p(startMonth)}-01`, end: `${year}-${p(endMonth)}-${p(lastDay)}`, label: `Q${quarter} ${year}` }
}

export type ReportInvoice = { number: string; customer: string; issue_date: string; total: number; tax: number; subtotal: number; discount: number }

export async function loadReport(year: number, quarter: number) {
  const { start, end, label } = periodRange(year, quarter)
  const db = supabase()
  const [inv, exp, trp] = await Promise.all([
    db.from('documents').select('number,customer_name,issue_date,total,tax,subtotal,discount').eq('type', 'invoice').eq('status', 'paid').gte('issue_date', start).lte('issue_date', end).order('issue_date').limit(5000),
    db.from('expenses').select('*').gte('expense_date', start).lte('expense_date', end).order('expense_date').limit(5000),
    db.from('trips').select('*').gte('trip_date', start).lte('trip_date', end).order('trip_date').limit(5000),
  ])
  if (inv.error) throw inv.error
  if (exp.error) throw exp.error
  if (trp.error) throw trp.error
  const invoices: ReportInvoice[] = (inv.data ?? []).map((r) => ({ number: r.number, customer: r.customer_name, issue_date: r.issue_date, total: Number(r.total), tax: Number(r.tax), subtotal: Number(r.subtotal), discount: Number(r.discount) }))
  const expenses = (exp.data ?? []).map((r) => ({ ...r, amount: Number(r.amount), sales_tax_paid: Number(r.sales_tax_paid) || 0 })) as ExpenseRow[]
  const trips = (trp.data ?? []).map((r) => ({ ...r, miles: Number(r.miles) })) as TripRow[]

  const grossReceipts = invoices.reduce((s, r) => s + r.total, 0)
  const taxCollected = invoices.reduce((s, r) => s + r.tax, 0)
  const expenseTotal = expenses.reduce((s, r) => s + r.amount, 0)
  const salesTaxPaid = expenses.reduce((s, r) => s + r.sales_tax_paid, 0)
  const miles = trips.reduce((s, r) => s + r.miles, 0)
  const byCategory = Object.entries(expenses.reduce<Record<string, number>>((m, r) => ({ ...m, [r.category]: (m[r.category] ?? 0) + r.amount }), {})).sort((a, b) => b[1] - a[1])
  return { label, start, end, invoices, expenses, trips, grossReceipts, taxCollected, expenseTotal, salesTaxPaid, miles, mileageDeduction: miles * mileageRate, byCategory, net: grossReceipts - expenseTotal }
}

const csvCell = (v: string | number) => {
  let s = String(v)
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}` // neutralize spreadsheet formulas
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function reportCsv(r: Awaited<ReturnType<typeof loadReport>>) {
  const rows: (string | number)[][] = [['Type', 'Date', 'Reference', 'Name / Vendor', 'Category', 'Amount', 'Sales tax', 'Miles', 'Notes']]
  for (const i of r.invoices) rows.push(['Income', i.issue_date, i.number, i.customer, 'Paid invoice', i.total.toFixed(2), i.tax.toFixed(2), '', ''])
  for (const e of r.expenses) rows.push(['Expense', e.expense_date, '', e.vendor, e.category, e.amount.toFixed(2), e.sales_tax_paid.toFixed(2), '', e.notes])
  for (const t of r.trips) rows.push(['Mileage', t.trip_date, '', t.customer_name, t.purpose, '', '', t.miles, t.notes])
  rows.push([], ['Summary', r.label], ['Gross receipts', '', '', '', '', r.grossReceipts.toFixed(2)], ['Sales tax collected', '', '', '', '', r.taxCollected.toFixed(2)], ['Total expenses', '', '', '', '', r.expenseTotal.toFixed(2)], ['Sales tax paid on materials', '', '', '', '', r.salesTaxPaid.toFixed(2)], ['Business miles', '', '', '', '', '', '', r.miles], ['Standard mileage deduction', '', '', '', '', r.mileageDeduction.toFixed(2)])
  return rows.map((row) => row.map(csvCell).join(',')).join('\n')
}
