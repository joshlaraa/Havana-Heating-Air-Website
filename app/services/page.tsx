import ServicesCatalogSection from '@/components/services-catalog-section'
import EstimateCtaSection from '@/components/estimate-cta-section'

export default function ServicesPage() {
  return (
    <main className="page-top [&_#all-services]:pt-0">
      <ServicesCatalogSection headingAs="h1" />
      <EstimateCtaSection />
    </main>
  )
}
