import { NextResponse } from 'next/server'
import { generateInvoicePdf } from '@/lib/invoice-pdf'
import { getInvoiceService } from '@/lib/business'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { paymentMethods, paymentStatuses, type Invoice, type InvoiceInput } from '@/lib/invoice-types'

function validDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime())
}

function cleanNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function validateInput(body: unknown): InvoiceInput | string {
  if (!body || typeof body !== 'object') return 'A valid invoice payload is required.'
  const input = body as Partial<InvoiceInput>
  if (typeof input.customerName !== 'string' || !input.customerName.trim()) return 'Customer name is required.'
  if (input.customerEmail && (typeof input.customerEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.customerEmail))) return 'Enter a valid customer email.'
  if (typeof input.customerAddress !== 'string' || !input.customerAddress.trim()) return 'Customer address is required.'
  if (!validDate(input.invoiceDate) || !validDate(input.dueDate)) return 'Invoice and due dates must be valid.'
  if (new Date(`${input.dueDate}T00:00:00Z`) < new Date(`${input.invoiceDate}T00:00:00Z`)) return 'Due date cannot be before invoice date.'
  if (!Array.isArray(input.items) || input.items.length < 1) return 'At least one service is required.'
  if (!paymentStatuses.includes(input.paymentStatus as (typeof paymentStatuses)[number])) return 'Invalid payment status.'
  if (!paymentMethods.includes(input.paymentMethod as (typeof paymentMethods)[number])) return 'Invalid payment method.'
  const discount = input.discount
  const tax = input.tax
  if (!cleanNumber(discount) || discount < 0 || !cleanNumber(tax) || tax < 0) return 'Discount and tax must be non-negative amounts.'

  const items = input.items.map((item) => {
    const service = getInvoiceService(item.serviceId)
    if (!service || typeof item.description !== 'string' || !item.description.trim()) throw new Error('Each line item must use a valid service and description.')
    if (!cleanNumber(item.quantity) || item.quantity <= 0 || item.quantity > 10000) throw new Error('Quantities must be greater than zero.')
    if (!cleanNumber(item.unitPrice) || item.unitPrice < 0 || item.unitPrice > 10000000) throw new Error('Prices must be valid, non-negative amounts.')
    return { serviceId: service.id, description: item.description.trim(), quantity: item.quantity, unitPrice: item.unitPrice }
  })
  return {
    customerName: input.customerName.trim(),
    customerEmail: typeof input.customerEmail === 'string' ? input.customerEmail.trim() : '',
    customerPhone: typeof input.customerPhone === 'string' ? input.customerPhone.trim() : '',
    customerAddress: input.customerAddress.trim(),
    items,
    discount,
    tax,
    invoiceDate: input.invoiceDate,
    dueDate: input.dueDate,
    paymentStatus: input.paymentStatus as InvoiceInput['paymentStatus'],
    paymentMethod: input.paymentMethod as InvoiceInput['paymentMethod'],
    notes: typeof input.notes === 'string' ? input.notes.trim() : '',
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Administrator authentication required.' }, { status: 401 })
  try {
    const result = validateInput(await request.json())
    if (typeof result === 'string') return NextResponse.json({ error: result }, { status: 400 })
    const subtotal = result.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const discount = Math.min(result.discount, subtotal)
    const total = Math.max(0, subtotal - discount + result.tax)
    const invoice: Invoice = {
      ...result,
      invoiceNumber: `INV-${result.invoiceDate.replaceAll('-', '')}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
      totals: { subtotal, discount, tax: result.tax, total },
    }
    const bytes = await generateInvoicePdf(invoice)
    return new NextResponse(bytes as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${invoice.invoiceNumber}.pdf"`,
        'X-Invoice-Number': invoice.invoiceNumber,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate invoice.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
