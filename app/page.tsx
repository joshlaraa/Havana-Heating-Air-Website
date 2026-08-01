import Hero from '@/components/hero'
import AboutSection from '@/components/about-section'
import ServicesSection from '@/components/services-section'
import TestimonialsSection from '@/components/testimonials-section'
import EstimateCtaSection from '@/components/estimate-cta-section'

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <EstimateCtaSection />
    </main>
  )
}
