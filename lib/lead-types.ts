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

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function parseLeadPayload(body: unknown): LeadPayload | null {
  if (!body || typeof body !== 'object') return null

  const data = body as Record<string, unknown>

  if (data.source === 'hero') {
    if (
      !isNonEmptyString(data.fullName) ||
      !isNonEmptyString(data.phone) ||
      !isNonEmptyString(data.serviceType)
    ) {
      return null
    }

    return {
      source: 'hero',
      fullName: data.fullName,
      phone: data.phone,
      serviceType: data.serviceType,
      description: typeof data.description === 'string' ? data.description : '',
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

    return {
      source: 'contact',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    }
  }

  return null
}
