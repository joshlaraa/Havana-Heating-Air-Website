import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { listCustomers } from '@/lib/documents'
import { isSupabaseConfigured } from '@/lib/supabase'

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  if (!isSupabaseConfigured()) return NextResponse.json({ customers: [] })
  return NextResponse.json({ customers: await listCustomers() })
}
