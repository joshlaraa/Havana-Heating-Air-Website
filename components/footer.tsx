import Image from 'next/image'
import Link from 'next/link'
import {
  FaFacebookF,
  FaYelp,
  FaGoogle,
  FaInstagram,
  FaPhone,
  FaLocationDot,
  FaEnvelope,
} from 'react-icons/fa6'

const topLinks = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Our Services', href: '/services' },
  { label: 'Recent Blog', href: '/blog' },
  { label: 'Our Team', href: '/team' },
  { label: 'Contact Us', href: '/contact' },
]

const services = [
  { label: 'AC Installation', href: '/services/ac-installation' },
  { label: 'Heating Repair', href: '/services/heating-repair' },
  { label: 'AC Maintenance', href: '/services/ac-maintenance' },
  { label: 'Furnace Repair', href: '/services/furnace-repair' },
  { label: 'Indoor Air Quality', href: '/services/indoor-air-quality' },
]

const socials = [
  {
    label: 'Yelp',
    href: 'https://www.yelp.com/biz/havana-heating-and-air-escondido-2',
    icon: FaYelp,
  },
  { label: 'Google Reviews', href: '#', icon: FaGoogle },
  { label: 'Instagram', href: 'https://www.instagram.com/havanaheatingandair', icon: FaInstagram },
  { label: 'Facebook', href: '#', icon: FaFacebookF },
]

export default function Footer() {
  return (
    <footer className="bg-brand-light">
      <div className="container-site pt-16 pb-10 lg:pt-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="mb-5 inline-flex items-center gap-3">
              <div className="relative h-24 w-24 flex-shrink-0">
                <Image
                  src="/images/havana-logo.png"
                  alt="Havana Heating and Air logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-heading text-base font-bold leading-tight text-ink">
                  HAVANA
                </p>
                <p className="font-heading text-base font-bold leading-tight text-ink">
                  HEATING AND AIR
                </p>
              </div>
            </Link>

            <p className="body-sm mb-6 max-w-xs font-medium">
              Local HVAC service for San Diego County homes. Honest work, clear pricing, and comfort
              you can count on year-round.
            </p>

            <div className="flex items-center gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink-secondary transition-all duration-200 hover:border-ink hover:text-ink"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Top Links */}
          <div>
            <h3 className="heading-card mb-5">Top Links</h3>
            <ul className="flex flex-col gap-3">
              {topLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="heading-card mb-5">Our Services</h3>
            <ul className="flex flex-col gap-3">
              {services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="heading-card mb-5">Contact Us</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="tel:9092350771"
                  className="flex items-start gap-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                >
                  <FaPhone size={14} className="mt-0.5 flex-shrink-0 text-ink-secondary" />
                  <span>909.235.0771</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm font-medium text-ink-muted">
                  <FaLocationDot size={14} className="mt-0.5 flex-shrink-0 text-ink-secondary" />
                  <span>Serving San Diego County &amp; Surrounding Areas</span>
                </div>
              </li>
              <li>
                <a
                  href="mailto:havanaheatingandair@gmail.com"
                  className="flex items-start gap-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                >
                  <FaEnvelope size={14} className="mt-0.5 flex-shrink-0 text-ink-secondary" />
                  <span>havanaheatingandair@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="text-sm font-medium text-ink-faint">
            Copyright ©{new Date().getFullYear()} Havana Heating and Air. All Rights Reserved
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-ink-faint">
            <Link href="/terms" className="transition-colors hover:text-ink">
              Terms & Conditions
            </Link>
            <span aria-hidden="true">|</span>
            <Link href="/privacy" className="transition-colors hover:text-ink">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
