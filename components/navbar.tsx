'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { HiXMark, HiBars3BottomRight } from 'react-icons/hi2'
import { FaPhone } from 'react-icons/fa6'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about-us', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
] as const

const linkClassName =
  'text-white/90 hover:text-white transition-colors text-sm font-medium cursor-pointer'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <nav className="fixed top-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl -translate-x-1/2 sm:w-11/12">
      <div className="rounded-2xl bg-black/85 px-6 py-4 shadow-2xl backdrop-blur-md md:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex cursor-pointer items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-visible md:h-12 md:w-12">
              <Image
                src="/images/havana-logo.png"
                alt="Havana Heating and Air logo"
                width={72}
                height={72}
                className="absolute left-1/2 top-1/2 h-14 w-14 max-w-none -translate-x-1/2 -translate-y-1/2 object-contain md:h-16 md:w-16"
                priority
              />
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={linkClassName}
                prefetch
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="btn-primary hidden cursor-pointer md:inline-flex"
              prefetch
            >
              <FaPhone size={14} />
              Contact Us
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="relative rounded-lg p-2 text-white transition-colors hover:bg-white/10 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <HiBars3BottomRight
                className={cn(
                  'h-6 w-6 transition-all duration-300 ease-out',
                  mobileMenuOpen
                    ? 'rotate-90 scale-75 opacity-0'
                    : 'rotate-0 scale-100 opacity-100'
                )}
              />
              <HiXMark
                className={cn(
                  'absolute inset-0 m-auto h-6 w-6 transition-all duration-300 ease-out',
                  mobileMenuOpen
                    ? 'rotate-0 scale-100 opacity-100'
                    : '-rotate-90 scale-75 opacity-0'
                )}
              />
            </button>
          </div>
        </div>

        {/* Mobile dropdown — animates open without changing the top bar height */}
        <div
          className={cn(
            'grid md:hidden transition-[grid-template-rows] duration-300 ease-out',
            mobileMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="overflow-hidden">
            <div
              className={cn(
                'origin-top border-t border-white/10 pt-4 transition-all duration-300 ease-out',
                mobileMenuOpen
                  ? 'mt-4 translate-y-0 opacity-100'
                  : 'mt-0 -translate-y-1 opacity-0'
              )}
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      transitionDelay: mobileMenuOpen ? `${80 + index * 40}ms` : '0ms',
                    }}
                    className={cn(
                      'cursor-pointer rounded-lg px-2 py-3 text-sm font-medium text-white/90 transition-all duration-300 ease-out hover:bg-white/5 hover:text-white',
                      mobileMenuOpen
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-1 opacity-0'
                    )}
                    prefetch
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  transitionDelay: mobileMenuOpen ? `${80 + NAV_LINKS.length * 40}ms` : '0ms',
                }}
                className={cn(
                  'btn-primary mt-4 w-full cursor-pointer transition-[transform,opacity] duration-300 ease-out',
                  mobileMenuOpen
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-1 opacity-0'
                )}
                prefetch
              >
                <FaPhone size={14} />
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
