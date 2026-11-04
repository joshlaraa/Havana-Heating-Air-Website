import Hero from '@/components/hero'
import AboutSection from '@/components/about-section'
import ServicesSection from '@/components/services-section'
import TestimonialsSection from '@/components/testimonials-section'
import EstimateCtaSection from '@/components/estimate-cta-section'
import FinancingSection from '@/components/financing-section'

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <FinancingSection />
      <TestimonialsSection />
      <EstimateCtaSection />
    </main>
  )
}
