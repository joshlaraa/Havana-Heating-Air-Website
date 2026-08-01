import FaqSection from '@/components/faq-section'

const serviceFaqs = [
  {
    question: 'How much does HVAC service cost?',
    answer:
      'It depends on your system and the work needed. We give clear estimates before we start, so there are no surprise fees and no push for extras you do not need.',
  },
  {
    question: 'Do you offer free estimates?',
    answer:
      'Yes. Use the form above or call us. We will review what you need and send a free estimate so you know the plan before any work begins.',
  },
  {
    question: 'What services do you offer?',
    answer:
      'AC installation and repair, heating and furnace repair, seasonal maintenance and tune-ups, and indoor air quality help for homes across San Diego County.',
  },
  {
    question: 'How quickly can you come out?',
    answer:
      'We move fast on repairs and emergency calls. Tell us your availability when you reach out, and we will get a tech scheduled as soon as we can.',
  },
  {
    question: 'Do you charge a diagnostic fee?',
    answer:
      'We tell you about any service call or diagnostic fee before we arrive. If you approve the repair, we explain how that fee fits into your total. No fine print later.',
  },
  {
    question: 'Are maintenance plans or tune-ups worth it?',
    answer:
      'A seasonal tune-up catches small issues early, keeps your system running better, and can help it last longer. Ask us what makes sense for your setup.',
  },
] as const

export default function ContactFaqSection() {
  return (
    <FaqSection
      id="service-faq"
      title="Service and pricing questions"
      description="Straight answers on estimates, timing, and what our HVAC work usually involves."
      faqs={serviceFaqs}
      className="bg-white"
    />
  )
}
