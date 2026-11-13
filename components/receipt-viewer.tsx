'use client'

import { useEffect, useRef, useState } from 'react'

/** Centered, responsive receipt popup with Close and Download. */
export default function ReceiptViewer({ id, title, onClose }: { id: string; title: string; onClose: () => void }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const src = `/api/admin/expenses/${id}/receipt`

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onCloseRef.current() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Receipt: ${title}`}
    >
      <div
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
          <p className="truncate text-sm font-bold">{title}</p>
        </div>

        <div className="relative flex min-h-48 flex-1 items-center justify-center overflow-auto bg-brand-light px-3 py-3">
          {state === 'loading' && (
            <svg className="absolute h-8 w-8 animate-spin text-ink-muted" viewBox="0 0 24 24" fill="none" aria-label="Loading receipt">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
          {state === 'error' ? (
            <p className="p-6 text-sm text-ink-muted">Could not load this receipt.</p>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={`Receipt: ${title}`}
              onLoad={() => setState('ready')}
              onError={() => setState('error')}
              className={`max-h-[calc(100dvh-12rem)] w-auto max-w-full rounded-lg object-contain transition-opacity duration-200 ${state === 'ready' ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-[14px] bg-ink/[0.07] text-[15px] font-medium text-ink transition active:scale-[0.98] active:opacity-80"
          >
            Close
          </button>
          <a
            href={`${src}?download=1`}
            download
            className="inline-flex h-12 items-center justify-center rounded-[14px] bg-brand-red text-[15px] font-medium text-white transition active:scale-[0.98] active:opacity-80"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  )
}
