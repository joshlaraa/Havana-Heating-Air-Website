import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { getDocument, isUuid, rowToInvoice, updateDocumentStatus } from '@/lib/documents'
import { generateInvoicePdf } from '@/lib/invoice-pdf'
import { estimateStatuses, paymentStatuses } from '@/lib/invoice-types'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Ctx) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const { id } = await params
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  const row = await getDocument(id)
  if (!row) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  const bytes = await generateInvoicePdf(rowToInvoice(row))
  return new NextResponse(bytes as BodyInit, {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="${row.number}.pdf"`, 'Cache-Control': 'no-store' },
  })
}

export async function PATCH(request: Request, { params }: Ctx) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const { id } = await params
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  const row = await getDocument(id)
  if (!row) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  const { status } = (await request.json().catch(() => ({}))) as { status?: string }
  const allowed: readonly string[] = row.type === 'estimate' ? estimateStatuses : paymentStatuses
  if (!status || !allowed.includes(status)) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
  await updateDocumentStatus(id, status)
  return NextResponse.json({ ok: true })
}
