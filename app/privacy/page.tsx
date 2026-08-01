import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Havana Heating and Air',
  description:
    'How Havana Heating and Air collects and uses contact information submitted through our website.',
}

export default function PrivacyPage() {
  return (
    <section className="page-top bg-white pb-24 lg:pb-28">
      <div className="container-site max-w-3xl">
        <h1 className="heading-section mb-3">Privacy Policy</h1>
        <p className="mb-10 text-sm font-medium text-ink-muted">
          Last updated: August 1, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-ink-secondary">
          <div>
            <h2 className="heading-card mb-2 text-ink">Who we are</h2>
            <p>
              Havana Heating and Air (&quot;we,&quot; &quot;us&quot;) provides HVAC services in San
              Diego County. This policy explains what we collect when you use{' '}
              <Link href="/" className="font-semibold text-ink underline-offset-2 hover:underline">
                our website
              </Link>{' '}
              and how we use it.
            </p>
          </div>

          <div>
            <h2 className="heading-card mb-2 text-ink">Information we collect</h2>
            <p className="mb-3">
              When you request an estimate or send a contact message, we collect the details you
              submit, which may include:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Service interest and message content</li>
            </ul>
            <p className="mt-3">
              Our hosting provider (Vercel) may also collect standard web analytics such as pages
              viewed, approximate location, device type, and referrer. We use this to understand site
              traffic, not to sell personal data.
            </p>
          </div>

          <div>
            <h2 className="heading-card mb-2 text-ink">How we use your information</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>To respond to your inquiry and provide quotes or service</li>
              <li>To contact you by phone or email about the request you submitted</li>
              <li>To operate, secure, and improve the website</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information. We do not use submitted contact details for
              unrelated marketing lists.
            </p>
          </div>

          <div>
            <h2 className="heading-card mb-2 text-ink">Who we share it with</h2>
            <p>
              Form submissions are emailed to our business inbox through our email delivery provider
              (Resend). Hosting and analytics run on Vercel. These providers process data only to
              deliver their services to us.
            </p>
          </div>

          <div>
            <h2 className="heading-card mb-2 text-ink">Retention</h2>
            <p>
              We keep inquiry details as long as needed to follow up on your request and maintain
              ordinary business records, then delete or archive them when no longer needed.
            </p>
          </div>

          <div>
            <h2 className="heading-card mb-2 text-ink">Your choices</h2>
            <p>
              To update or delete information you sent us, call{' '}
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

          <div>
            <h2 className="heading-card mb-2 text-ink">Contact</h2>
            <p>
              Havana Heating and Air · San Diego County · 909.235.0771 ·{' '}
              havanaheatingandair@gmail.com
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
