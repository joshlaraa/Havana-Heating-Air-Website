import { NextResponse } from 'next/server'
import { track } from '@vercel/analytics/server'
import { Resend } from 'resend'
import { buildLeadEmail } from '@/lib/lead-email'
import { parseLeadPayload } from '@/lib/lead-types'
import { getSiteTrafficSnapshot } from '@/lib/site-analytics'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL

  if (!apiKey || !toEmail) {
    return NextResponse.json(
      { error: 'Email is not configured yet.' },
      { status: 500 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const payload = parseLeadPayload(body)
  if (!payload) {
    return NextResponse.json(
      { error: 'Please complete all required fields.' },
      { status: 400 }
    )
  }

  const traffic = await getSiteTrafficSnapshot()
  const email = buildLeadEmail(payload, traffic)
  const resend = new Resend(apiKey)

  // Without a verified domain, Resend only allows onboarding@resend.dev
  // and delivery to the account owner's email.
  const { error } = await resend.emails.send({
    from: 'Havana Heating and Air <onboarding@resend.dev>',
    to: [toEmail],
    subject: email.subject,
    html: email.html,
    ...(email.replyTo ? { replyTo: email.replyTo } : {}),
  })

  if (error) {
    console.error('Resend error:', error)
    return NextResponse.json(
      { error: 'Could not send your request. Please try again.' },
      { status: 502 }
    )
  }

  // Custom events require Vercel Pro. Safe no-op / ignored on Hobby.
  await track('Form Submitted', {
    source: payload.source,
    service:
      payload.source === 'hero' ? payload.serviceType : payload.subject,
  })

  return NextResponse.json({ ok: true })
}
