'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { HiXMark, HiBars3BottomRight } from 'react-icons/hi2'
import { FaPhone } from 'react-icons/fa6'
import Image from 'next/image'
import Link from 'next/link'

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
  const [pastHero, setPastHero] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isHome = pathname === '/'
  const solid = !isHome || pastHero

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isHome) {
      setPastHero(true)
      return
    }

    let ticking = false

    const update = () => {
      const hero = document.getElementById('home')
      if (!hero) {
        setPastHero(window.scrollY > 50)
        return
      }
      // Solid once the hero has scrolled out from under the floating navbar
      setPastHero(hero.getBoundingClientRect().bottom <= 96)
    }

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }

    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [isHome, pathname])

  return (
    <nav className="fixed top-6 left-1/2 z-50 w-11/12 max-w-6xl -translate-x-1/2">
      <div
        className={`rounded-2xl px-6 transition-all duration-300 md:px-8 ${
          solid
            ? 'bg-black/85 shadow-2xl backdrop-blur-md'
            : 'bg-white/20 shadow-lg backdrop-blur-md'
        } ${mobileMenuOpen ? 'py-6' : 'py-4'}`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
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
              className="hidden cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-sm font-light text-white transition-all duration-200 hover:bg-brand-red/90 md:inline-flex"
              prefetch
            >
              <FaPhone size={14} />
              Contact Us
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <HiXMark className="h-6 w-6" />
              ) : (
                <HiBars3BottomRight className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="mt-6 flex flex-col gap-1 border-t border-white/10 pt-4">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="cursor-pointer rounded-lg px-2 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-white"
                  prefetch
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-center text-sm font-light text-white transition-all duration-200 hover:bg-brand-red/90"
              prefetch
            >
              <FaPhone size={14} />
              Contact Us
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
