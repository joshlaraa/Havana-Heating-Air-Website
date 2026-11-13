import Link from 'next/link'
import AdminShell, { requireAdmin } from '@/components/admin-shell'
import { isSupabaseConfigured } from '@/lib/supabase'
import { loadReport } from '@/lib/reports'
import { money } from '@/lib/books-shared'

export const dynamic = 'force-dynamic'

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className="mt-1 font-heading text-xl font-bold">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-muted">{sub}</p>}
    </div>
  )
}

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ year?: string; q?: string }> }) {
  await requireAdmin()
  const sp = await searchParams
  const thisYear = new Date().getFullYear()
  const year = Number(sp.year) >= 2000 && Number(sp.year) <= 2100 ? Math.floor(Number(sp.year)) : thisYear
  const quarter = [1, 2, 3, 4].includes(Number(sp.q)) ? Number(sp.q) : 0
  const chip = (active: boolean) => `shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${active ? 'bg-ink text-white' : 'bg-white text-ink-secondary ring-1 ring-border'}`

  let body: React.ReactNode
  if (!isSupabaseConfigured()) body = <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Database is not configured.</p>
  else {
    try {
      const r = await loadReport(year, quarter)
      body = (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {[thisYear, thisYear - 1].map((y) => <Link key={y} href={`/admin/reports?year=${y}`} className={chip(year === y)}>{y}</Link>)}
            <span className="mx-1 h-5 w-px bg-border" />
            <Link href={`/admin/reports?year=${year}`} className={chip(quarter === 0)}>Full year</Link>
            {[1, 2, 3, 4].map((q) => <Link key={q} href={`/admin/reports?year=${year}&q=${q}`} className={chip(quarter === q)}>Q{q}</Link>)}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Card label="Gross receipts" value={money.format(r.grossReceipts)} sub={`${r.invoices.length} paid invoice${r.invoices.length === 1 ? '' : 's'}`} />
            <Card label="Sales tax collected" value={money.format(r.taxCollected)} sub={r.taxCollected === 0 ? 'Lump-sum pricing: none charged' : undefined} />
            <Card label="Total expenses" value={money.format(r.expenseTotal)} />
            <Card label="Sales tax paid on materials" value={money.format(r.salesTaxPaid)} />
            <Card label="Net (receipts − expenses)" value={money.format(r.net)} />
            <Card label="Business miles" value={r.miles.toLocaleString('en-US', { maximumFractionDigits: 1 })} sub={`≈ ${money.format(r.mileageDeduction)} standard deduction`} />
          </div>

          <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
            <h2 className="heading-card mb-4">Expenses by category</h2>
            {r.byCategory.length === 0 ? <p className="text-sm text-ink-muted">No expenses in this period.</p> : (
              <ul className="divide-y divide-border">
                {r.byCategory.map(([c, v]) => (
                  <li key={c} className="flex justify-between py-2.5 text-sm"><span>{c}</span><span className="font-medium">{money.format(v)}</span></li>
                ))}
              </ul>
            )}
          </section>

          <a href={`/api/admin/reports/export?year=${year}&quarter=${quarter}`} className="inline-flex h-12 w-full items-center justify-center rounded-[14px] bg-brand-red px-5 text-[15px] font-medium text-white transition active:scale-[0.98] active:opacity-80 sm:w-auto">Download CSV for {r.label}</a>
          <p className="text-xs text-ink-muted">Gross receipts count paid invoices only. Figures are a summary for his accountant, not tax advice.</p>
        </div>
      )
    } catch {
      body = <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">Could not load the report. Run the latest supabase/schema.sql in the Supabase SQL editor.</p>
    }
  }
  return <AdminShell active="reports" title="Reports" subtitle="Quarterly and yearly totals, ready to hand to his accountant.">{body}</AdminShell>
}
