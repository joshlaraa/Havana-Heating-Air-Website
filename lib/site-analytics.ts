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

async function countVisits(since: string, until: string): Promise<{
  pageviews: number
  visitors: number
} | null> {
  const token = process.env.VERCEL_API_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID

  if (!token || !projectId) return null

  const url = new URL(
    'https://api.vercel.com/v1/query/web-analytics/visits/count'
  )
  url.searchParams.set('projectId', projectId)
  url.searchParams.set('since', since)
  url.searchParams.set('until', until)

  const teamId = process.env.VERCEL_TEAM_ID
  if (teamId) url.searchParams.set('teamId', teamId)

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error(
        'Vercel Analytics count failed:',
        response.status,
        await response.text().catch(() => '')
      )
      return null
    }

    const json = (await response.json()) as CountResponse
    return {
      pageviews: json.data?.pageviews ?? 0,
      visitors: json.data?.visitors ?? 0,
    }
  } catch (error) {
    console.error('Vercel Analytics count error:', error)
    return null
  }
}

/** Pulls live site traffic for lead notification emails. Returns null if not configured. */
export async function getSiteTrafficSnapshot(): Promise<SiteTrafficSnapshot | null> {
  const until = new Date().toISOString()
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
}
