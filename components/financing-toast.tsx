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
        window.setTimeout(() => setMounted(false), 220)
      }, 10000)
    }, 500)

    return () => {
      window.clearTimeout(timer)
      if (dismissTimer) window.clearTimeout(dismissTimer)
    }
  }, [])

  function dismiss() {
    setOpen(false)
    window.setTimeout(() => setMounted(false), 220)
  }

  if (!mounted) return null

  return (
    <aside
      role="status"
      aria-live="polite"
      className={`fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] right-3 z-[60] w-[calc(100%-1.5rem)] max-w-[22rem] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none sm:bottom-6 sm:right-6 sm:max-w-[25rem] ${
        open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className="relative rounded-[1rem] border border-black/10 bg-white px-4 py-3 pr-10 shadow-[0_8px_24px_rgba(17,24,39,0.14)]">
        <button
          type="button"
          aria-label="Dismiss financing message"
          onClick={dismiss}
          className="absolute right-3 top-3 rounded-full p-1.5 text-ink-faint transition-colors duration-200 hover:bg-brand-light hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
        >
          <HiXMark size={18} aria-hidden="true" />
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
        <div className="mt-2">
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
