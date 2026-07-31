import Image from 'next/image'
import Link from 'next/link'
import { HiArrowRight, HiCheck } from 'react-icons/hi2'
import SanDiegoMapPoster from '@/components/san-diego-map-poster'

const features = [
  'Reliable Comfort You Can Count On Year-Round',
  'Expert Installation, Repair, and Maintenance',
  'Commitment to Quality, Excellence in Service',
]

export default function AboutSection() {
  return (
    <section id="about" className="bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Image cluster
            Mobile: equal two-up photos + full-width experience badge
            Desktop: asymmetric stack with badge under the left photo */}
        <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[1fr_auto]">
            {/* Left photo */}
            <div className="pt-0 lg:pt-16">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2.75rem_0.75rem_0.75rem_0.75rem] lg:rounded-[5.5rem_1rem_1rem_1rem]">
                <Image
                  src="/images/about-hvac.png"
                  alt="Havana Heating and Air technician servicing a residential HVAC unit"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 45vw, 280px"
                />
              </div>
            </div>

            {/* Map poster: equal height on mobile, spans both rows on desktop */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-[0.75rem_0.75rem_2.75rem_0.75rem] lg:row-span-2 lg:aspect-auto lg:min-h-[26rem] lg:rounded-[1rem_1rem_5.5rem_1rem]">
              <SanDiegoMapPoster />
            </div>

            {/* Cuban-owned badge: full width on mobile, under left photo on desktop */}
            <div className="col-span-2 rounded-xl bg-ink px-5 py-4 text-center text-white sm:px-6 sm:py-5 lg:col-span-1">
              <p className="font-heading text-3xl font-bold leading-none sm:text-4xl">
                Cuban
              </p>
              <p className="mt-1 text-xs font-medium leading-snug text-white/80 sm:text-sm">
                Owned &amp; Operated
              </p>
            </div>
          </div>
        </div>

        {/* Text content */}
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
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-ink">
              About Us
            </span>
          </div>

          <h2 className="font-heading mb-5 max-w-xl text-3xl font-bold leading-[1.15] text-ink text-balance sm:text-4xl lg:text-[2.75rem]">
            Delivering Dependable Comfort for Every Home
          </h2>

          <p className="mb-8 max-w-lg text-base leading-relaxed text-ink-muted">
            Named after Havana, the capital and largest city of Cuba, we bring that same spirit of
            hospitality and hard work to every home we serve. Just as Havana thrives in the heat,
            we keep your space cool, comfortable, and cared for year-round.
          </p>

          <ul className="mb-10 flex flex-col gap-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink">
                  <HiCheck size={14} className="text-white" />
                </span>
                <span className="text-[15px] font-medium leading-snug text-ink">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <div>
            <Link
              href="/about-us"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-red px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-200 hover:bg-brand-red/90 hover:shadow-lg"
            >
              Read More
              <HiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
