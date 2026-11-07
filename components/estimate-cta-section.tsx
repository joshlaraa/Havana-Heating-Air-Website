import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi2'
import { FaPhone } from 'react-icons/fa6'

export default function EstimateCtaSection() {
  return (
    <section id="estimate" className="section-y bg-ink">
      <div className="container-site flex flex-col items-center text-center">
        <h2 className="heading-section max-w-2xl text-white">
          Need AC or heat fixed? Get a free estimate.
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/65">
          Tell us what is going on at your home. We will reply with clear next steps and honest
          pricing for San Diego County.
        </p>

        <div className="mt-8 flex w-full flex-col items-center">
          <div className="flex w-full max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/contact" className="btn-primary shadow-lg hover:shadow-xl">
              Get a Free Estimate
              <HiArrowRight size={16} />
            </Link>
            <a href="tel:9092350771" className="btn-secondary">
              <FaPhone size={13} aria-hidden="true" />
              Call 909.235.0771
            </a>
          </div>
          <p className="mt-6 text-sm text-white/65">
            Need payment flexibility?{' '}
            <Link
              href="/contact"
              className="font-medium text-white underline underline-offset-4 decoration-white/40 transition-colors duration-200 hover:decoration-white"
            >
              Ask about financing
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
