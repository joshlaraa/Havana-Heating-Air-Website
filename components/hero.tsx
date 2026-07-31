'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HiArrowRight, HiCheckCircle, HiStar } from 'react-icons/hi2'
import AnimatedSelect from '@/components/ui/animated-select'
import FormSubmitSlot from '@/components/ui/form-submit-slot'
import { cn } from '@/lib/utils'

const serviceOptions = [
  { value: 'ac-repair', label: 'AC Repair' },
  { value: 'heating', label: 'Heating Repair' },
  { value: 'installation', label: 'New Installation' },
  { value: 'maintenance', label: 'Maintenance / Tune-Up' },
  { value: 'emergency', label: 'Emergency Service' },
  { value: 'other', label: 'Other' },
]

export default function Hero() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    serviceType: '',
    description: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const missing: string[] = []
    if (!formData.fullName.trim()) missing.push('full name')
    if (!formData.phone.trim()) missing.push('phone number')
    if (!formData.serviceType) missing.push('service type')

    if (missing.length > 0) {
      setErrorMessage(
        missing.length === 1
          ? `Add your ${missing[0]} to continue`
          : 'Please complete all required fields'
      )
      return
    }

    setErrorMessage(null)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setFormData({ fullName: '', phone: '', serviceType: '', description: '' })
  }

  const fieldClass =
    'w-full bg-white border border-gray-200 text-ink placeholder:text-ink-faint rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-ink/30 focus:ring-2 focus:ring-ink/5 transition-[border-color,box-shadow] duration-200'

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-white"
    >
      {/* Background image: full bleed */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg-mobile.png"
          alt="HVAC technician servicing a ceiling air conditioning unit"
          fill
          className="object-cover object-[center_90%] md:hidden"
          priority
        />
        <Image
          src="/images/hero-bg.png"
          alt="HVAC technician servicing a ceiling air conditioning unit"
          fill
          className="hidden object-cover object-center md:block"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-36 pb-24 sm:pt-40 lg:pt-44 lg:pb-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex -space-x-2.5">
                {[
                  'https://i.pravatar.cc/40?img=11',
                  'https://i.pravatar.cc/40?img=32',
                  'https://i.pravatar.cc/40?img=56',
                  'https://i.pravatar.cc/40?img=44',
                ].map((src, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-white/80 overflow-hidden flex-shrink-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="customer" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <HiStar key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/60 text-xs mt-0.5">4.9/5 Google Rating</p>
              </div>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.1] mb-6 text-balance">
              Fast HVAC Service for Homes and Businesses
            </h1>

            <p className="text-white text-base leading-relaxed max-w-md mb-8">
              Reliable heating, cooling, and air conditioning services for homes and
              businesses. Our certified technicians deliver fast response, honest
              pricing, and dependable comfort solutions year-round.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red/90 text-white font-light px-7 py-3.5 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get a Free Estimate
                <HiArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/60 bg-transparent hover:border-white text-white font-light px-7 py-3.5 rounded-full transition-all duration-200"
              >
                View Services
                <HiArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Request Form Card */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="relative z-20 overflow-visible bg-white rounded-2xl p-7 shadow-2xl border border-black/5">
              <h2 className="font-heading text-ink font-bold text-lg text-center mb-1.5">
                Request Fast HVAC Service
              </h2>
              <p className="text-ink-muted text-sm text-center mb-6">
                We&apos;ll get back to you shortly.
              </p>

              <div className="relative">
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className={cn(
                    'flex flex-col gap-3 transition-opacity duration-200 ease-out',
                    submitted ? 'pointer-events-none opacity-0' : 'opacity-100'
                  )}
                  aria-hidden={submitted}
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={fieldClass}
                    autoComplete="name"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={fieldClass}
                    autoComplete="tel"
                  />
                  <AnimatedSelect
                    options={serviceOptions}
                    value={formData.serviceType}
                    onChange={(serviceType) => setFormData({ ...formData, serviceType })}
                    placeholder="Service Type"
                    aria-label="Service Type"
                  />
                  <textarea
                    placeholder="Short Description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`${fieldClass} resize-none`}
                  />
                  <FormSubmitSlot
                    label="Submit Request"
                    error={errorMessage}
                    onErrorDismiss={() => setErrorMessage(null)}
                    className={cn('mt-1', submitted && '[&_*]:transition-none')}
                  />
                </form>

                <div
                  aria-live="polite"
                  aria-hidden={!submitted}
                  className={cn(
                    'absolute inset-0 flex flex-col items-center justify-center bg-white text-center transition-opacity duration-200 ease-out',
                    submitted
                      ? 'pointer-events-auto opacity-100'
                      : 'pointer-events-none opacity-0'
                  )}
                >
                  <HiCheckCircle size={48} className="mb-3 text-emerald-500" />
                  <p className="text-base font-semibold text-ink">Request Sent!</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    We&apos;ll contact you shortly.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
