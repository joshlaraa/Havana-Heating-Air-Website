import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi2'
import { FaPhone } from 'react-icons/fa6'

export default function EstimateCtaSection() {
  return (
    <section id="estimate" className="section-y bg-ink">
      <div className="container-site flex flex-col items-center text-center">
        <h2 className="heading-section max-w-2xl text-white">
          Ready for a free estimate?
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/65">
          Honest pricing, fast response, and dependable HVAC service for homes
          across San Diego County.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
          <Link href="/contact" className="btn-primary">
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
