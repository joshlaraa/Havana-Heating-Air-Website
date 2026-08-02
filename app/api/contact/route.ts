import { NextResponse } from 'next/server'
import { track } from '@vercel/analytics/server'
import { Resend } from 'resend'
import { buildLeadEmail } from '@/lib/lead-email'
import { parseLeadPayload } from '@/lib/lead-types'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { getSiteTrafficSnapshot } from '@/lib/site-analytics'

export const runtime = 'nodejs'

const MAX_BODY_BYTES = 12_000

function allowedOrigins(): Set<string> {
  const origins = new Set<string>()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (siteUrl) origins.add(siteUrl)

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) origins.add(`https://${vercelUrl.replace(/^https?:\/\//, '')}`)

  // Production + preview defaults for this project
  origins.add('https://havana-heating-air-website.vercel.app')
  origins.add('http://localhost:3000')
  origins.add('http://127.0.0.1:3000')

  return origins
}

function requestHost(request: Request): string | null {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
  return host?.split(',')[0]?.trim().toLowerCase() || null
}

function originMatchesHost(originOrUrl: string, host: string): boolean {
  try {
    return new URL(originOrUrl).host.toLowerCase() === host
  } catch {
    return false
  }
}

function isAllowedRequest(request: Request): boolean {
  const allowed = allowedOrigins()
  const host = requestHost(request)
  const origin = request.headers.get('origin')

  // True same-origin: browser Origin host matches the request Host.
  // Covers custom domains and preview URLs without hardcoding every alias.
  if (origin) {
    if (host && originMatchesHost(origin, host)) return true
    if (allowed.has(origin)) return true
    // Origin present but not allowed — do not fall back to Referer.
    return false
  }

  const referer = request.headers.get('referer')
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin
      if (host && originMatchesHost(referer, host)) return true
      if (allowed.has(refOrigin)) return true
    } catch {
      return false
    }
  }

  // Safari / privacy modes may omit Origin + Referer on same-origin fetch.
  // Sec-Fetch-Site is browser-controlled and cannot be set from JS.
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite === 'same-origin') return true

  // Local/dev tooling (curl, etc.) often sends neither header.
  if (!origin && !referer && process.env.NODE_ENV !== 'production') {
    return true
  }

  return false
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL

  if (!apiKey || !toEmail) {
    return NextResponse.json(
      { error: 'Email is not configured yet.' },
      { status: 500 }
    )
  }

  if (!isAllowedRequest(request)) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 403 })
  }

  const ip = clientIp(request)
  const limited = rateLimit(`contact:${ip}`)
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      {
        status: 429,
        headers: { 'Retry-After': String(limited.retryAfterSec) },
      }
    )
  }

  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 413 })
  }

  let body: unknown
  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 413 })
    }
    body = JSON.parse(raw) as unknown
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot trips look like validation failures to bots.
  const payload = parseLeadPayload(body)
  if (!payload) {
    return NextResponse.json(
      { error: 'Please complete all required fields.' },
      { status: 400 }
    )
  }

  // Prefer sending the lead even if analytics is slow/unavailable.
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
