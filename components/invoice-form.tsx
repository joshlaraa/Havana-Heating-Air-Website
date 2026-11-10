'use client'

import { useState } from 'react'
import type { InvoiceLineItem } from '@/lib/invoice-types'
import AnimatedSelect from '@/components/ui/animated-select'
import DatePicker, { toDateString } from '@/components/ui/date-picker'

type ServiceOption = { id: string; label: string; price: number }
type Props = { services: readonly ServiceOption[] }

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
      customerName: form.get('customerName'), customerEmail, customerPhone: form.get('customerPhone'),
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
    <form noValidate onSubmit={submit} className="space-y-4 pb-6 sm:space-y-8">
      <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <h2 className="heading-card mb-5">Customer information</h2>
        <div className="grid gap-3 sm:gap-5 md:grid-cols-2">
          <label className="text-sm font-medium">Customer name <span className="text-red-400">*</span><input className={fieldClass('customerName')} name="customerName" onChange={() => clearInvalid('customerName')} aria-invalid={invalid.includes('customerName')} /></label>
          <label className="text-sm font-medium">Customer email<input className={fieldClass('customerEmail')} name="customerEmail" type="email" value={customerEmail} onChange={(event) => { setCustomerEmail(event.target.value); clearInvalid('customerEmail') }} aria-invalid={invalid.includes('customerEmail')} /></label>
          <label className="text-sm font-medium">Customer phone<input className="field-input mt-2" name="customerPhone" type="tel" /></label>
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
              <label className="text-sm font-medium">Quantity<input className="field-input mt-2" type="number" min="0.01" step="0.01" value={item.quantity} onChange={(event) => updateItem(index, { quantity: Number(event.target.value) })} /></label>
              <label className="text-sm font-medium">Unit price<div className="relative mt-2"><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-faint">$</span><input className="field-input pl-8" type="number" inputMode="decimal" min="0" step="0.01" value={item.unitPrice} onChange={(event) => updateItem(index, { unitPrice: Number(event.target.value) })} /></div></label>
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
          <label className="text-sm font-medium">Discount<div className="relative mt-2"><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-faint">$</span><input className="field-input pl-8" name="discount" type="number" min="0" step="0.01" defaultValue="0" /></div></label>
          <label className="text-sm font-medium">Tax<div className="relative mt-2"><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-faint">$</span><input className="field-input pl-8" name="tax" type="number" min="0" step="0.01" defaultValue="0" /></div></label>
          <label className="text-sm font-medium">Payment status<AnimatedSelect className="mt-2" name="paymentStatus" options={[{ value: 'unpaid', label: 'Unpaid' }, { value: 'partial', label: 'Partial' }, { value: 'paid', label: 'Paid' }, { value: 'overdue', label: 'Overdue' }]} value={paymentStatus} onChange={setPaymentStatus} aria-label="Payment status" /></label>
          <label className="text-sm font-medium">Payment method<AnimatedSelect className="mt-2" name="paymentMethod" options={[{ value: 'cash', label: 'Cash' }, { value: 'check', label: 'Check' }, { value: 'card', label: 'Card' }, { value: 'bank-transfer', label: 'Bank transfer' }, { value: 'other', label: 'Other' }]} value={paymentMethod} onChange={setPaymentMethod} aria-label="Payment method" /></label>
          <label className="col-span-2 text-sm font-medium">Notes / terms<textarea className="field-input mt-2" name="notes" rows={2} placeholder="Thank you for choosing us." /></label>
        </div>
      </section>
      {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p>}
      {message && <p className="rounded-xl bg-green-50 p-4 text-sm text-green-700" role="status">{message} {invoiceNumber}</p>}
      <div className="sticky bottom-0 -mx-4 flex flex-wrap gap-2 border-t border-border bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:gap-3 sm:border-0 sm:bg-transparent sm:p-0 [&>*]:flex-1 sm:[&>*]:flex-none">
        <button className="btn-primary" disabled={loading}>{loading ? 'Creating…' : 'Create invoice'}</button>
        {pdfUrl && <><a className="btn-submit w-auto" href={pdfUrl} download={`${invoiceNumber}.pdf`}>Download PDF</a><a className="btn-submit w-auto" href={pdfUrl} target="_blank" rel="noreferrer">Open in new tab</a>{typeof navigator !== 'undefined' && 'share' in navigator && <button type="button" className="btn-submit w-auto" onClick={sharePdf}>Share PDF</button>}{customerEmail && <button type="button" className="btn-submit w-auto" onClick={emailClient}>Open email to client</button>}</>}
      </div>
    </form>
  )
}
