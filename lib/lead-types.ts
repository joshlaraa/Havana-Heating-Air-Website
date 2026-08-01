export type HeroPayload = {
  source: 'hero'
  fullName: string
  phone: string
  serviceType: string
  description?: string
}

export type ContactPayload = {
  source: 'contact'
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
}

export type LeadPayload = HeroPayload | ContactPayload

const LIMITS = {
  name: 80,
  phone: 30,
  email: 120,
  service: 80,
  subject: 80,
  message: 2000,
  description: 1000,
} as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/** Strip CR/LF and other control chars that can break email headers. */
export function sanitizeHeaderValue(value: string) {
  return value.replace(/[\0-\x1F\x7F]/g, '').trim()
}

function cleanText(value: string, max: number) {
  return sanitizeHeaderValue(value).slice(0, max)
}

function isValidEmail(value: string) {
  if (value.length > LIMITS.email) return false
  if (/[<>\s,"]/.test(value)) return false
  if (value.includes('?') || value.includes('&') || value.includes('=')) {
    return false
  }
  return EMAIL_RE.test(value)
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 7 && digits.length <= 15 && value.length <= LIMITS.phone
}

/** Honeypot: bots fill hidden fields; humans leave them empty. */
export function isHoneypotTripped(body: Record<string, unknown>) {
  const bait = body.company ?? body.website ?? body.fax
  return typeof bait === 'string' && bait.trim().length > 0
}

export function parseLeadPayload(body: unknown): LeadPayload | null {
  if (!body || typeof body !== 'object') return null

  const data = body as Record<string, unknown>

  if (isHoneypotTripped(data)) return null

  if (data.source === 'hero') {
    if (
      !isNonEmptyString(data.fullName) ||
      !isNonEmptyString(data.phone) ||
      !isNonEmptyString(data.serviceType)
    ) {
      return null
    }

    const fullName = cleanText(data.fullName, LIMITS.name)
    const phone = cleanText(data.phone, LIMITS.phone)
    const serviceType = cleanText(data.serviceType, LIMITS.service)
    const description =
      typeof data.description === 'string'
        ? cleanText(data.description, LIMITS.description)
        : ''

    if (!fullName || !isValidPhone(phone) || !serviceType) return null

    return {
      source: 'hero',
      fullName,
      phone,
      serviceType,
      description,
    }
  }

  if (data.source === 'contact') {
    if (
      !isNonEmptyString(data.firstName) ||
      !isNonEmptyString(data.lastName) ||
      !isNonEmptyString(data.email) ||
      !isNonEmptyString(data.phone) ||
      !isNonEmptyString(data.subject) ||
      !isNonEmptyString(data.message)
    ) {
      return null
    }

    const firstName = cleanText(data.firstName, LIMITS.name)
    const lastName = cleanText(data.lastName, LIMITS.name)
    const email = cleanText(data.email, LIMITS.email).toLowerCase()
    const phone = cleanText(data.phone, LIMITS.phone)
    const subject = cleanText(data.subject, LIMITS.subject)
    const message = cleanText(data.message, LIMITS.message)

    if (
      !firstName ||
      !lastName ||
      !isValidEmail(email) ||
      !isValidPhone(phone) ||
      !subject ||
      !message
    ) {
      return null
    }

    return {
      source: 'contact',
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
    }
  }

  return null
}
