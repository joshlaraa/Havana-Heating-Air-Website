'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
    })
    if (!response.ok) setError((await response.json()).error ?? 'Unable to sign in.')
    else router.push('/admin/invoices')
    setLoading(false)
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block text-sm font-medium text-ink">Administrator email<input className="field-input mt-2" name="email" type="email" autoComplete="username" required /></label>
      <label className="block text-sm font-medium text-ink">Password<input className="field-input mt-2" name="password" type="password" autoComplete="current-password" required /></label>
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      <button className="btn-submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
    </form>
  )
}
