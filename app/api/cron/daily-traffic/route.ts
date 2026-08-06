import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildDailyTrafficEmail } from '@/lib/lead-email'
import { getSiteTrafficSnapshot } from '@/lib/site-analytics'

export const runtime = 'nodejs'

/**
 * Vercel Cron runs in UTC. 01:00 UTC = 6pm Pacific during PDT
 * (Mar–Nov). During PST (Nov–Mar) this lands at 5pm Pacific.
 * Hobby plans allow one run per day, so we can't dual-schedule for DST.
 */
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false

  const auth = request.headers.get('authorization')
  return auth === `Bearer ${secret}`
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL

  if (!apiKey || !toEmail) {
    return NextResponse.json(
      { error: 'Email is not configured yet.' },
      { status: 500 }
    )
  }

  const traffic = await getSiteTrafficSnapshot()
  const email = buildDailyTrafficEmail(traffic)
  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: 'Havana Heating and Air <onboarding@resend.dev>',
    to: [toEmail],
    subject: email.subject,
    html: email.html,
  })

  if (error) {
    console.error('Daily traffic Resend error:', error)
    return NextResponse.json(
      { error: 'Could not send daily traffic email.' },
      { status: 502 }
    )
  }

  return NextResponse.json({
    ok: true,
    pageviews7d: traffic?.pageviews7d ?? null,
    visitors7d: traffic?.visitors7d ?? null,
  })
}
