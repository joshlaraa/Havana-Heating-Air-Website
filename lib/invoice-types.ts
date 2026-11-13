export const paymentStatuses = ['unpaid', 'partial', 'paid', 'overdue'] as const
export const paymentMethods = ['cash', 'check', 'card', 'bank-transfer', 'other'] as const

export const estimateStatuses = ['draft', 'sent', 'accepted', 'declined', 'expired'] as const
export type DocType = 'invoice' | 'estimate'
export type EstimateStatus = (typeof estimateStatuses)[number]

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

export type Invoice = Omit<InvoiceInput, 'paymentStatus'> & {
  docType?: DocType
  paymentStatus: InvoiceStatus | EstimateStatus
  invoiceNumber: string
  totals: InvoiceTotals
}
