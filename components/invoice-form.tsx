'use client'

import { useEffect, useState } from 'react'
import type { InvoiceLineItem } from '@/lib/invoice-types'
import AnimatedSelect from '@/components/ui/animated-select'
import DatePicker, { toDateString } from '@/components/ui/date-picker'

type ServiceOption = { id: string; label: string; price: number }
type Props = { services: readonly ServiceOption[] }

const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, '').slice(0, 10)
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}
const sanitizeMoney = (raw: string) => {
  const cleaned = raw.replace(/[^\d.]/g, '')
  const [whole, ...rest] = cleaned.split('.')
  return rest.length ? `${whole}.${rest.join('').slice(0, 2)}` : whole
}

function MoneyInput({ value, onValueChange, name, className = '', prefix = true }: { value?: number; onValueChange?: (n: number) => void; name?: string; className?: string; prefix?: boolean }) {
  const [text, setText] = useState(() => (value ? value.toFixed(2) : ''))
  useEffect(() => {
    if (value !== undefined && value !== (Number(text) || 0)) setText(value ? value.toFixed(2) : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return (
    <div className="relative mt-2">
      {prefix && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-faint">$</span>}
      <input
        className={`field-input pl-8 ${className}`}
        name={name}
        type="text"
        inputMode="decimal"
        enterKeyHint="done"
        placeholder="0.00"
        autoComplete="off"
        value={text}
        onChange={(event) => { const next = sanitizeMoney(event.target.value); setText(next); onValueChange?.(Number(next) || 0) }}
        onBlur={() => { if (text) setText((Number(text) || 0).toFixed(2)) }}
      />
    </div>
  )
}

const actionBase = 'inline-flex h-12 w-full items-center justify-center rounded-[14px] px-5 text-[15px] font-medium tracking-tight transition-[transform,background-color,opacity] duration-150 active:scale-[0.98] active:opacity-80 disabled:opacity-50 sm:w-auto'
const actionPrimary = `${actionBase} bg-brand-red text-white hover:bg-brand-red/90`
const actionSecondary = `${actionBase} bg-ink/[0.07] text-ink hover:bg-ink/[0.11]`

const qtyText = (n: number) => (n ? String(n) : '')
const emptyItem = (service: ServiceOption): InvoiceLineItem => ({
  serviceId: service.id,
  description: service.label,
  quantity: 1,
  unitPrice: service.price,
})

export default function InvoiceForm({ services }: Props) {
  const [items, setItems] = useState<InvoiceLineItem[]>([emptyItem(services[0])])
  const [today] = useState(() => toDateString(new Date()))
  const [invoiceDate, setInvoiceDate] = useState(today)
  const [dueDate, setDueDate] = useState(today)
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('unpaid')
  const [paymentMethod, setPaymentMethod] = useState('other')
  const [pdfUrl, setPdfUrl] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [invalid, setInvalid] = useState<string[]>([])
  const fieldClass = (name: string) => `field-input mt-2 ${invalid.includes(name) ? '!border-red-300 !bg-red-50/70 focus:!ring-red-100' : ''}`
  const clearInvalid = (name: string) => setInvalid((current) => current.filter((n) => n !== name))

  function updateItem(index: number, patch: Partial<InvoiceLineItem>) {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item))
  }
  function selectService(index: number, serviceId: string) {
    const service = services.find((option) => option.id === serviceId)
    if (service) updateItem(index, { serviceId, description: service.label, unitPrice: service.price })
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(''); setMessage('')
    const form = new FormData(event.currentTarget)
    const missing = ['customerName', 'customerAddress'].filter((name) => !String(form.get(name) ?? '').trim())
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) missing.push('customerEmail')
    setInvalid(missing)
    if (missing.length) { setError('Please complete the highlighted customer information.'); return }
    setLoading(true)
    const payload = {
      customerName: form.get('customerName'), customerEmail, customerPhone,
      customerAddress: form.get('customerAddress'), items, discount: Number(form.get('discount') || 0),
      tax: Number(form.get('tax') || 0), invoiceDate: form.get('invoiceDate'), dueDate: form.get('dueDate'),
      paymentStatus: form.get('paymentStatus'), paymentMethod: form.get('paymentMethod'), notes: form.get('notes'),
    }
    const response = await fetch('/api/admin/invoices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (!response.ok) {
      setError((await response.json().catch(() => null))?.error ?? 'Unable to generate invoice.')
      setLoading(false)
      return
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    setPdfUrl(url); setInvoiceNumber(response.headers.get('X-Invoice-Number') ?? ''); setMessage('Invoice generated successfully.')
    setLoading(false)
  }
  function emailClient() {
    if (!customerEmail || !invoiceNumber) return
    window.location.href = `mailto:${encodeURIComponent(customerEmail)}?subject=${encodeURIComponent(`${invoiceNumber} from Havana Heating and Air`)}&body=${encodeURIComponent(`Hello,\n\nPlease find your invoice ${invoiceNumber} from Havana Heating and Air. Please attach the generated invoice PDF to this email before sending.\n\nThank you,`)}`
  }
  async function sharePdf() {
    if (!pdfUrl || !navigator.share) return
    const blob = await fetch(pdfUrl).then((response) => response.blob())
    const file = new File([blob], `${invoiceNumber || 'invoice'}.pdf`, { type: 'application/pdf' })
    if (navigator.canShare?.({ files: [file] })) await navigator.share({ title: invoiceNumber, files: [file] })
  }
  return (
    <form noValidate onSubmit={submit} className="mx-auto w-full min-w-0 space-y-4 pb-6 sm:space-y-8">
      <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <h2 className="heading-card mb-5">Customer information</h2>
        <div className="grid gap-3 sm:gap-5 md:grid-cols-2">
          <label className="text-sm font-medium">Customer name <span className="text-red-400">*</span><input className={fieldClass('customerName')} name="customerName" onChange={() => clearInvalid('customerName')} aria-invalid={invalid.includes('customerName')} /></label>
          <label className="text-sm font-medium">Customer email<input className={fieldClass('customerEmail')} name="customerEmail" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="name@example.com" value={customerEmail} onChange={(event) => { setCustomerEmail(event.target.value); clearInvalid('customerEmail') }} aria-invalid={invalid.includes('customerEmail')} /></label>
          <label className="text-sm font-medium">Customer phone<input className="field-input mt-2" name="customerPhone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(555) 555-5555" value={customerPhone} onChange={(event) => setCustomerPhone(formatPhone(event.target.value))} /></label>
          <label className="text-sm font-medium md:col-span-2">Billing / service address <span className="text-red-400">*</span><textarea className={fieldClass('customerAddress')} name="customerAddress" rows={2} onChange={() => clearInvalid('customerAddress')} aria-invalid={invalid.includes('customerAddress')} /></label>
        </div>
      </section>
      <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4"><h2 className="heading-card">Services</h2><button type="button" className="link-cta" onClick={() => setItems((current) => [...current, emptyItem(services[0])])}>+ Add service</button></div>
        <div className="space-y-5">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-2 gap-3 rounded-2xl bg-brand-light p-3 md:grid-cols-[1.2fr_1.5fr_90px_130px_auto] md:items-end md:p-4">
              <label className="col-span-2 text-sm font-medium md:col-span-1">Service<AnimatedSelect className="mt-2" options={services.map((service) => ({ value: service.id, label: service.label }))} value={item.serviceId} onChange={(value) => selectService(index, value)} aria-label={`Service ${index + 1}`} /></label>
              <label className="col-span-2 text-sm font-medium md:col-span-1">Description<input className="field-input mt-2" value={item.description} onChange={(event) => updateItem(index, { description: event.target.value })} required /></label>
              <label className="text-sm font-medium">Quantity<input className="field-input mt-2" type="text" inputMode="decimal" value={qtyText(item.quantity)} onChange={(event) => updateItem(index, { quantity: Number(sanitizeMoney(event.target.value)) || 0 })} /></label>
              <label className="text-sm font-medium">Unit price<MoneyInput value={item.unitPrice} onValueChange={(n) => updateItem(index, { unitPrice: n })} /></label>
              {items.length > 1 && <button type="button" className="col-span-2 py-2 text-sm text-ink-muted hover:text-brand-red md:col-span-1 md:pb-3" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>}
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <h2 className="heading-card mb-5">Invoice details</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          <label className="text-sm font-medium">Invoice date<DatePicker className="mt-2" name="invoiceDate" value={invoiceDate} onChange={setInvoiceDate} required aria-label="Invoice date" /></label>
          <label className="text-sm font-medium">Due date<DatePicker className="mt-2" name="dueDate" value={dueDate} onChange={setDueDate} required aria-label="Due date" /></label>
          <label className="text-sm font-medium">Discount<MoneyInput name="discount" /></label>
          <label className="text-sm font-medium">Tax<MoneyInput name="tax" /></label>
          <label className="text-sm font-medium">Payment status<AnimatedSelect className="mt-2" name="paymentStatus" options={[{ value: 'unpaid', label: 'Unpaid' }, { value: 'partial', label: 'Partial' }, { value: 'paid', label: 'Paid' }, { value: 'overdue', label: 'Overdue' }]} value={paymentStatus} onChange={setPaymentStatus} aria-label="Payment status" /></label>
          <label className="text-sm font-medium">Payment method<AnimatedSelect className="mt-2" name="paymentMethod" options={[{ value: 'cash', label: 'Cash' }, { value: 'check', label: 'Check' }, { value: 'card', label: 'Card' }, { value: 'bank-transfer', label: 'Bank transfer' }, { value: 'other', label: 'Other' }]} value={paymentMethod} onChange={setPaymentMethod} aria-label="Payment method" /></label>
          <label className="col-span-2 text-sm font-medium">Notes / terms<textarea className="field-input mt-2" name="notes" rows={2} placeholder="Thank you for choosing us." /></label>
        </div>
      </section>
      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p>}
      {message && <p className="rounded-xl bg-green-50 p-4 text-sm text-green-700" role="status">{message} {invoiceNumber}</p>}
      <div className="sticky bottom-0 z-20 -mx-4 space-y-2 border-t border-border/70 bg-white/80 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:static sm:mx-0 sm:flex sm:flex-wrap sm:gap-3 sm:space-y-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <button className={actionPrimary} disabled={loading}>{loading ? 'Creating…' : 'Create invoice'}</button>
        {pdfUrl && (
          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
            <a className={actionSecondary} href={pdfUrl} download={`${invoiceNumber}.pdf`}>Download PDF</a>
            <a className={actionSecondary} href={pdfUrl} target="_blank" rel="noreferrer">Open in new tab</a>
            {typeof navigator !== 'undefined' && 'share' in navigator && <button type="button" className={actionSecondary} onClick={sharePdf}>Share PDF</button>}
            {customerEmail && <button type="button" className={actionSecondary} onClick={emailClient}>Email client</button>}
          </div>
        )}
      </div>
    </form>
  )
}
