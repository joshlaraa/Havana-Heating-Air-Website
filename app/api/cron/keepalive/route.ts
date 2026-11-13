import { NextResponse } from 'next/server'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

// Daily ping so the free Supabase project never auto-pauses from inactivity.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: true, skipped: true })
  const { error } = await supabase().from('customers').select('id', { head: true, count: 'exact' })
  return NextResponse.json({ ok: !error }, { status: error ? 500 : 200 })
}
