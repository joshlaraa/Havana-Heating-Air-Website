import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { loadReport, reportCsv } from '@/lib/reports'

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const url = new URL(request.url)
  const year = Number(url.searchParams.get('year'))
  const quarter = Number(url.searchParams.get('quarter') ?? 0)
  if (!Number.isInteger(year) || year < 2000 || year > 2100 || !Number.isInteger(quarter) || quarter < 0 || quarter > 4) return NextResponse.json({ error: 'Invalid period.' }, { status: 400 })
  const report = await loadReport(year, quarter)
  return new NextResponse(reportCsv(report), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="havana-${report.label.replace(' ', '-')}.csv"`, 'Cache-Control': 'no-store' },
  })
}
