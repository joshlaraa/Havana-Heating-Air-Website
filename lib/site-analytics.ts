export type DailyTraffic = {
  /** Calendar date YYYY-MM-DD (UTC day bucket from Vercel) */
  date: string
  /** Sat, Sun, Mon, Tue, Wed, Thu, Fri */
  label: string
  pageviews: number
  visitors: number
}

export type SiteTrafficSnapshot = {
  pageviews7d: number
  visitors7d: number
  /** Saturday → Friday week */
  days: DailyTraffic[]
  weekLabel: string
}

type CountResponse = {
  data?: {
    pageviews?: number
    visitors?: number
  }
}

type AggregateResponse = {
  data?: Array<{
    timestamp?: string
    pageviews?: number
    visitors?: number
  }>
}

const CACHE_TTL_MS = 10 * 60 * 1000
const WEEK_LABELS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

let cachedSnapshot: {
  value: SiteTrafficSnapshot | null
  expiresAt: number
} | null = null

function resolveProjectId() {
  return (
    process.env.VERCEL_PROJECT_ID ||
    process.env.VERCEL_PROJECT_NAME ||
    'havana-heating-air-website'
  )
}

function utcDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatMonthDay(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

/** Current Sat–Fri week aligned to Vercel UTC day buckets. */
function saturdayFridayWeek(now = new Date()) {
  const daysSinceSaturday = (now.getUTCDay() + 1) % 7
  const start = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - daysSinceSaturday
    )
  )
  const until = new Date(start)
  until.setUTCDate(until.getUTCDate() + 7)

  const days = WEEK_LABELS.map((label, index) => {
    const date = new Date(start)
    date.setUTCDate(start.getUTCDate() + index)
    return { date: utcDateKey(date), label }
  })

  const end = new Date(start)
  end.setUTCDate(start.getUTCDate() + 6)
  const monthFmt = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    timeZone: 'UTC',
  })
  const weekLabel =
    start.getUTCMonth() === end.getUTCMonth()
      ? `${monthFmt.format(start)} ${start.getUTCDate()}–${end.getUTCDate()}`
      : `${formatMonthDay(start)} – ${formatMonthDay(end)}`

  return {
    since: start.toISOString(),
    until: until.toISOString(),
    days,
    weekLabel,
  }
}

async function analyticsFetch(path: string, params: Record<string, string>) {
  const token = process.env.VERCEL_API_TOKEN
  const projectId = resolveProjectId()
  if (!token) return null

  const url = new URL(`https://api.vercel.com/v1/query/web-analytics/${path}`)
  url.searchParams.set('projectId', projectId)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

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

  return response.json()
}

async function countVisits(since: string, until: string): Promise<{
  pageviews: number
  visitors: number
} | null> {
  const json = (await analyticsFetch('visits/count', {
    since,
    until,
  })) as CountResponse | null
  if (!json) return null
  return {
    pageviews: json.data?.pageviews ?? 0,
    visitors: json.data?.visitors ?? 0,
  }
}

async function dailyVisits(since: string, until: string) {
  const json = (await analyticsFetch('visits/aggregate', {
    since,
    until,
    by: 'day',
    limit: '14',
  })) as AggregateResponse | null
  if (!json) return null

  const byDate = new Map<string, { pageviews: number; visitors: number }>()
  for (const row of json.data ?? []) {
    if (!row.timestamp) continue
    byDate.set(utcDateKey(new Date(row.timestamp)), {
      pageviews: row.pageviews ?? 0,
      visitors: row.visitors ?? 0,
    })
  }
  return byDate
}

async function fetchSiteTrafficSnapshot(): Promise<SiteTrafficSnapshot | null> {
  if (!process.env.VERCEL_API_TOKEN) {
    console.warn(
      'Site traffic snapshot skipped: VERCEL_API_TOKEN is not set.'
    )
    return null
  }

  const week = saturdayFridayWeek()

  try {
    const [totals, daily] = await Promise.all([
      countVisits(week.since, week.until),
      dailyVisits(week.since, week.until),
    ])

    if (!totals || !daily) return null

    const days: DailyTraffic[] = week.days.map((day) => {
      const counts = daily.get(day.date)
      return {
        date: day.date,
        label: day.label,
        pageviews: counts?.pageviews ?? 0,
        visitors: counts?.visitors ?? 0,
      }
    })

    return {
      pageviews7d: totals.pageviews,
      visitors7d: totals.visitors,
      days,
      weekLabel: week.weekLabel,
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
