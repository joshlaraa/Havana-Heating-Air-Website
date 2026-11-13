import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { isUuid } from '@/lib/documents'
import { supabase } from '@/lib/supabase'
import { RECEIPT_BUCKET } from '@/lib/books'

export async function DELETE(_r: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const { id } = await params
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  const db = supabase()
  const { data } = await db.from('expenses').select('receipt_path').eq('id', id).maybeSingle()
  const { error } = await db.from('expenses').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Could not delete.' }, { status: 500 })
  if (data?.receipt_path) await db.storage.from(RECEIPT_BUCKET).remove([data.receipt_path])
  return NextResponse.json({ ok: true })
}
