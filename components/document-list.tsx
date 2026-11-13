'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { estimateStatuses, paymentStatuses } from '@/lib/invoice-types'

export type DocItem = { id: string; type: 'invoice' | 'estimate'; number: string; customer: string; total: number; status: string; issue: string; due: string; converted: boolean }

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const fmt = (v: string) => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${v}T00:00:00Z`))
const tone: Record<string, string> = {
  paid: 'bg-green-100 text-green-800', accepted: 'bg-green-100 text-green-800',
  unpaid: 'bg-amber-100 text-amber-800', sent: 'bg-blue-100 text-blue-800', partial: 'bg-amber-100 text-amber-800',
  overdue: 'bg-red-100 text-red-800', declined: 'bg-red-100 text-red-800', expired: 'bg-gray-200 text-gray-700', draft: 'bg-gray-200 text-gray-700',
}
const pill = 'inline-flex h-10 items-center justify-center rounded-[12px] bg-ink/[0.07] px-4 text-sm font-medium text-ink transition active:scale-[0.98] active:opacity-80 disabled:opacity-50'

export default function DocumentList({ items }: { items: DocItem[] }) {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'estimate' | 'invoice'>('all')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const shown = items.filter((i) => filter === 'all' || i.type === filter)

  async function call(id: string, url: string, init: RequestInit) {
    setBusy(id); setError('')
    const res = await fetch(url, init)
    setBusy('')
    if (!res.ok) { setError((await res.json().catch(() => null))?.error ?? 'Something went wrong.'); return false }
    router.refresh()
    return true
  }
  const setStatus = (id: string, status: string) => call(id, `/api/admin/documents/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
  const convert = (id: string) => call(id, `/api/admin/documents/${id}/convert`, { method: 'POST' })

  const outstanding = items.filter((i) => i.type === 'invoice' && i.status !== 'paid').reduce((s, i) => s + i.total, 0)
  const openEstimates = items.filter((i) => i.type === 'estimate' && ['draft', 'sent'].includes(i.status))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm"><p className="text-xs font-medium text-ink-muted">Unpaid invoices</p><p className="mt-1 font-heading text-xl font-bold">{money.format(outstanding)}</p></div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm"><p className="text-xs font-medium text-ink-muted">Open estimates</p><p className="mt-1 font-heading text-xl font-bold">{openEstimates.length} · {money.format(openEstimates.reduce((s, i) => s + i.total, 0))}</p></div>
      </div>

      <div className="inline-flex gap-1 rounded-xl bg-ink/[0.06] p-1">
        {(['all', 'estimate', 'invoice'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition ${filter === f ? 'bg-white shadow-sm' : 'text-ink-muted'}`}>{f === 'all' ? 'All' : `${f}s`}</button>
        ))}
      </div>

      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p>}
      {shown.length === 0 && <p className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-ink-muted">Nothing here yet. Create an estimate or invoice to get started.</p>}

      <ul className="space-y-3">
        {shown.map((d) => {
          const statuses: readonly string[] = d.type === 'estimate' ? estimateStatuses : paymentStatuses
          return (
            <li key={d.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-heading text-base font-bold">{d.customer}</p>
                  <p className="text-xs text-ink-muted">{d.number} · {fmt(d.issue)}{d.type === 'estimate' ? ` · valid until ${fmt(d.due)}` : ''}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-base font-bold">{money.format(d.total)}</p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${tone[d.status] ?? 'bg-gray-100'}`}>{d.status}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a className={pill} href={`/api/admin/documents/${d.id}`} target="_blank" rel="noreferrer">View PDF</a>
                <select aria-label="Change status" disabled={busy === d.id} value={d.status} onChange={(e) => setStatus(d.id, e.target.value)} className={`${pill} appearance-none pr-4 capitalize`}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {d.type === 'estimate' && !d.converted && (
                  <button className={`${pill} !bg-brand-red !text-white`} disabled={busy === d.id} onClick={() => convert(d.id)}>Convert to invoice</button>
                )}
                {d.type === 'estimate' && d.converted && <span className="text-xs text-ink-muted">Converted</span>}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
