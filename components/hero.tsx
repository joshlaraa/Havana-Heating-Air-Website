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
  const [pending, setPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formKey, setFormKey] = useState(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pending) return

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
    setPending(true)

    const serviceLabel =
      serviceOptions.find((option) => option.value === formData.serviceType)
        ?.label ?? formData.serviceType

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'hero',
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          serviceType: serviceLabel,
          description: formData.description.trim(),
        }),
      })

      const data = (await response.json().catch(() => null)) as {
        error?: string
      } | null

      if (!response.ok) {
        setErrorMessage(data?.error ?? 'Could not send your request. Please try again.')
        return
      }

      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
      setFormData({ fullName: '', phone: '', serviceType: '', description: '' })
      // Remount so Chrome drops autofill styling on the cleared fields
      setFormKey((k) => k + 1)
    } catch {
      setErrorMessage('Could not send your request. Please try again.')
    } finally {
      setPending(false)
    }
  }

  const fieldClass = 'field-input'

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

      <div className="container-site page-top relative z-10 pb-24 lg:pb-28">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-8">

          {/* LEFT COLUMN */}
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {[
                  { initials: 'DR', color: 'bg-[#1a73e8]' },
                  { initials: 'HM', color: 'bg-[#e37400]' },
                  { initials: 'AC', color: 'bg-[#188038]' },
                  { initials: 'MR', color: 'bg-[#a142f4]' },
                ].map((person) => (
                  <div
                    key={person.initials}
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-white/80 text-[11px] font-semibold tracking-wide text-white ${person.color}`}
                    aria-hidden="true"
                  >
                    {person.initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <HiStar key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-0.5 text-xs text-white/60">4.9/5 Rating</p>
              </div>
            </div>

            <h1 className="heading-display mb-6 text-white">
              Fast, honest HVAC for San Diego homes
            </h1>

            <p className="mb-8 max-w-md text-base leading-relaxed text-white/90">
              AC installs, heating repairs, and tune-ups done right. Call today or request a free
              estimate and we will get back to you quickly.
            </p>

            <div className="mb-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/contact" className="btn-primary shadow-lg hover:shadow-xl">
                Get a Free Estimate
                <HiArrowRight size={16} />
              </Link>
              <Link href="/services" className="btn-secondary">
                View Services
                <HiArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Request Form Card */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="relative z-20 overflow-visible bg-white rounded-2xl p-7 shadow-2xl border border-black/5">
              <h2 className="heading-card mb-1.5 text-center">
                Get a Free Estimate
              </h2>
              <p className="text-ink-muted text-sm text-center mb-6">
                Tell us what you need. We will follow up shortly.
              </p>

              <div className="relative">
                <form
                  key={formKey}
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
                    label="Get a Free Estimate"
                    error={errorMessage}
                    onErrorDismiss={() => setErrorMessage(null)}
                    pending={pending}
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
