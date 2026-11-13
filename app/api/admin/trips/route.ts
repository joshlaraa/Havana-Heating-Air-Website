import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { supabase } from '@/lib/supabase'
import { isoDate, tripPurposes } from '@/lib/books-shared'

const num = (v: unknown) => (v === '' || v == null ? null : Number(v))

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const b = await request.json().catch(() => null)
  if (!b || !isoDate(b.date)) return NextResponse.json({ error: 'Enter a valid date.' }, { status: 400 })
  const purpose = String(b.purpose ?? '')
  if (!(tripPurposes as readonly string[]).includes(purpose)) return NextResponse.json({ error: 'Choose a purpose.' }, { status: 400 })
  const start = num(b.startOdometer), end = num(b.endOdometer)
  if ([start, end].some((n) => n !== null && (!Number.isFinite(n) || n! < 0))) return NextResponse.json({ error: 'Odometer readings must be numbers.' }, { status: 400 })
  let miles = num(b.miles)
  if (start !== null && end !== null) {
    if (end <= start) return NextResponse.json({ error: 'Ending odometer must be higher than starting.' }, { status: 400 })
    miles = Math.round((end - start) * 10) / 10
  }
  if (miles === null || !Number.isFinite(miles) || miles <= 0 || miles > 5000) return NextResponse.json({ error: 'Enter the miles driven.' }, { status: 400 })
  const { error } = await supabase().from('trips').insert({
    trip_date: b.date, start_odometer: start, end_odometer: end, miles, purpose,
    customer_name: String(b.customerName ?? '').trim().slice(0, 120), notes: String(b.notes ?? '').trim().slice(0, 500),
  })
  if (error) { console.error(error); return NextResponse.json({ error: 'Could not save the trip.' }, { status: 500 }) }
  return NextResponse.json({ ok: true })
}
