import AdminShell, { requireAdmin } from '@/components/admin-shell'
import ExpenseManager from '@/components/expense-manager'
import { isSupabaseConfigured } from '@/lib/supabase'
import { lastOdometer, listExpenses } from '@/lib/books'
import { fuelStats } from '@/lib/books-shared'

export const dynamic = 'force-dynamic'

export default async function ExpensesPage() {
  await requireAdmin()
  const year = new Date().getFullYear()
  let body: React.ReactNode
  if (!isSupabaseConfigured()) body = <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Database is not configured.</p>
  else {
    try {
      const [rows, odo] = await Promise.all([listExpenses(year), lastOdometer()])
      body = <ExpenseManager rows={rows} year={year} lastOdometer={odo} mpg={fuelStats(rows).mpg} />
    } catch {
      body = <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">Could not load expenses. Run the latest supabase/schema.sql in the Supabase SQL editor.</p>
    }
  }
  return <AdminShell active="expenses" title="Expenses" subtitle="Snap a receipt and log it in seconds. Fuel entries also track gallons and mileage.">{body}</AdminShell>
}
