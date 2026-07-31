'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { HiCheck, HiChevronDown } from 'react-icons/hi2'
import { cn } from '@/lib/utils'

export type SelectOption = {
  value: string
  label: string
}

type AnimatedSelectProps = {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  name?: string
  'aria-label'?: string
}

export default function AnimatedSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  required,
  name,
  'aria-label': ariaLabel,
}: AnimatedSelectProps) {
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return

    function handlePointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      setHighlighted(-1)
      return
    }
    const index = options.findIndex((option) => option.value === value)
    setHighlighted(index >= 0 ? index : 0)
  }, [open, options, value])

  function selectOption(next: string) {
    onChange(next)
    setOpen(false)
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
    }
  }

  function handleListKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlighted((prev) => (prev + 1) % options.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlighted((prev) => (prev <= 0 ? options.length - 1 : prev - 1))
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (highlighted >= 0) selectOption(options[highlighted].value)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      {name ? <input type="hidden" name={name} value={value} required={required} /> : null}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel || placeholder}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm transition-all duration-200',
          'focus:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/5',
          open && 'border-ink/30 ring-2 ring-ink/5',
          selected ? 'text-ink' : 'text-ink-faint'
        )}
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <HiChevronDown
          size={16}
          className={cn(
            'shrink-0 text-ink-faint transition-transform duration-300 ease-out',
            open && 'rotate-180'
          )}
        />
      </button>

      <div
        className={cn(
          'absolute left-0 right-0 z-30 origin-top pt-1.5 transition-all duration-200 ease-out',
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-[0.98] opacity-0'
        )}
      >
        <div
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={
            highlighted >= 0 ? `${listId}-option-${options[highlighted]?.value}` : undefined
          }
          onKeyDown={handleListKeyDown}
          className="max-h-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 shadow-xl shadow-ink/10"
        >
          <div className="max-h-[13.5rem] overflow-auto px-1.5">
            {options.map((option, index) => {
              const isSelected = option.value === value
              const isActive = index === highlighted

              return (
                <button
                  key={option.value}
                  id={`${listId}-option-${option.value}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => selectOption(option.value)}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-150',
                    isActive ? 'bg-brand-light text-ink' : 'text-ink-secondary hover:bg-brand-light/70',
                    isSelected && 'font-medium text-ink'
                  )}
                >
                  <span>{option.label}</span>
                  <HiCheck
                    size={15}
                    className={cn(
                      'shrink-0 text-ink transition-opacity duration-150',
                      isSelected ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
