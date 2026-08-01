export type SiteTrafficSnapshot = {
  pageviewsToday: number
  visitorsToday: number
  pageviews7d: number
  visitors7d: number
}

type CountResponse = {
  data?: {
    pageviews?: number
    visitors?: number
  }
}

const CACHE_TTL_MS = 10 * 60 * 1000

let cachedSnapshot: {
  value: SiteTrafficSnapshot | null
  expiresAt: number
} | null = null

function startOfTodayUtc() {
  const now = new Date()
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  ).toISOString()
}

function daysAgoIso(days: number) {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - days)
  return date.toISOString()
}

function resolveProjectId() {
  return (
    process.env.VERCEL_PROJECT_ID ||
    process.env.VERCEL_PROJECT_NAME ||
    'havana-heating-air-website'
  )
}

async function countVisits(since: string, until: string): Promise<{
  pageviews: number
  visitors: number
} | null> {
  const token = process.env.VERCEL_API_TOKEN
  const projectId = resolveProjectId()

  if (!token) return null

  const url = new URL(
    'https://api.vercel.com/v1/query/web-analytics/visits/count'
  )
  url.searchParams.set('projectId', projectId)
  url.searchParams.set('since', since)
  url.searchParams.set('until', until)

  const teamId = process.env.VERCEL_TEAM_ID
  if (teamId) url.searchParams.set('teamId', teamId)

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    const error = new Error(
      `analytics_${response.status}:${body.slice(0, 200)}`
    )
    ;(error as Error & { status?: number }).status = response.status
    throw error
  }

  const json = (await response.json()) as CountResponse
  return {
    pageviews: json.data?.pageviews ?? 0,
    visitors: json.data?.visitors ?? 0,
  }
}

async function fetchSiteTrafficSnapshot(): Promise<SiteTrafficSnapshot | null> {
  if (!process.env.VERCEL_API_TOKEN) {
    console.warn(
      'Site traffic snapshot skipped: VERCEL_API_TOKEN is not set.'
    )
    return null
  }

  const until = new Date().toISOString()

  try {
    const [today, week] = await Promise.all([
      countVisits(startOfTodayUtc(), until),
      countVisits(daysAgoIso(7), until),
    ])

    if (!today || !week) return null

    return {
      pageviewsToday: today.pageviews,
      visitorsToday: today.visitors,
      pageviews7d: week.pageviews,
      visitors7d: week.visitors,
    }
  } catch (error) {
    const status = (error as Error & { status?: number }).status
    if (status === 404) {
      console.warn(
        'Web Analytics not available for this project. Confirm VERCEL_API_TOKEN is a personal access token (vcp_…), VERCEL_PROJECT_ID matches Project Settings → General, and Web Analytics is enabled. For team projects set VERCEL_TEAM_ID.'
      )
    } else {
      console.error('Vercel Analytics count error:', error)
    }
    return null
  }
}

/** Pulls live site traffic for lead notification emails. Returns null if not configured. */
export async function getSiteTrafficSnapshot(): Promise<SiteTrafficSnapshot | null> {
  const now = Date.now()
  if (cachedSnapshot && cachedSnapshot.expiresAt > now) {
    return cachedSnapshot.value
  }

  const value = await fetchSiteTrafficSnapshot()
  cachedSnapshot = { value, expiresAt: now + CACHE_TTL_MS }
  return value
}
