import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { isUuid } from '@/lib/documents'
import { supabase } from '@/lib/supabase'
import { RECEIPT_BUCKET } from '@/lib/books'

const SAFE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Streams the receipt through our own origin (private bucket, admin only) so it
// can be shown in a popup or downloaded, instead of redirecting to a storage URL.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const { id } = await params
  if (!isUuid(id)) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  const db = supabase()
  const { data } = await db.from('expenses').select('receipt_path').eq('id', id).maybeSingle()
  if (!data?.receipt_path) return NextResponse.json({ error: 'No receipt.' }, { status: 404 })
  const file = await db.storage.from(RECEIPT_BUCKET).download(data.receipt_path)
  if (file.error || !file.data) return NextResponse.json({ error: 'Receipt unavailable.' }, { status: 404 })
  const type = SAFE_TYPES.includes(file.data.type) ? file.data.type : 'image/jpeg'
  const ext = type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg'
  const download = new URL(request.url).searchParams.get('download') === '1'
  return new NextResponse(await file.data.arrayBuffer(), {
    headers: {
      'Content-Type': type,
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="receipt-${id.slice(0, 8)}.${ext}"`,
      'Content-Security-Policy': "default-src 'none'; sandbox",
      'Cache-Control': 'private, max-age=300',
    },
  })
}
