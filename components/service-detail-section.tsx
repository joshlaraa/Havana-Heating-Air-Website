import Image from 'next/image'
import Link from 'next/link'
import { HiArrowRight, HiCheck, HiStar } from 'react-icons/hi2'
import { serviceEstimateHref, type Service } from '@/lib/services'

type ServiceDetailSectionProps = {
  service: Service
}

export default function ServiceDetailSection({ service }: ServiceDetailSectionProps) {
  const Icon = service.icon
  const estimateHref = serviceEstimateHref(service)

  return (
    <section className="page-top bg-white pb-20 lg:pb-28">
      <div className="container-site">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14 xl:gap-16">
          {/* Main column */}
          <div className="min-w-0">
            <div className="mb-4 flex items-center gap-2.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
                className="shrink-0"
              >
                <path
                  d="M2 10 L10 2"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
                <path
                  d="M5 12 L12 5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
              <span className="eyebrow">Service</span>
            </div>

            <h1 className="heading-display">{service.label}</h1>
            <p className="body-lead mt-5 max-w-xl">{service.description}</p>

            <h2 className="heading-section mt-12 sm:mt-14">
              About The Service
            </h2>
            <div className="mt-5 space-y-4">
              {service.detail.about.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="body-lead max-w-2xl">
                  {paragraph}
                </p>
              ))}
            </div>

            <h3 className="font-heading mt-12 text-xl font-bold text-ink sm:text-2xl">
              As part of this service, you can expect:
            </h3>
            <ul className="mt-6 space-y-5">
              {service.detail.expectations.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink">
                    <HiCheck size={14} className="text-white" />
                  </span>
                  <div>
                    <p className="font-heading text-[15px] font-bold text-ink">{item.title}</p>
                    <p className="body-sm mt-1">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <blockquote className="mt-12 rounded-2xl bg-brand-light px-6 py-6 sm:px-8 sm:py-7">
              <div className="mb-3 flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <HiStar key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="font-heading text-lg font-bold leading-snug text-ink text-balance sm:text-xl">
                “{service.detail.quote.text}”
              </p>
              <footer className="mt-4 text-sm font-medium text-ink-muted">
                {service.detail.quote.author}
              </footer>
            </blockquote>

            <h3 className="font-heading mt-12 text-xl font-bold text-ink sm:text-2xl">
              Who Can Benefit from This Service?
            </h3>
            <ol className="mt-6 space-y-4">
              {service.detail.beneficiaries.map((item, index) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="font-heading text-sm font-bold tabular-nums text-ink-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="body-sm pt-0.5 text-ink">{item}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 space-y-4 border-t border-border pt-10">
              {service.detail.closing.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="body-lead max-w-2xl">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Sidebar — top-aligned with title, sticks while main content scrolls */}
          <aside className="min-h-0">
            <div className="sticky top-28 space-y-6">
              <div className="overflow-hidden rounded-[1.5rem] bg-brand-light shadow-[0_12px_40px_rgba(17,24,39,0.08)] ring-1 ring-border/50">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={service.images[0].src}
                    alt={service.images[0].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 360px"
                    priority
                  />
                </div>

                <div className="px-6 py-7 sm:px-7">
                  <div className="mb-3 flex items-center gap-2.5">
                    <Icon size={20} className="text-brand-red" aria-hidden="true" />
                    <p className="eyebrow">Get Started</p>
                  </div>

                  <h2 className="font-heading text-2xl font-bold text-ink">{service.label}</h2>
                  <p className="body-sm mt-3">
                    Free estimate for this service. Clear options, honest pricing, no pressure.
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-border pt-6">
                    {['Quality craftsmanship', 'Timely completion', 'Transparent pricing'].map(
                      (item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2.5 text-sm font-medium text-ink"
                        >
                          <HiCheck size={16} className="shrink-0 text-brand-red" />
                          {item}
                        </li>
                      ),
                    )}
                  </ul>

                  <Link href={estimateHref} className="btn-primary mt-7 w-full">
                    Get a Free Estimate
                    <HiArrowRight size={16} />
                  </Link>

                  <a
                    href="tel:9092350771"
                    className="mt-4 block text-center text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    Or call 909.235.0771
                  </a>
                </div>
              </div>

              <Link
                href="/services"
                className="inline-flex text-sm font-medium text-ink-muted transition-colors hover:text-brand-red"
              >
                ← All services
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
