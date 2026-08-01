import { Suspense } from 'react'
import ContactSection from '@/components/contact-section'
import ContactFaqSection from '@/components/contact-faq-section'

export default function ContactPage() {
  return (
    <main>
      <Suspense fallback={<div className="page-top min-h-[50vh] bg-white" />}>
        <ContactSection />
      </Suspense>
      <ContactFaqSection />
    </main>
  )
}
