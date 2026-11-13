'use client'

import { useEffect, useState } from 'react'

export const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, '').slice(0, 10)
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}
export const sanitizeMoney = (raw: string) => {
  const cleaned = raw.replace(/[^\d.]/g, '')
  const [whole, ...rest] = cleaned.split('.')
  return rest.length ? `${whole}.${rest.join('').slice(0, 2)}` : whole
}

export function MoneyInput({ value, onValueChange, name, className = '', prefix = true }: { value?: number; onValueChange?: (n: number) => void; name?: string; className?: string; prefix?: boolean }) {
  const [text, setText] = useState(() => (value ? value.toFixed(2) : ''))
  useEffect(() => {
    if (value !== undefined && value !== (Number(text) || 0)) setText(value ? value.toFixed(2) : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return (
    <div className="relative mt-2">
      {prefix && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-faint">$</span>}
      <input
        className={`field-input pl-8 ${className}`}
        name={name}
        type="text"
        inputMode="decimal"
        enterKeyHint="done"
        placeholder="0.00"
        autoComplete="off"
        value={text}
        onChange={(event) => { const next = sanitizeMoney(event.target.value); setText(next); onValueChange?.(Number(next) || 0) }}
        onBlur={() => { if (text) setText((Number(text) || 0).toFixed(2)) }}
      />
    </div>
  )
}

export const actionBase = 'inline-flex h-12 w-full items-center justify-center rounded-[14px] px-5 text-[15px] font-medium tracking-tight transition-[transform,background-color,opacity] duration-150 active:scale-[0.98] active:opacity-80 disabled:opacity-50 sm:w-auto'
export const actionPrimary = `${actionBase} bg-brand-red text-white hover:bg-brand-red/90`
export const actionSecondary = `${actionBase} bg-ink/[0.07] text-ink hover:bg-ink/[0.11]`


/** Decimal text input that shows the numeric keypad on phones. */
export function NumberInput({ value, onChange, name, placeholder = '0', className = '', suffix }: { value: string; onChange: (v: string) => void; name?: string; placeholder?: string; className?: string; suffix?: string }) {
  return (
    <div className="relative mt-2">
      <input
        className={`field-input ${suffix ? 'pr-14' : ''} ${className}`}
        name={name}
        type="text"
        inputMode="decimal"
        enterKeyHint="done"
        placeholder={placeholder}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1'))}
      />
      {suffix && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-faint">{suffix}</span>}
    </div>
  )
}
