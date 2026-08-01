'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  FaFacebookF,
  FaYelp,
  FaGoogle,
  FaInstagram,
  FaPhone,
  FaLocationDot,
  FaEnvelope,
} from 'react-icons/fa6'
import { HiCheckCircle } from 'react-icons/hi2'
import AnimatedSelect from '@/components/ui/animated-select'
import FormSubmitSlot from '@/components/ui/form-submit-slot'
import { services } from '@/lib/services'
import { cn } from '@/lib/utils'

const socials = [
  { label: 'Yelp', href: '#', icon: FaYelp },
  { label: 'Google Reviews', href: '#', icon: FaGoogle },
  { label: 'Instagram', href: '#', icon: FaInstagram },
  { label: 'Facebook', href: '#', icon: FaFacebookF },
]

const subjectOptions = [
  { value: 'AC Repair', label: 'AC Repair' },
  { value: 'Heating Repair', label: 'Heating Repair' },
  { value: 'New Installation', label: 'New Installation' },
  { value: 'Maintenance / Tune-Up', label: 'Maintenance / Tune-Up' },
  { value: 'Emergency Service', label: 'Emergency Service' },
  { value: 'General Inquiry', label: 'General Inquiry' },
  { value: 'Other', label: 'Other' },
]

const subjectValues = new Set(subjectOptions.map((option) => option.value))
const serviceLabels = new Set(services.map((service) => service.label))

const fieldClass = 'field-input'

export default function ContactSection() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    company: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    const subjectParam = searchParams.get('subject') ?? ''
    const serviceParam = searchParams.get('service') ?? ''
    const nextSubject = subjectValues.has(subjectParam) ? subjectParam : ''
    const nextService =
      serviceLabels.has(serviceParam) && serviceParam.length <= 80
        ? serviceParam
        : ''
    const nextMessage = nextService
      ? `I'm interested in a free estimate for ${nextService}.`
      : ''

    if (!nextSubject && !nextMessage) return

    setFormData((prev) => ({
      ...prev,
      subject: nextSubject || prev.subject,
      message: nextMessage || prev.message,
    }))
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pending) return

    const missing: string[] = []
    if (!formData.firstName.trim()) missing.push('first name')
    if (!formData.lastName.trim()) missing.push('last name')
    if (!formData.email.trim()) missing.push('email')
    if (!formData.phone.trim()) missing.push('phone number')
    if (!formData.subject) missing.push('subject')
    if (!formData.message.trim()) missing.push('message')

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

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'contact',
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
          company: formData.company,
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
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        company: '',
      })
      // Remount so Chrome drops autofill styling on the cleared fields
      setFormKey((k) => k + 1)
    } catch {
      setErrorMessage('Could not send your request. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="page-top bg-white pb-20 lg:pb-28">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:overflow-visible">
        {/* Left: contact info */}
        <div className="flex flex-col rounded-t-3xl bg-ink px-8 py-10 text-white sm:px-10 sm:py-12 lg:rounded-l-3xl lg:rounded-tr-none lg:px-12 lg:py-14">
          <h1 className="heading-section mb-4 text-white">
            Contact us
          </h1>

          <p className="mb-8 max-w-sm text-sm leading-relaxed text-white/70">
            Need a repair, install, or tune-up? Send a message or call. We will get back to you with
            a clear plan and a free estimate.
          </p>

          <div className="mb-12 flex items-center gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/50 hover:bg-white/10"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>

          <div className="mt-auto border-t border-white/15 pt-8">
            <h2 className="heading-card mb-6 text-white">More contact details</h2>

            <div className="grid gap-8 sm:grid-cols-2 sm:gap-0">
              <div className="sm:pr-8">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <FaEnvelope size={14} className="text-white" />
                </div>
                <p className="font-heading mb-2 text-base font-bold text-white">Contact us</p>
                <a
                  href="mailto:havanaheatingandair@gmail.com"
                  className="block text-sm text-white/70 transition-colors hover:text-white"
                >
                  havanaheatingandair@gmail.com
                </a>
                <a
                  href="tel:9092350771"
                  className="mt-1.5 flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                >
                  <FaPhone size={11} className="shrink-0" />
                  909.235.0771
                </a>
              </div>

              <div className="border-t border-white/15 pt-8 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <FaLocationDot size={14} className="text-white" />
                </div>
                <p className="font-heading mb-2 text-base font-bold text-white">Our location</p>
                <p className="text-sm leading-relaxed text-white/70">
                  Serving San Diego County
                  <br />
                  &amp; Surrounding Areas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="relative z-10 overflow-visible rounded-b-3xl bg-brand-light px-8 py-10 sm:px-10 sm:py-12 lg:rounded-r-3xl lg:rounded-bl-none lg:px-12 lg:py-14">
          <div className="relative">
            <form
              key={formKey}
              onSubmit={handleSubmit}
              noValidate
              className={cn(
                'flex flex-col gap-8 transition-opacity duration-200 ease-out',
                submitted ? 'pointer-events-none opacity-0' : 'opacity-100'
              )}
              aria-hidden={submitted}
            >
              <div>
                <h2 className="heading-card">Personal information</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Tell us who you are so we can follow up.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={fieldClass}
                    autoComplete="given-name"
                    maxLength={80}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={fieldClass}
                    autoComplete="family-name"
                    maxLength={80}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={fieldClass}
                    autoComplete="email"
                    maxLength={120}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={fieldClass}
                    autoComplete="tel"
                    maxLength={30}
                  />
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div>
                <h2 className="heading-card">Subject</h2>
                <p className="mt-1 text-sm text-ink-muted">What can we help you with?</p>
                <AnimatedSelect
                  className="mt-5"
                  options={subjectOptions}
                  value={formData.subject}
                  onChange={(subject) => setFormData({ ...formData, subject })}
                  placeholder="Service Type"
                  aria-label="Subject"
                />
              </div>

              <div>
                <h2 className="heading-card">Message</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Share a few details about your home or issue.
                </p>
                <textarea
                  placeholder="Short Description"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${fieldClass} mt-5 resize-none`}
                  maxLength={2000}
                />
              </div>

              <FormSubmitSlot
                label="Request Free Estimate"
                error={errorMessage}
                onErrorDismiss={() => setErrorMessage(null)}
                pending={pending}
                className={submitted ? '[&_*]:transition-none' : undefined}
              />
            </form>

            <div
              aria-live="polite"
              aria-hidden={!submitted}
              className={cn(
                'absolute inset-0 flex flex-col items-center justify-center bg-brand-light text-center transition-opacity duration-200 ease-out',
                submitted
                  ? 'pointer-events-auto opacity-100'
                  : 'pointer-events-none opacity-0'
              )}
            >
              <HiCheckCircle size={48} className="mb-3 text-emerald-500" />
              <p className="text-base font-semibold text-ink">Message Sent!</p>
              <p className="mt-1 text-sm text-ink-muted">
                We&apos;ll get back to you shortly.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
