import Image from 'next/image'
import Link from 'next/link'
import { PiArrowUpRightBold } from 'react-icons/pi'
import { services } from '@/lib/services'
import { cn } from '@/lib/utils'

type ServicesCatalogSectionProps = {
  /** Show the page header + intro. Default true. */
  showIntro?: boolean
  /** Use h1 on dedicated services page, h2 when embedded. */
  headingAs?: 'h1' | 'h2'
  className?: string
}

export default function ServicesCatalogSection({
  showIntro = true,
  headingAs = 'h2',
  className,
}: ServicesCatalogSectionProps) {
  const Heading = headingAs

  return (
    <section id="all-services" className={cn('section-y bg-white', className)}>
      <div className="container-site">
        {showIntro && (
          <header className="mb-12 max-w-2xl lg:mb-16">
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
              <span className="eyebrow">Our Services</span>
            </div>

            <Heading className="heading-section">
              Heating and cooling for every season
            </Heading>
            <p className="body-lead mt-4 max-w-xl">
              Installs, repairs, and tune-ups for San Diego County homes. Pick a service below to
              get a free estimate or see the details.
            </p>
          </header>
        )}

        <ul className="grid grid-cols-1 gap-x-7 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <li key={service.id} id={service.id}>
              <article className="group relative flex h-full flex-col">
                <div className="relative aspect-[5/4] overflow-hidden rounded-[1.25rem] bg-brand-light sm:aspect-[4/3] sm:rounded-[1.5rem]">
                  <Image
                    src={service.images[0].src}
                    alt={service.images[0].alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 3}
                  />
                </div>

                <div className="relative z-10 mx-4 -mt-16 flex flex-1 flex-col rounded-[1.25rem] bg-white px-6 py-7 shadow-[0_16px_50px_rgba(17,24,39,0.14)] sm:mx-5 sm:-mt-20 sm:rounded-[1.5rem] sm:px-8 sm:py-8 lg:-mt-24">
                  <h3 className="font-heading text-xl font-bold text-ink sm:text-[1.35rem]">
                    {service.label}
                  </h3>
                  <p className="body-sm mt-3 line-clamp-3 flex-1">{service.description}</p>
                  <Link href={service.href} className="link-cta mt-6">
                    View Service
                    <PiArrowUpRightBold size={14} />
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
