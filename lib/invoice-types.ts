export const paymentStatuses = ['unpaid', 'partial', 'paid', 'overdue'] as const
export const paymentMethods = ['cash', 'check', 'card', 'bank-transfer', 'other'] as const

export type InvoiceStatus = (typeof paymentStatuses)[number]
export type PaymentMethod = (typeof paymentMethods)[number]

export type InvoiceLineItem = {
  serviceId: string
  description: string
  quantity: number
  unitPrice: number
}

export type InvoiceInput = {
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  items: InvoiceLineItem[]
  discount: number
  tax: number
  invoiceDate: string
  dueDate: string
  paymentStatus: InvoiceStatus
  paymentMethod: PaymentMethod
  notes: string
}

export type InvoiceTotals = {
  subtotal: number
  discount: number
  tax: number
  total: number
}

export type Invoice = InvoiceInput & {
  invoiceNumber: string
  totals: InvoiceTotals
}
