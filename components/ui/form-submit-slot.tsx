'use client'

import { useEffect, useRef, useState } from 'react'
import { HiExclamationTriangle } from 'react-icons/hi2'
import { cn } from '@/lib/utils'

type FormSubmitSlotProps = {
  label: string
  error: string | null
  onErrorDismiss: () => void
  pending?: boolean
  className?: string
}

type Phase = 'idle' | 'error' | 'loading'

export default function FormSubmitSlot({
  label,
  error,
  onErrorDismiss,
  pending = false,
  className,
}: FormSubmitSlotProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [message, setMessage] = useState('')
  const onDismissRef = useRef(onErrorDismiss)
  onDismissRef.current = onErrorDismiss

  useEffect(() => {
    if (pending) {
      setPhase('loading')
      return
    }

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
  }, [error, pending])

  const showIdle = phase === 'idle' && !pending

  return (
    <div className={cn('relative h-12 w-full', className)}>
      <button
        type="submit"
        disabled={pending}
        tabIndex={showIdle ? 0 : -1}
        aria-hidden={!showIdle}
        className={cn(
          'absolute inset-0 flex items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-white transition-[transform,background-color,box-shadow,opacity] duration-200 ease-out',
          'hover:bg-ink/90 hover:shadow-md disabled:cursor-not-allowed',
          showIdle
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
          'absolute inset-0 flex items-center justify-center gap-2 rounded-full border border-brand-red/20 bg-brand-red/5 px-3 transition-[transform,opacity] duration-200 ease-out',
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
          'absolute inset-0 flex items-center justify-center rounded-full bg-ink transition-[transform,opacity] duration-200 ease-out',
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
