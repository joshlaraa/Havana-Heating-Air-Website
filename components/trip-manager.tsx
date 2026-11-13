'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AnimatedSelect from '@/components/ui/animated-select'
import DatePicker, { toDateString } from '@/components/ui/date-picker'
import { NumberInput, actionPrimary } from '@/components/ui/form-bits'
import { money, tripPurposes, type TripRow } from '@/lib/books-shared'

const fmt = (v: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${v}T00:00:00Z`))

export default function TripManager({ rows, year, rate, lastOdometer, fuelCost, mpg }: { rows: TripRow[]; year: number; rate: number; lastOdometer: number | null; fuelCost: number; mpg: number | null }) {
  const router = useRouter()
  const [date, setDate] = useState(() => toDateString(new Date()))
  const [purpose, setPurpose] = useState<string>('Job site')
  const [start, setStart] = useState(lastOdometer ? String(lastOdometer) : '')
  const [end, setEnd] = useState('')
  const [miles, setMiles] = useState('')
  const [customer, setCustomer] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const auto = start && end && Number(end) > Number(start) ? Math.round((Number(end) - Number(start)) * 10) / 10 : null
  const totalMiles = rows.reduce((s, r) => s + r.miles, 0)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError(''); setLoading(true)
    const res = await fetch('/api/admin/trips', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, purpose, startOdometer: start, endOdometer: end, miles: auto ?? miles, customerName: customer, notes }),
    })
    setLoading(false)
    if (!res.ok) { setError((await res.json().catch(() => null))?.error ?? 'Could not save.'); return }
    setStart(end || start); setEnd(''); setMiles(''); setCustomer(''); setNotes('')
    router.refresh()
  }
  async function remove(id: string) {
    if (!confirm('Delete this trip?')) return
    const res = await fetch(`/api/admin/trips/${id}`, { method: 'DELETE' })
    if (res.ok) router.refresh(); else setError('Could not delete.')
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm"><p className="text-xs font-medium text-ink-muted">{year} business miles</p><p className="mt-1 font-heading text-xl font-bold">{totalMiles.toLocaleString('en-US', { maximumFractionDigits: 1 })}</p></div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm"><p className="text-xs font-medium text-ink-muted">Standard deduction @ ${rate.toFixed(3).replace(/0$/, '')}/mi</p><p className="mt-1 font-heading text-xl font-bold">{money.format(totalMiles * rate)}</p></div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm"><p className="text-xs font-medium text-ink-muted">Actual fuel spend</p><p className="mt-1 font-heading text-xl font-bold">{money.format(fuelCost)}</p></div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm"><p className="text-xs font-medium text-ink-muted">Fuel cost per mile</p><p className="mt-1 font-heading text-xl font-bold">{totalMiles && fuelCost ? money.format(fuelCost / totalMiles) : '—'}{mpg ? <span className="ml-1 text-xs font-medium text-ink-muted">· {mpg.toFixed(1)} mpg</span> : null}</p></div>
      </div>
      <p className="px-1 text-xs text-ink-muted">Tip for his CPA: the standard mileage rate and actual vehicle expenses (gas, repairs) are normally either/or, not both. Confirm the current IRS rate each year.</p>

      <form onSubmit={submit} noValidate className="space-y-4 rounded-2xl border border-border bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <h2 className="heading-card">Log a trip</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          <label className="text-sm font-medium">Date<DatePicker className="mt-2" value={date} onChange={setDate} aria-label="Date" /></label>
          <label className="text-sm font-medium">Purpose<AnimatedSelect className="mt-2" options={tripPurposes.map((p) => ({ value: p, label: p }))} value={purpose} onChange={setPurpose} aria-label="Purpose" /></label>
          <label className="text-sm font-medium">Start odometer<NumberInput value={start} onChange={setStart} suffix="mi" /></label>
          <label className="text-sm font-medium">End odometer<NumberInput value={end} onChange={setEnd} suffix="mi" /></label>
          <label className="text-sm font-medium">{auto ? 'Miles (from odometer)' : 'Or just enter miles'}<NumberInput value={auto ? String(auto) : miles} onChange={setMiles} suffix="mi" className={auto ? 'bg-brand-light' : ''} /></label>
          <label className="text-sm font-medium">Customer<input className="field-input mt-2" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Optional" autoCapitalize="words" /></label>
          <label className="col-span-2 text-sm font-medium">Notes<input className="field-input mt-2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" /></label>
        </div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
        <button className={actionPrimary} disabled={loading}>{loading ? 'Saving…' : 'Save trip'}</button>
      </form>

      {rows.length === 0 && <p className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-ink-muted">No trips logged yet.</p>}
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{r.customer_name || r.purpose}</p>
                <p className="text-xs text-ink-muted">{fmt(r.trip_date)} · {r.purpose}{r.end_odometer ? ` · ${r.start_odometer ?? '?'} → ${r.end_odometer}` : ''}</p>
                {r.notes && <p className="mt-1 text-xs text-ink-muted">{r.notes}</p>}
              </div>
              <div className="text-right"><p className="font-heading text-base font-bold">{r.miles} mi</p><p className="text-xs text-ink-muted">{money.format(r.miles * rate)}</p></div>
            </div>
            <button className="mt-3 text-xs font-medium text-ink-muted hover:text-brand-red" onClick={() => remove(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
