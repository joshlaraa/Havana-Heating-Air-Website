import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi2'
import { FaPhone } from 'react-icons/fa6'

export default function EstimateCtaSection() {
  return (
    <section id="estimate" className="bg-ink py-20 lg:py-28">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
        <h2 className="font-heading max-w-2xl text-3xl font-bold leading-[1.15] text-white text-balance sm:text-4xl lg:text-[2.75rem]">
          Ready for a free estimate?
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/65">
          Honest pricing, fast response, and dependable HVAC service for homes
          across San Diego County.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-red px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-200 hover:bg-brand-red/90 hover:shadow-lg"
          >
            Get a Free Estimate
            <HiArrowRight size={16} />
          </Link>
          <a
            href="tel:9092350771"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/75 transition-colors duration-200 hover:text-white"
          >
            <FaPhone size={13} aria-hidden="true" />
            909.235.0771
          </a>
        </div>
      </div>
    </section>
  )
}
