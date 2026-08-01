import type { LeadPayload } from '@/lib/lead-types'
import type { SiteTrafficSnapshot } from '@/lib/site-analytics'

const BRAND = {
  red: '#c1121f',
  ink: '#111827',
  inkSecondary: '#374151',
  inkMuted: '#6b7280',
  light: '#f5f5f5',
  border: '#e5e7eb',
  white: '#ffffff',
} as const

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function telHref(phone: string) {
  const trimmed = phone.trim()
  const digits = trimmed.replace(/[^\d+]/g, '')
  return `tel:${digits || trimmed}`
}

function mailtoHref(email: string, name: string, topic: string) {
  const subject = `Re: Your Havana Heating and Air inquiry`
  const body = `Hi ${name},\n\nThanks for reaching out about ${topic}. `
  const params = new URLSearchParams({ subject, body })
  return `mailto:${email.trim()}?${params.toString()}`
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

function detailRow(label: string, valueHtml: string, last = false) {
  const border = last ? '' : `border-bottom:1px solid ${BRAND.border};`
  return `
    <tr>
      <td style="padding:14px 0;${border}width:128px;vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.4;color:${BRAND.inkMuted};">
        ${escapeHtml(label)}
      </td>
      <td style="padding:14px 0;${border}vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:${BRAND.ink};font-weight:500;">
        ${valueHtml}
      </td>
    </tr>
  `
}

function textValue(value: string) {
  return escapeHtml(value).replaceAll('\n', '<br />')
}

function phoneValue(phone: string) {
  return `<a href="${escapeHtml(telHref(phone))}" style="color:${BRAND.red};text-decoration:none;font-weight:700;">${escapeHtml(phone.trim())}</a>`
}

function emailValue(email: string, name: string, topic: string) {
  return `<a href="${escapeHtml(mailtoHref(email, name, topic))}" style="color:${BRAND.red};text-decoration:none;font-weight:700;">${escapeHtml(email.trim())}</a>`
}

function leadContact(payload: LeadPayload) {
  if (payload.source === 'hero') {
    return {
      name: payload.fullName.trim(),
      phone: payload.phone.trim(),
      email: null as string | null,
      topic: payload.serviceType.trim(),
    }
  }

  return {
    name: `${payload.firstName.trim()} ${payload.lastName.trim()}`.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim(),
    topic: payload.subject.trim(),
  }
}

function leadDetails(payload: LeadPayload) {
  const contact = leadContact(payload)

  if (payload.source === 'hero') {
    const description = payload.description?.trim() || 'No description provided.'
    return [
      detailRow('Name', textValue(contact.name)),
      detailRow('Phone', phoneValue(contact.phone)),
      detailRow('Service', textValue(contact.topic)),
      detailRow('Details', textValue(description), true),
    ].join('')
  }

  return [
    detailRow('Name', textValue(contact.name)),
    detailRow('Email', emailValue(contact.email!, contact.name, contact.topic)),
    detailRow('Phone', phoneValue(contact.phone)),
    detailRow('Subject', textValue(contact.topic)),
    detailRow('Message', textValue(payload.message.trim()), true),
  ].join('')
}

function contactActions(payload: LeadPayload) {
  const contact = leadContact(payload)
  const callButton = `
    <a href="${escapeHtml(telHref(contact.phone))}"
       style="display:inline-block;background:${BRAND.red};color:${BRAND.white};font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:14px 22px;border-radius:999px;">
      Call ${escapeHtml(contact.name.split(' ')[0] || 'customer')}
    </a>
  `

  if (!contact.email) {
    return `
      <tr>
        <td style="padding:0 32px 28px;" align="center">
          ${callButton}
          <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:${BRAND.inkMuted};">
            Tap to call ${escapeHtml(contact.phone)}
          </p>
        </td>
      </tr>
    `
  }

  return `
    <tr>
      <td style="padding:0 32px 28px;" align="center">
        <div style="margin:0 0 10px;">
          ${callButton}
        </div>
        <div>
          <a href="${escapeHtml(mailtoHref(contact.email, contact.name, contact.topic))}"
             style="display:inline-block;background:${BRAND.ink};color:${BRAND.white};font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:14px 22px;border-radius:999px;">
            Email customer
          </a>
        </div>
        <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:${BRAND.inkMuted};">
          Or reply to this email to message them directly.
        </p>
      </td>
    </tr>
  `
}

function analyticsSection(traffic: SiteTrafficSnapshot | null) {
  if (!traffic) return ''

  const cell = (label: string, value: string) => `
    <td width="50%" style="padding:10px 8px;text-align:center;vertical-align:top;">
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.2;font-weight:700;color:${BRAND.ink};">
        ${escapeHtml(value)}
      </p>
      <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.4;color:${BRAND.inkMuted};">
        ${escapeHtml(label)}
      </p>
    </td>
  `

  return `
    <tr>
      <td style="padding:0 32px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.light};border-radius:16px;">
          <tr>
            <td style="padding:18px 16px 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;font-weight:700;color:${BRAND.red};">
              Site traffic snapshot
            </td>
          </tr>
          <tr>
            <td style="padding:0 8px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  ${cell('Views today', formatCount(traffic.pageviewsToday))}
                  ${cell('Visitors today', formatCount(traffic.visitorsToday))}
                </tr>
                <tr>
                  ${cell('Views · last 7 days', formatCount(traffic.pageviews7d))}
                  ${cell('Visitors · last 7 days', formatCount(traffic.visitors7d))}
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
}

export function buildLeadEmail(
  payload: LeadPayload,
  traffic: SiteTrafficSnapshot | null = null
) {
  const isHero = payload.source === 'hero'
  const title = isHero ? 'New estimate request' : 'New contact message'
  const sourceLabel = isHero ? 'Homepage estimate form' : 'Contact page'
  const subject = isHero
    ? `New estimate request: ${payload.serviceType.trim()}`
    : `New contact message: ${payload.subject.trim()}`
  const replyTo = isHero ? undefined : payload.email.trim()
  const accentLabel = isHero ? 'Free estimate' : 'Contact inquiry'

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.light};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.light};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND.white};border-radius:24px;overflow:hidden;">
          <tr>
            <td style="background:${BRAND.ink};padding:28px 32px;">
              <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.red};font-weight:700;">
                Havana Heating and Air
              </p>
              <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:24px;line-height:1.25;color:${BRAND.white};font-weight:700;">
                ${escapeHtml(title)}
              </h1>
              <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:rgba(255,255,255,0.72);">
                ${escapeHtml(sourceLabel)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;">
              <span style="display:inline-block;padding:6px 12px;border-radius:999px;background:${BRAND.light};font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:600;color:${BRAND.ink};">
                ${escapeHtml(accentLabel)}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${leadDetails(payload)}
              </table>
            </td>
          </tr>
          ${contactActions(payload)}
          ${analyticsSection(traffic)}
          <tr>
            <td style="padding:0 32px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:${BRAND.inkMuted};">
              Havana Heating and Air · San Diego County · 909.235.0771
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  return { subject, replyTo, html }
}
