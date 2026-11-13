import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { isUuid } from '@/lib/documents'
import { supabase } from '@/lib/supabase'
import { RECEIPT_BUCKET } from '@/lib/books'

export async function GET(_r: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const { id } = await params
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  const db = supabase()
  const { data } = await db.from('expenses').select('receipt_path').eq('id', id).maybeSingle()
  if (!data?.receipt_path) return NextResponse.json({ error: 'No receipt.' }, { status: 404 })
  const signed = await db.storage.from(RECEIPT_BUCKET).createSignedUrl(data.receipt_path, 60)
  if (!signed.data) return NextResponse.json({ error: 'Receipt unavailable.' }, { status: 404 })
  return NextResponse.redirect(signed.data.signedUrl)
}
