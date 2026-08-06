import Image from 'next/image'
import Link from 'next/link'
import { HiArrowRight, HiCheck } from 'react-icons/hi2'
import { PiArrowUpRightBold } from 'react-icons/pi'

const features = [
  'AC, heating, mini splits, and QuietCool under one roof',
  'Clean installs and repairs that respect your home',
  'Clear pricing before we start, no pressure to upsell',
]

type AboutSectionProps = {
  /** When false, hides the homepage about CTA (e.g. on /about-us). */
  showAboutCta?: boolean
}

export default function AboutSection({ showAboutCta = true }: AboutSectionProps) {
  return (
    <section id="about" className="section-y bg-white">
      <div className="container-site grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image cluster
            Mobile: equal two-up photos + full-width experience badge
            Desktop: asymmetric stack with badge under the left photo */}
        <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[1fr_auto]">
            <div className="lg:pt-10">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2.75rem_0.75rem_0.75rem_0.75rem] lg:rounded-[5.5rem_1rem_1rem_1rem]">
                <Image
                  src="/images/van.png"
                  alt="Havana Heating and Air technician servicing a residential HVAC unit"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 45vw, 280px"
                />
              </div>
            </div>

            <div className="relative aspect-[3/4] overflow-hidden rounded-[0.75rem_0.75rem_2.75rem_0.75rem] lg:row-span-2 lg:aspect-auto lg:min-h-[22rem] lg:rounded-[1rem_1rem_5.5rem_1rem]">
              <Image
                src="/images/osiel-owner.png"
                alt="Havana Heating and Air branded service van"
                fill
                className="object-cover object-[center_30%]"
                sizes="(max-width: 1024px) 45vw, 280px"
              />
            </div>

            <div className="col-span-2 rounded-2xl bg-ink px-5 py-3.5 text-center text-white sm:px-6 sm:py-4 lg:col-span-1">
              <p className="font-heading flex items-center justify-center gap-2 text-lg font-bold leading-snug sm:text-xl">
                <span>Cuba</span>
                <HiArrowRight className="size-4 shrink-0 text-brand-red sm:size-5" aria-hidden="true" />
                <span>California</span>
                <span className="sr-only">from Cuba to California</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
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
            <span className="eyebrow">About Us</span>
          </div>

          <h2 className="heading-section mb-5 max-w-xl">
            Comfort you can count on, from a team that shows up
          </h2>

          <div className="body-lead mb-8 flex max-w-lg flex-col gap-4">
            <p>
              Havana Heating &amp; Air was built on hard work, integrity, and a commitment to
              treating every customer like family. We believe every home deserves dependable
              comfort, honest service, and workmanship that stands the test of time.
            </p>
            <p>
              We don&apos;t just install heating and air conditioning systems. We build lasting
              relationships through quality work and genuine care.
            </p>
          </div>

          <ul className={`flex flex-col gap-4 ${showAboutCta ? 'mb-10' : ''}`}>
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink">
                  <HiCheck size={14} className="text-white" />
                </span>
                <span className="text-[15px] font-medium leading-snug text-ink">{feature}</span>
              </li>
            ))}
          </ul>

          {showAboutCta && (
            <div>
              <Link href="/about-us" className="link-cta">
                Learn More
                <PiArrowUpRightBold size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
