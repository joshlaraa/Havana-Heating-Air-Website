import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { getDocument, isUuid, rowToInvoice, saveDocument, updateDocumentStatus } from '@/lib/documents'
import type { Invoice } from '@/lib/invoice-types'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const { id } = await params
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  const row = await getDocument(id)
  if (!row || row.type !== 'estimate') return NextResponse.json({ error: 'Estimate not found.' }, { status: 404 })
  const today = new Date().toISOString().slice(0, 10)
  const base = rowToInvoice(row)
  const invoice: Invoice = {
    ...base,
    docType: 'invoice',
    invoiceNumber: `INV-${today.replaceAll('-', '')}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
    invoiceDate: today,
    dueDate: today,
    paymentStatus: 'unpaid',
    paymentMethod: 'other',
  }
  const created = await saveDocument(invoice, id)
  await updateDocumentStatus(id, 'accepted')
  return NextResponse.json({ id: created.id, number: created.number })
}
