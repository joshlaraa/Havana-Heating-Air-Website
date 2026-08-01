import FaqSection from '@/components/faq-section'

const aboutFaqs = [
  {
    question: 'Who owns Havana Heating and Air?',
    answer:
      'Osiel owns and runs Havana Heating and Air. He is Cuban-owned and operated, and he shows up for every job with honest work and clear communication.',
  },
  {
    question: 'Are you a licensed HVAC contractor?',
    answer:
      'Yes. We are freshly licensed and we stand behind every job. You get real accountability from the owner, not a runaround from a call center.',
  },
  {
    question: 'What does “freshly licensed with field experience” mean?',
    answer:
      'Osiel spent years working HVAC in the field before opening Havana. Now he runs his own licensed company, so you get hands-on skill and owner-level care on every visit.',
  },
  {
    question: 'Where do you provide service?',
    answer:
      'We serve homes across San Diego County and nearby areas. That includes installs, repairs, and seasonal maintenance.',
  },
  {
    question: 'Why the name Havana?',
    answer:
      'The company is named after Havana, Cuba. It reflects the hospitality and hard work Osiel brings into every home. We keep your place cool when it is hot outside, and comfortable year-round.',
  },
  {
    question: 'What can I expect when I work with you?',
    answer:
      'A straight diagnosis, fair pricing, clean work, and follow-through. We explain your options clearly so you can decide with confidence. No pressure and no runaround.',
  },
] as const

export default function AboutFaqSection() {
  return (
    <FaqSection
      id="about-faq"
      title="Questions about Havana"
      description="Quick answers about who we are, how we work, and what to expect when you call."
      faqs={aboutFaqs}
      className="bg-white"
    />
  )
}
