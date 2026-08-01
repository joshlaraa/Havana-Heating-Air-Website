import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ServiceDetailSection from '@/components/service-detail-section'
import EstimateCtaSection from '@/components/estimate-cta-section'
import { getServiceById, services } from '@/lib/services'

type ServicePageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.id }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceById(slug)

  if (!service) {
    return { title: 'Service Not Found | Havana Heating and Air' }
  }

  return {
    title: `${service.label} | Havana Heating and Air`,
    description: service.description,
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getServiceById(slug)

  if (!service) notFound()

  return (
    <main>
      <ServiceDetailSection service={service} />
      <EstimateCtaSection />
    </main>
  )
}
