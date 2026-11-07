'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HiArrowRight, HiXMark } from 'react-icons/hi2'

const STORAGE_KEY = 'havana-financing-toast-seen'

export default function FinancingToast() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY)) return
    } catch {
      // Show the toast if storage is unavailable.
    }

    let dismissTimer: number | undefined
    const timer = window.setTimeout(() => {
      setMounted(true)
      try {
        window.sessionStorage.setItem(STORAGE_KEY, 'true')
      } catch {
        // The toast still works when storage is unavailable.
      }
      window.requestAnimationFrame(() => setOpen(true))
      dismissTimer = window.setTimeout(() => {
        setOpen(false)
        window.setTimeout(() => setMounted(false), 350)
      }, 10000)
    }, 500)

    return () => {
      window.clearTimeout(timer)
      if (dismissTimer) window.clearTimeout(dismissTimer)
    }
  }, [])

  function dismiss() {
    setOpen(false)
    window.setTimeout(() => setMounted(false), 350)
  }

  if (!mounted) return null

  return (
    <aside
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-[60] w-[min(19.5rem,calc(100vw-2rem))] origin-bottom-right transition-[opacity,transform] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity ${
        open
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-4 scale-95 opacity-0 motion-reduce:translate-y-0 motion-reduce:scale-100'
      }`}
    >
      <div className="relative rounded-2xl border border-black/5 bg-white p-4 pr-12">
        <button
          type="button"
          aria-label="Dismiss financing message"
          onClick={dismiss}
          className="absolute right-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full text-ink-faint transition-colors duration-200 hover:bg-brand-light hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
        >
          <HiXMark size={16} aria-hidden="true" />
        </button>

        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-brand-red">
          Financing available
        </p>
        <p className="mt-1 font-heading text-[15px] font-bold leading-tight text-ink">
          Make comfort easier to plan for.
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
          Ask about options for your HVAC project.
        </p>
        <div className="mt-3">
          <Link
            href="/contact"
            onClick={dismiss}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-red transition-colors duration-200 hover:text-brand-red/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
          >
            Ask About Financing
            <HiArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
