import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi2'

const financingSteps = [
  {
    number: '01',
    title: 'Get a clear estimate',
    description: 'We start by understanding your home and the work it needs.',
  },
  {
    number: '02',
    title: 'Ask about options',
    description: 'We will walk you through available financing for your project.',
  },
  {
    number: '03',
    title: 'Choose what fits',
    description: 'Move forward with a plan that feels right for your home.',
  },
]

export default function FinancingSection() {
  return (
    <section id="financing" className="section-y bg-white">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="max-w-md">
            <h2 className="heading-section">
              Financing options for your HVAC project.
            </h2>
            <p className="body-lead mt-4">
              New equipment and major repairs are a big decision. Ask us about financing options
              that may help make your project easier to plan for.
            </p>
            <Link href="/contact" className="link-cta mt-7">
              Ask About Financing
              <HiArrowRight size={14} aria-hidden="true" />
            </Link>
            <p className="mt-5 text-xs leading-relaxed text-ink-faint">
              Subject to approval. Availability and terms vary.
            </p>
          </div>

          <ol className="divide-y divide-border border-y border-border">
            {financingSteps.map((step) => (
              <li key={step.number} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5 sm:grid-cols-[3.5rem_1fr] sm:gap-6 sm:py-6">
                <span className="font-heading text-sm font-bold text-brand-red">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-heading text-base font-bold text-ink sm:text-lg">
                    {step.title}
                  </h3>
                  <p className="body-sm mt-1 max-w-lg">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
