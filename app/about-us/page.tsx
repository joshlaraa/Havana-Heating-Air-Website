import AboutSection from '@/components/about-section'
import ValuesSection from '@/components/values-section'
import AboutFaqSection from '@/components/about-faq-section'
import EstimateCtaSection from '@/components/estimate-cta-section'

export default function AboutUsPage() {
  return (
    // page-top clears the fixed nav; zero AboutSection's top pad so it isn't doubled
    <main className="page-top [&_#about]:pt-0">
      <AboutSection showAboutCta={false} />
      <ValuesSection />
      <AboutFaqSection />
      <EstimateCtaSection />
    </main>
  )
}
