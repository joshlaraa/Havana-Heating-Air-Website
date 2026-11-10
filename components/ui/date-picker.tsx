'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { HiCalendarDays, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import { cn } from '@/lib/utils'

type DatePickerProps = {
  value: string // YYYY-MM-DD
  onChange: (value: string) => void
  name?: string
  required?: boolean
  className?: string
  'aria-label'?: string
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const pad = (n: number) => String(n).padStart(2, '0')
export const toDateString = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function parse(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  return match ? { y: +match[1], m: +match[2] - 1, d: +match[3] } : null
}

function format(value: string) {
  const p = parse(value)
  if (!p) return ''
  return new Date(p.y, p.m, p.d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function DatePicker({ value, onChange, name, required, className, 'aria-label': ariaLabel }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const dialogId = useId()
  const parsed = parse(value)
  const now = new Date()
  const [view, setView] = useState({ y: parsed?.y ?? now.getFullYear(), m: parsed?.m ?? now.getMonth() })

  useEffect(() => {
    if (!open) return
    const p = parse(value)
    if (p) setView({ y: p.y, m: p.m })
    function handlePointer(event: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('touchstart', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('touchstart', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, value])

  function shift(delta: number) {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  }

  const firstWeekday = new Date(view.y, view.m, 1).getDay()
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  const todayStr = toDateString(now)

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      {name ? <input type="hidden" name={name} value={value} required={required} /> : null}
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        aria-label={ariaLabel || 'Choose date'}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3 text-left text-sm transition-all duration-200',
          'focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/5',
          open && 'border-ink/30 ring-2 ring-ink/5',
          value ? 'text-ink' : 'text-ink-faint'
        )}
      >
        <span className="truncate">{format(value) || 'Select a date'}</span>
        <HiCalendarDays size={16} className="shrink-0 text-ink-faint" />
      </button>

      <div
        className={cn(
          'absolute left-0 z-30 w-72 max-w-[calc(100vw-3rem)] origin-top pt-1.5 transition-all duration-200 ease-out',
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-[0.98] opacity-0'
        )}
      >
        <div
          id={dialogId}
          role="dialog"
          aria-label="Calendar"
          className="rounded-xl border border-border bg-white p-3 shadow-xl shadow-ink/10"
        >
          <div className="mb-2 flex items-center justify-between">
            <button type="button" aria-label="Previous month" onClick={() => shift(-1)} className="rounded-lg p-2 text-ink-secondary transition-colors hover:bg-brand-light">
              <HiChevronLeft size={16} />
            </button>
            <p className="text-sm font-medium text-ink">{MONTHS[view.m]} {view.y}</p>
            <button type="button" aria-label="Next month" onClick={() => shift(1)} className="rounded-lg p-2 text-ink-secondary transition-colors hover:bg-brand-light">
              <HiChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1 text-xs font-medium text-ink-faint">{w}</span>
            ))}
            {cells.map((day, i) => {
              if (!day) return <span key={`e${i}`} />
              const str = `${view.y}-${pad(view.m + 1)}-${pad(day)}`
              const selected = str === value
              return (
                <button
                  key={str}
                  type="button"
                  onClick={() => { onChange(str); setOpen(false) }}
                  className={cn(
                    'h-9 rounded-lg text-sm transition-colors',
                    selected ? 'bg-ink font-medium text-white' : 'text-ink-secondary hover:bg-brand-light',
                    !selected && str === todayStr && 'border border-ink/20 font-medium text-ink'
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>
          <div className="mt-2 flex justify-end border-t border-border pt-2">
            <button type="button" onClick={() => { onChange(todayStr); setOpen(false) }} className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink hover:bg-brand-light">
              Today
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
