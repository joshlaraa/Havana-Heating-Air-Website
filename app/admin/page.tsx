import Link from 'next/link'
import AdminShell, { requireAdmin } from '@/components/admin-shell'
import { isSupabaseConfigured } from '@/lib/supabase'
import { listDocuments } from '@/lib/documents'
import { listExpenses, listTrips, mileageRate, setAsideRate } from '@/lib/books'
import { money } from '@/lib/books-shared'

export const dynamic = 'force-dynamic'

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className="mt-1 font-heading text-xl font-bold sm:text-2xl">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-muted">{sub}</p>}
    </div>
  )
}

const quick = 'flex h-14 items-center justify-center rounded-2xl bg-white text-[15px] font-medium shadow-sm ring-1 ring-border transition active:scale-[0.98]'

export default async function AdminHome() {
  await requireAdmin()
  const now = new Date()
  const year = now.getFullYear()
  const month = `${year}-${String(now.getMonth() + 1).padStart(2, '0')}`
  let content: React.ReactNode = <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Database is not configured.</p>
  if (isSupabaseConfigured()) {
    try {
      const [docs, expenses, trips] = await Promise.all([listDocuments(), listExpenses(year), listTrips(year)])
      const paid = docs.filter((d) => d.type === 'invoice' && d.status === 'paid' && d.issue_date.startsWith(String(year)))
      const revYtd = paid.reduce((s, d) => s + Number(d.total), 0)
      const revMonth = paid.filter((d) => d.issue_date.startsWith(month)).reduce((s, d) => s + Number(d.total), 0)
      const expYtd = expenses.reduce((s, e) => s + e.amount, 0)
      const expMonth = expenses.filter((e) => e.expense_date.startsWith(month)).reduce((s, e) => s + e.amount, 0)
      const unpaid = docs.filter((d) => d.type === 'invoice' && d.status !== 'paid')
      const open = docs.filter((d) => d.type === 'estimate' && ['draft', 'sent'].includes(d.status))
      const miles = trips.reduce((s, t) => s + t.miles, 0)
      content = (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Card label="Collected this month" value={money.format(revMonth)} sub="Paid invoices" />
            <Card label="Spent this month" value={money.format(expMonth)} />
            <Card label={`${year} collected`} value={money.format(revYtd)} />
            <Card label={`${year} net (collected − expenses)`} value={money.format(revYtd - expYtd)} sub={`${money.format(expYtd)} in expenses`} />
            <Card label="Unpaid invoices" value={money.format(unpaid.reduce((s, d) => s + Number(d.total), 0))} sub={`${unpaid.length} invoice${unpaid.length === 1 ? '' : 's'}`} />
            <Card label="Open estimates" value={money.format(open.reduce((s, d) => s + Number(d.total), 0))} sub={`${open.length} waiting on a customer`} />
            <Card label="Suggested tax set-aside" value={money.format(Math.max(0, revYtd - expYtd) * setAsideRate)} sub={`${Math.round(setAsideRate * 100)}% of ${year} net. A rough guide, confirm with his accountant`} />
            <Card label={`${year} business miles`} value={miles.toLocaleString('en-US', { maximumFractionDigits: 1 })} sub={`≈ ${money.format(miles * mileageRate)} standard deduction`} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Link href="/admin/estimates" className={quick}>New estimate</Link>
            <Link href="/admin/invoices" className={quick}>New invoice</Link>
            <Link href="/admin/expenses" className={quick}>Add expense</Link>
            <Link href="/admin/mileage" className={quick}>Log trip</Link>
          </div>
        </div>
      )
    } catch {
      content = <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">Could not load data. Run the latest supabase/schema.sql in the Supabase SQL editor.</p>
    }
  }
  return <AdminShell active="home" title="Dashboard" wide>{content}</AdminShell>
}
