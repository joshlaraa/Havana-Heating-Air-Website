import { supabase } from '@/lib/supabase'
import type { DocType, Invoice } from '@/lib/invoice-types'

export type DocumentRow = {
  id: string
  type: DocType
  number: string
  customer_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  items: Invoice['items']
  subtotal: number
  discount: number
  tax: number
  total: number
  issue_date: string
  due_date: string
  status: string
  payment_method: string
  notes: string
  converted_from: string | null
  created_at: string
}

export type CustomerRow = { id: string; name: string; email: string; phone: string; address: string }

const num = (v: unknown) => Number(v) || 0

export function rowToInvoice(row: DocumentRow): Invoice {
  return {
    docType: row.type,
    invoiceNumber: row.number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    customerAddress: row.customer_address,
    items: row.items,
    discount: num(row.discount),
    tax: num(row.tax),
    invoiceDate: row.issue_date,
    dueDate: row.due_date,
    paymentStatus: row.status as Invoice['paymentStatus'],
    paymentMethod: row.payment_method as Invoice['paymentMethod'],
    notes: row.notes,
    totals: { subtotal: num(row.subtotal), discount: num(row.discount), tax: num(row.tax), total: num(row.total) },
  }
}

async function upsertCustomer(invoice: Invoice) {
  const db = supabase()
  const { data: existing } = await db
    .from('customers')
    .select('id')
    .ilike('name', invoice.customerName.replace(/[%_]/g, '\\$&'))
    .ilike('address', invoice.customerAddress.replace(/[%_]/g, '\\$&'))
    .limit(1)
    .maybeSingle()
  const fields = {
    name: invoice.customerName,
    email: invoice.customerEmail,
    phone: invoice.customerPhone,
    address: invoice.customerAddress,
    updated_at: new Date().toISOString(),
  }
  if (existing) {
    await db.from('customers').update(fields).eq('id', existing.id)
    return existing.id as string
  }
  const { data, error } = await db.from('customers').insert(fields).select('id').single()
  if (error) throw error
  return data.id as string
}

export async function saveDocument(invoice: Invoice, convertedFrom?: string) {
  const customerId = await upsertCustomer(invoice)
  const { data, error } = await supabase()
    .from('documents')
    .insert({
      type: invoice.docType ?? 'invoice',
      number: invoice.invoiceNumber,
      customer_id: customerId,
      customer_name: invoice.customerName,
      customer_email: invoice.customerEmail,
      customer_phone: invoice.customerPhone,
      customer_address: invoice.customerAddress,
      items: invoice.items,
      subtotal: invoice.totals.subtotal,
      discount: invoice.totals.discount,
      tax: invoice.totals.tax,
      total: invoice.totals.total,
      issue_date: invoice.invoiceDate,
      due_date: invoice.dueDate,
      status: invoice.paymentStatus,
      payment_method: invoice.paymentMethod,
      notes: invoice.notes,
      converted_from: convertedFrom ?? null,
    })
    .select('*')
    .single()
  if (error) throw error
  return data as DocumentRow
}

export async function listDocuments() {
  const { data, error } = await supabase().from('documents').select('*').order('created_at', { ascending: false }).limit(200)
  if (error) throw error
  return (data ?? []) as DocumentRow[]
}

export async function getDocument(id: string) {
  const { data, error } = await supabase().from('documents').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as DocumentRow | null
}

export async function updateDocumentStatus(id: string, status: string) {
  const { error } = await supabase().from('documents').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export async function listCustomers() {
  const { data, error } = await supabase().from('customers').select('id,name,email,phone,address').order('name').limit(500)
  if (error) throw error
  return (data ?? []) as CustomerRow[]
}

export const isUuid = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)
