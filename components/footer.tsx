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
  { label: 'Yelp', href: '#', icon: FaYelp },
  { label: 'Google Reviews', href: '#', icon: FaGoogle },
  { label: 'Instagram', href: '#', icon: FaInstagram },
  { label: 'Facebook', href: '#', icon: FaFacebookF },
]

export default function Footer() {
  return (
    <footer className="bg-brand-light">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-5">
              <div className="relative h-24 w-24 flex-shrink-0">
                <Image
                  src="/images/havana-logo.png"
                  alt="Havana Heating and Air logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-heading font-bold text-ink text-base leading-tight">
                  HAVANA
                </p>
                <p className="font-heading font-bold text-ink text-base leading-tight">
                  HEATING AND AIR
                </p>
              </div>
            </Link>

            <p className="text-ink-muted text-sm leading-relaxed font-medium mb-6 max-w-xs">
              We&apos;re committed to delivering top-quality HVAC service that keeps your home
              comfortable year-round. With years of expertise focused on customer care.
            </p>

            <div className="flex items-center gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-ink-secondary transition-all duration-200 hover:border-ink hover:text-ink"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Top Links */}
          <div>
            <h3 className="font-heading text-ink text-lg font-bold mb-5">Top Links</h3>
            <ul className="flex flex-col gap-3">
              {topLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ink-muted text-sm font-medium hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="font-heading text-ink text-lg font-bold mb-5">Our Services</h3>
            <ul className="flex flex-col gap-3">
              {services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ink-muted text-sm font-medium hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-heading text-ink text-lg font-bold mb-5">Contact Us</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="tel:9092350771"
                  className="flex items-start gap-3 text-ink-muted text-sm font-medium hover:text-ink transition-colors"
                >
                  <FaPhone size={14} className="mt-0.5 flex-shrink-0 text-ink-secondary" />
                  <span>909.235.0771</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-ink-muted text-sm font-medium">
                  <FaLocationDot size={14} className="mt-0.5 flex-shrink-0 text-ink-secondary" />
                  <span>Serving the Inland Empire & Surrounding Areas</span>
                </div>
              </li>
              <li>
                <a
                  href="mailto:havanaheatingandair@gmail.com"
                  className="flex items-start gap-3 text-ink-muted text-sm font-medium hover:text-ink transition-colors"
                >
                  <FaEnvelope size={14} className="mt-0.5 flex-shrink-0 text-ink-secondary" />
                  <span>havanaheatingandair@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-ink-faint text-sm font-medium">
            Copyright ©{new Date().getFullYear()} Havana Heating and Air. All Rights Reserved
          </p>
          <div className="flex items-center gap-2 text-ink-faint text-sm font-medium">
            <Link href="/terms" className="hover:text-ink transition-colors">
              Terms & Conditions
            </Link>
            <span aria-hidden="true">|</span>
            <Link href="/privacy" className="hover:text-ink transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
