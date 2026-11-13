'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import AnimatedSelect from '@/components/ui/animated-select'
import DatePicker, { toDateString } from '@/components/ui/date-picker'
import { MoneyInput, NumberInput, SaveButton, useSaveStatus } from '@/components/ui/form-bits'
import ReceiptViewer from '@/components/receipt-viewer'
import { expenseCategories, materialCategories, money, paymentMethodsExpense, type ExpenseRow } from '@/lib/books-shared'

const fmt = (v: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${v}T00:00:00Z`))

/** Downscale phone photos so they upload fast and stay well under body limits. */
async function shrink(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) return file
  const bitmap = await createImageBitmap(file).catch(() => null)
  if (!bitmap) return file
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return (await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.8))) ?? file
}

export default function ExpenseManager({ rows, year, lastOdometer, mpg }: { rows: ExpenseRow[]; year: number; lastOdometer: number | null; mpg: number | null }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [date, setDate] = useState(() => toDateString(new Date()))
  const [category, setCategory] = useState<string>('Parts & materials')
  const [method, setMethod] = useState<string>('Card')
  const [amount, setAmount] = useState(0)
  const [vendor, setVendor] = useState('')
  const [notes, setNotes] = useState('')
  const [salesTax, setSalesTax] = useState(0)
  const [gallons, setGallons] = useState('')
  const [odometer, setOdometer] = useState('')
  const [fileName, setFileName] = useState('')
  const save = useSaveStatus()
  const [viewing, setViewing] = useState<ExpenseRow | null>(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [moneyKey, setMoneyKey] = useState(0)
  const [filter, setFilter] = useState('All')

  const isFuel = category === 'Fuel'
  const showTax = (materialCategories as readonly string[]).includes(category)
  const showOdo = isFuel || category === 'Vehicle maintenance'
  const total = rows.reduce((s, r) => s + r.amount, 0)
  const taxPaid = rows.reduce((s, r) => s + r.sales_tax_paid, 0)
  const byCat = Object.entries(rows.reduce<Record<string, number>>((m, r) => ({ ...m, [r.category]: (m[r.category] ?? 0) + r.amount }), {})).sort((a, b) => b[1] - a[1])
  const shown = rows.filter((r) => filter === 'All' || r.category === filter)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    if (!amount) { setError('Enter the amount.'); return }
    save.start()
    const form = new FormData()
    Object.entries({ date, category, paymentMethod: method, amount: String(amount), vendor, notes, gallons, odometer, salesTax: showTax ? String(salesTax) : '' }).forEach(([k, v]) => form.set(k, v))
    const file = fileRef.current?.files?.[0]
    if (file) {
      try { form.set('receipt', await shrink(file), 'receipt.jpg') } catch { save.fail(); setError('Could not read that photo. Try taking it again.'); return }
    }
    const res = await fetch('/api/admin/expenses', { method: 'POST', body: form }).catch(() => null)
    if (!res || !res.ok) { save.fail(); setError((await res?.json().catch(() => null))?.error ?? 'Could not save. Check your connection and try again.'); return }
    save.succeed()
    setPreview('')
    setAmount(0); setSalesTax(0); setVendor(''); setNotes(''); setGallons(''); setOdometer(''); setFileName(''); setMoneyKey((k) => k + 1)
    if (fileRef.current) fileRef.current.value = ''
    router.refresh()
  }
  async function remove(id: string) {
    if (!confirm('Delete this expense?')) return
    const res = await fetch(`/api/admin/expenses/${id}`, { method: 'DELETE' })
    if (res.ok) router.refresh(); else setError('Could not delete.')
  }

  return (
    <div className="space-y-5">
      <form onSubmit={submit} noValidate className="space-y-4 rounded-2xl border border-border bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <h2 className="heading-card">Add an expense</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          <label className="text-sm font-medium">Date<DatePicker className="mt-2" value={date} onChange={setDate} aria-label="Date" /></label>
          <label className="text-sm font-medium">Amount<MoneyInput key={moneyKey} onValueChange={setAmount} /></label>
          <label className="col-span-2 text-sm font-medium">Category<AnimatedSelect className="mt-2" options={expenseCategories.map((c) => ({ value: c, label: c }))} value={category} onChange={setCategory} aria-label="Category" /></label>
          {showTax && <label className="col-span-2 text-sm font-medium">Sales tax paid (optional)<MoneyInput key={`t${moneyKey}`} onValueChange={setSalesTax} /><span className="mt-1 block text-xs font-normal text-ink-muted">The tax portion already included in the amount above.</span></label>}
          {isFuel && <label className="text-sm font-medium">Gallons<NumberInput value={gallons} onChange={setGallons} placeholder="0.0" suffix="gal" /></label>}
          {showOdo && <label className="text-sm font-medium">Odometer<NumberInput value={odometer} onChange={setOdometer} placeholder={lastOdometer ? String(lastOdometer) : '0'} suffix="mi" /></label>}
          <label className="text-sm font-medium">Vendor<input className="field-input mt-2" value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="Home Depot, Shell…" autoCapitalize="words" /></label>
          <label className="text-sm font-medium">Paid with<AnimatedSelect className="mt-2" options={paymentMethodsExpense.map((c) => ({ value: c, label: c }))} value={method} onChange={setMethod} aria-label="Paid with" /></label>
          <label className="col-span-2 text-sm font-medium">Notes<input className="field-input mt-2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" /></label>
        </div>
        <div>
          <input ref={fileRef} id="receipt" type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; setFileName(f?.name ?? ''); setPreview((old) => { if (old) URL.revokeObjectURL(old); return f ? URL.createObjectURL(f) : '' }) }} />
          <label htmlFor="receipt" className="inline-flex h-11 cursor-pointer items-center rounded-[14px] bg-ink/[0.07] px-5 text-[15px] font-medium text-ink transition active:scale-[0.98]">{fileName ? 'Change receipt photo' : 'Add receipt photo'}</label>
          {preview && (
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-green-50 p-2 pr-4 ring-1 ring-green-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Receipt preview" className="h-14 w-14 rounded-lg object-cover" />
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-800">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Receipt attached
              </span>
            </div>
          )}
        </div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
        <SaveButton status={save.status} idle="Save expense" saving={fileName ? 'Uploading receipt…' : 'Saving…'} done="Saved" />
      </form>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm"><p className="text-xs font-medium text-ink-muted">Sales tax paid on materials</p><p className="mt-1 font-heading text-xl font-bold">{money.format(taxPaid)}</p></div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm"><p className="text-xs font-medium text-ink-muted">{year} expenses</p><p className="mt-1 font-heading text-xl font-bold">{money.format(total)}</p></div>
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm"><p className="text-xs font-medium text-ink-muted">Avg fuel economy</p><p className="mt-1 font-heading text-xl font-bold">{mpg ? `${mpg.toFixed(1)} mpg` : '—'}</p></div>
      </div>

      {byCat.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[['All', total] as const, ...byCat].map(([c, v]) => (
            <button key={c} onClick={() => setFilter(c)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${filter === c ? 'bg-ink text-white' : 'bg-white text-ink-secondary ring-1 ring-border'}`}>{c} · {money.format(v)}</button>
          ))}
        </div>
      )}

      {shown.length === 0 && <p className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-ink-muted">No expenses logged yet.</p>}
      <ul className="space-y-2">
        {shown.map((r) => (
          <li key={r.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{r.vendor || r.category}</p>
                <p className="text-xs text-ink-muted">{fmt(r.expense_date)} · {r.category} · {r.payment_method}{r.sales_tax_paid ? ` · incl. ${money.format(r.sales_tax_paid)} tax` : ''}{r.gallons ? ` · ${r.gallons} gal` : ''}{r.odometer ? ` · ${r.odometer} mi` : ''}</p>
                {r.notes && <p className="mt-1 text-xs text-ink-muted">{r.notes}</p>}
              </div>
              <p className="font-heading text-base font-bold">{money.format(r.amount)}</p>
            </div>
            <div className="mt-3 flex gap-4 text-xs font-medium">
              {r.receipt_path && <button className="text-brand-red" onClick={() => setViewing(r)}>View receipt</button>}
              <button className="text-ink-muted hover:text-brand-red" onClick={() => remove(r.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {viewing && <ReceiptViewer id={viewing.id} title={`${viewing.vendor || viewing.category} · ${fmt(viewing.expense_date)}`} onClose={() => setViewing(null)} />}
    </div>
  )
}
