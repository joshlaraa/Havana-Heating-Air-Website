'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PiArrowUpRightBold } from 'react-icons/pi'
import { cn } from '@/lib/utils'
import { services } from '@/lib/services'

export default function ServicesSection() {
  const [activeId, setActiveId] = useState<(typeof services)[number]['id']>(services[0].id)
  const [fading, setFading] = useState(false)
  const active = services.find((service) => service.id === activeId) ?? services[0]

  function selectService(id: (typeof services)[number]['id']) {
    if (id === activeId || fading) return
    setFading(true)
    window.setTimeout(() => {
      setActiveId(id)
      setFading(false)
    }, 180)
  }

  return (
    <section id="services" className="section-y bg-brand-light">
      <div className="container-site flex justify-center">
        <div className="grid w-full grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left column */}
          <div className="flex h-full flex-col">
            <h2 className="heading-section mb-3">
              HVAC
              <br />
              Services
            </h2>
            <p className="body-lead mb-8 max-w-sm">
              Heating, cooling, and air solutions for homes across San Diego County
            </p>

            <div
              role="tablist"
              aria-label="HVAC services"
              className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(17,24,39,0.06)]"
            >
              {services.map((service) => {
                const Icon = service.icon
                const isActive = service.id === activeId

                return (
                  <button
                    key={service.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => selectService(service.id)}
                    className={cn(
                      'group flex flex-1 items-center gap-3.5 border-b border-border px-5 py-4 text-left transition-colors duration-200 last:border-b-0 sm:gap-4 sm:py-5',
                      isActive
                        ? 'bg-brand-light text-brand-red'
                        : 'bg-white text-ink hover:bg-brand-light hover:text-ink-secondary'
                    )}
                  >
                    <Icon
                      size={26}
                      className={cn(
                        'shrink-0 transition-colors duration-200',
                        isActive
                          ? 'text-brand-red'
                          : 'text-ink group-hover:text-ink-secondary'
                      )}
                    />
                    <span className="flex-1 text-[15px] font-medium tracking-tight">
                      {service.label}
                    </span>
                    <PiArrowUpRightBold
                      size={15}
                      className={cn(
                        'shrink-0 transition-all duration-200',
                        isActive
                          ? 'translate-x-0.5 -translate-y-0.5 text-brand-red'
                          : 'text-ink-faint group-hover:text-ink-muted'
                      )}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right column — same top, same stretch height */}
          <div
            className={cn(
              'flex h-full flex-col transition-all duration-300 ease-out',
              fading ? 'translate-y-1 opacity-0' : 'translate-y-0 opacity-100'
            )}
          >
            <div className="mb-6 grid min-h-[18rem] flex-1 grid-cols-2 items-end gap-3 sm:min-h-[22rem] sm:gap-4">
              <div className="relative h-full min-h-[16rem] overflow-hidden rounded-2xl sm:min-h-[20rem]">
                <Image
                  key={`${active.id}-a`}
                  src={active.images[0].src}
                  alt={active.images[0].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 45vw, 280px"
                />
              </div>
              <div className="relative h-[75%] min-h-[12rem] overflow-hidden rounded-2xl sm:min-h-[15rem]">
                <Image
                  key={`${active.id}-b`}
                  src={active.images[1].src}
                  alt={active.images[1].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 45vw, 240px"
                />
              </div>
            </div>

            <h3 className="font-heading mb-2.5 text-2xl font-bold text-ink sm:text-[1.65rem]">
              {active.label}
            </h3>
            <p className="body-sm mb-4 max-w-md">
              {active.description}
            </p>
            <Link href={active.href} className="link-cta">
              View Service
              <PiArrowUpRightBold size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
