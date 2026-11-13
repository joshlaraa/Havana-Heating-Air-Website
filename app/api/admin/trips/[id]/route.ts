import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { isUuid } from '@/lib/documents'
import { supabase } from '@/lib/supabase'

export async function DELETE(_r: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const { id } = await params
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  const { error } = await supabase().from('trips').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'Could not delete.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
