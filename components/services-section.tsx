'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  PiArrowUpRightBold,
  PiFanFill,
  PiFlameFill,
  PiSnowflakeFill,
  PiSparkleFill,
  PiWrenchFill,
} from 'react-icons/pi'
import { cn } from '@/lib/utils'

const services = [
  {
    id: 'ac-installation',
    label: 'AC Installation',
    href: '/services/ac-installation',
    icon: PiSnowflakeFill,
    description:
      'Professional air conditioning installation sized for your home — efficient cooling, clean workmanship, and systems built to last through San Diego summers.',
    images: [
      {
        src: '/images/about-hvac.png',
        alt: 'Technician installing a residential air conditioning unit',
      },
      {
        src: '/images/hero-bg.png',
        alt: 'HVAC professional working on ceiling AC equipment',
      },
    ],
  },
  {
    id: 'heating-repair',
    label: 'Heating Repair',
    href: '/services/heating-repair',
    icon: PiFlameFill,
    description:
      'Fast, honest heating repair when your system fails. We diagnose the issue, explain your options clearly, and restore warmth without the runaround.',
    images: [
      {
        src: '/images/hero-bg-2.png',
        alt: 'Technician servicing heating and cooling equipment',
      },
      {
        src: '/images/hero-bg-mobile.png',
        alt: 'Close-up of HVAC service work in progress',
      },
    ],
  },
  {
    id: 'ac-maintenance',
    label: 'AC Maintenance',
    href: '/services/ac-maintenance',
    icon: PiWrenchFill,
    description:
      'Seasonal tune-ups that keep your AC running quieter, cooler, and more efficiently — catching small issues before they become expensive breakdowns.',
    images: [
      {
        src: '/images/hero-bg.png',
        alt: 'Technician performing air conditioning maintenance',
      },
      {
        src: '/images/about-hvac.png',
        alt: 'Residential HVAC unit being serviced outdoors',
      },
    ],
  },
  {
    id: 'furnace-repair',
    label: 'Furnace Repair',
    href: '/services/furnace-repair',
    icon: PiFanFill,
    description:
      'Reliable furnace repair for safer, steadier heat. From ignition problems to airflow issues, we get your furnace back online with care and precision.',
    images: [
      {
        src: '/images/hero-bg-mobile-2.png',
        alt: 'HVAC technician inspecting furnace and duct equipment',
      },
      {
        src: '/images/hero-bg-2.png',
        alt: 'Professional heating system service',
      },
    ],
  },
  {
    id: 'indoor-air-quality',
    label: 'Indoor Air Quality',
    href: '/services/indoor-air-quality',
    icon: PiSparkleFill,
    description:
      'Cleaner air for healthier homes — filtration upgrades, duct solutions, and humidity control that reduce dust, allergens, and stale indoor air.',
    images: [
      {
        src: '/images/about-hvac.png',
        alt: 'Home comfort system supporting cleaner indoor air',
      },
      {
        src: '/images/hero-bg-mobile.png',
        alt: 'Technician improving indoor air quality systems',
      },
    ],
  },
] as const

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
    <section id="services" className="bg-brand-light py-20 lg:py-28">
      <div className="mx-auto flex max-w-7xl justify-center px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left column */}
          <div className="flex h-full flex-col">
            <h2 className="font-heading mb-3 text-3xl font-bold leading-[1.15] text-ink text-balance sm:text-4xl lg:text-[2.75rem]">
              HVAC
              <br />
              Services
            </h2>
            <p className="mb-8 max-w-sm text-base leading-relaxed text-ink-muted">
              Expert heating, cooling, and air solutions for every home we serve
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
                      'group flex flex-1 items-center gap-3.5 border-b border-gray-100 px-5 py-4 text-left transition-colors duration-200 last:border-b-0 sm:gap-4 sm:py-5',
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
            <p className="mb-4 max-w-md text-[15px] leading-relaxed text-ink-muted">
              {active.description}
            </p>
            <Link
              href={active.href}
              className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-brand-red transition-opacity duration-200 hover:opacity-80"
            >
              View Service
              <PiArrowUpRightBold size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
