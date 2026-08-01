import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Havana Heating and Air',
  description:
    'Website terms for Havana Heating and Air, serving San Diego County homes.',
}

export default function TermsPage() {
  return (
    <section className="page-top bg-white pb-24 lg:pb-28">
      <div className="container-site max-w-3xl">
        <h1 className="heading-section mb-3">Terms &amp; Conditions</h1>
        <p className="mb-10 text-sm font-medium text-ink-muted">
          Last updated: August 1, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-ink-secondary">
          <div>
            <h2 className="heading-card mb-2 text-ink">Using this website</h2>
            <p>
              By using the Havana Heating and Air website, you agree to these terms. The site is
              provided for general information about our HVAC services in San Diego County and to
              help you request an estimate or contact us.
            </p>
          </div>

          <div>
            <h2 className="heading-card mb-2 text-ink">Estimates and service</h2>
            <p>
              Submitting a form or calling us does not create a binding service contract. Quotes,
              scheduling, and work details are confirmed directly with our team. Pricing and
              availability can change until we agree on the scope of work with you.
            </p>
          </div>

          <div>
            <h2 className="heading-card mb-2 text-ink">Accuracy of information</h2>
            <p>
              We aim to keep website content accurate, but service descriptions, photos, and
              availability may not reflect every job. If something matters for your home, confirm it
              with us by phone or email before making a decision.
            </p>
          </div>

          <div>
            <h2 className="heading-card mb-2 text-ink">Acceptable use</h2>
            <p>
              Do not misuse the site or contact forms. That includes submitting false information,
              automated spam, attempts to disrupt the service, or probing for security weaknesses.
              We may ignore or block abusive submissions.
            </p>
          </div>

          <div>
            <h2 className="heading-card mb-2 text-ink">Third-party links</h2>
            <p>
              Links to maps, reviews, or social profiles are for convenience. We are not responsible
              for the content or privacy practices of third-party sites.
            </p>
          </div>

          <div>
            <h2 className="heading-card mb-2 text-ink">Limitation of liability</h2>
            <p>
              To the fullest extent allowed by law, Havana Heating and Air is not liable for
              damages arising from use of this website or reliance on its general information.
              Service work is governed by the agreement we make with you for that job.
            </p>
          </div>

          <div>
            <h2 className="heading-card mb-2 text-ink">Privacy</h2>
            <p>
              How we handle information you submit is described in our{' '}
              <Link
                href="/privacy"
                className="font-semibold text-ink underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="heading-card mb-2 text-ink">Contact</h2>
            <p>
              Questions about these terms? Call{' '}
              <a href="tel:9092350771" className="font-semibold text-ink underline-offset-2 hover:underline">
                909.235.0771
              </a>{' '}
              or email{' '}
              <a
                href="mailto:havanaheatingandair@gmail.com"
                className="font-semibold text-ink underline-offset-2 hover:underline"
              >
                havanaheatingandair@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
