'use client'

import { useEffect, useRef, useState } from 'react'
import { HiExclamationTriangle } from 'react-icons/hi2'
import { cn } from '@/lib/utils'

type FormSubmitSlotProps = {
  label: string
  error: string | null
  onErrorDismiss: () => void
  className?: string
}

type Phase = 'idle' | 'error' | 'loading'

export default function FormSubmitSlot({
  label,
  error,
  onErrorDismiss,
  className,
}: FormSubmitSlotProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [message, setMessage] = useState('')
  const onDismissRef = useRef(onErrorDismiss)
  onDismissRef.current = onErrorDismiss

  useEffect(() => {
    if (!error) {
      setPhase('idle')
      return
    }

    setMessage(error)
    setPhase('error')

    const loadingTimer = window.setTimeout(() => setPhase('loading'), 2200)
    const dismissTimer = window.setTimeout(() => {
      setPhase('idle')
      onDismissRef.current()
    }, 2900)

    return () => {
      window.clearTimeout(loadingTimer)
      window.clearTimeout(dismissTimer)
    }
  }, [error])

  return (
    <div className={cn('relative h-12 w-full', className)}>
      <button
        type="submit"
        tabIndex={phase === 'idle' ? 0 : -1}
        aria-hidden={phase !== 'idle'}
        className={cn(
          'absolute inset-0 flex items-center justify-center rounded-lg bg-ink px-6 text-sm font-light text-white transition-all duration-300',
          'hover:bg-ink/90 hover:shadow-lg',
          phase === 'idle'
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-1 scale-[0.98] opacity-0'
        )}
      >
        {label}
      </button>

      <div
        role="alert"
        aria-hidden={phase !== 'error'}
        className={cn(
          'absolute inset-0 flex items-center justify-center gap-2 rounded-lg border border-brand-red/20 bg-brand-red/5 px-3 transition-all duration-300',
          phase === 'error'
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-[0.98] opacity-0'
        )}
      >
        <HiExclamationTriangle size={22} className="shrink-0 text-brand-red" />
        <p className="truncate text-sm font-medium text-brand-red">{message}</p>
      </div>

      <div
        aria-hidden={phase !== 'loading'}
        aria-label="Loading"
        className={cn(
          'absolute inset-0 flex items-center justify-center rounded-lg bg-ink transition-all duration-300',
          phase === 'loading'
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none translate-y-1 scale-[0.98] opacity-0'
        )}
      >
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white" />
      </div>
    </div>
  )
}
