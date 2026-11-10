import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE_NAME = 'havana_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 8

function secret() {
  return process.env.ADMIN_SESSION_SECRET || ''
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('hex')
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET)
}

export function verifyAdminCredentials(email: string, password: string) {
  return isAdminConfigured() && email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD
}

export async function isAdminAuthenticated() {
  if (!isAdminConfigured()) return false
  const value = (await cookies()).get(COOKIE_NAME)?.value
  if (!value) return false
  const [user, expires, signature] = value.split('.')
  if (!user || !expires || !signature || Number(expires) < Date.now()) return false
  const expected = sign(`${user}.${expires}`)
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

export async function setAdminSession() {
  const expires = Date.now() + SESSION_TTL_SECONDS * 1000
  const value = `admin.${expires}.${sign(`admin.${expires}`)}`
  ;(await cookies()).set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export async function clearAdminSession() {
  ;(await cookies()).delete(COOKIE_NAME)
}
