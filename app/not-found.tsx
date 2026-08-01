import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found | Havana Heating and Air',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <main className="page-top flex min-h-svh flex-col bg-white">
      <section className="container-site flex flex-1 flex-col items-center justify-center py-12 text-center">
        <p className="eyebrow">404</p>

        <h1 className="heading-display mt-5 max-w-2xl">
          This page couldn&apos;t be found.
        </h1>

        <p className="body-lead mx-auto mt-5 max-w-md">
          The link may be broken, or the page may have moved. Head home or request a free estimate
          and we will help from there.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <Link href="/contact" className="btn-primary">
            Get a Free Estimate
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-ink"
          >
            Back to Home
          </Link>
        </div>

        <nav
          aria-label="Helpful links"
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-border pt-8"
        >
          {[
            { href: '/about-us', label: 'About Us' },
            { href: '/services', label: 'View Services' },
            { href: '/contact', label: 'Contact Us' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-brand-red"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </section>
    </main>
  )
}
