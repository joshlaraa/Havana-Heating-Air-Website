'use client'

import { useState } from 'react'
import { HiMinus, HiPlus } from 'react-icons/hi2'
import { cn } from '@/lib/utils'

export type FaqItem = {
  question: string
  answer: string
}

type FaqSectionProps = {
  id?: string
  eyebrow?: string
  title: string
  description: string
  faqs: readonly FaqItem[]
  className?: string
}

export default function FaqSection({
  id = 'faq',
  eyebrow = 'FAQ',
  title,
  description,
  faqs,
  className = 'bg-white',
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id={id} className={cn('section-y', className)}>
      <div className="container-site grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="max-w-md">
          <div className="mb-4 flex items-center gap-2.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <path d="M2 10 L10 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              <path d="M5 12 L12 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            <span className="eyebrow">{eyebrow}</span>
          </div>

          <h2 className="heading-section">{title}</h2>
          <p className="body-lead mt-4">{description}</p>
        </div>

        <div className="flex flex-col border-t border-border">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            const triggerId = `${id}-trigger-${index}`
            const panelId = `${id}-panel-${index}`

            return (
              <div key={faq.question} className="border-b border-border">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  id={triggerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-start justify-between gap-6 py-5 text-left text-ink transition-colors duration-200 sm:py-6"
                >
                  <span
                    className={cn(
                      'font-heading text-base font-bold leading-snug text-ink sm:text-lg',
                    )}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={cn(
                      'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200',
                      isOpen ? 'bg-brand-red text-white' : 'bg-white text-ink shadow-sm ring-1 ring-border',
                    )}
                    aria-hidden="true"
                  >
                    {isOpen ? <HiMinus size={14} /> : <HiPlus size={14} />}
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={cn(
                    'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="body-sm max-w-xl pb-5 sm:pb-6">{faq.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
