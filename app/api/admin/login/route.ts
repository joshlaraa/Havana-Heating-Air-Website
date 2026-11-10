import { NextResponse } from 'next/server'
import { setAdminSession, verifyAdminCredentials } from '@/lib/admin-auth'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body.email !== 'string' || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }
  if (!verifyAdminCredentials(body.email.trim(), body.password)) {
    return NextResponse.json({ error: 'Invalid administrator credentials.' }, { status: 401 })
  }
  await setAdminSession()
  return NextResponse.json({ ok: true })
}
