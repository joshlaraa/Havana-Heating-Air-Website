import FaqSection from '@/components/faq-section'

const aboutFaqs = [
  {
    question: 'Who owns Havana Heating and Air?',
    answer:
      'Osiel Garcia. He owns the company and he is usually the one who answers the phone, walks the job, and does the work.',
  },
  {
    question: 'Are you a licensed HVAC contractor?',
    answer:
      'Yes. We are licensed in California and we stand behind the work we leave in your home.',
  },
  {
    question: 'What does “freshly licensed with field experience” mean?',
    answer:
      'Osiel worked HVAC jobs for years before he opened Havana. The license is newer. The hands on experience is not.',
  },
  {
    question: 'Where do you provide service?',
    answer:
      'Homes across San Diego County and nearby cities. Installs, repairs, and tune ups.',
  },
  {
    question: 'Why the name Havana?',
    answer:
      'It is named after Havana, Cuba. That is where Osiel\'s story starts, and he wanted the company name to carry that with it.',
  },
  {
    question: 'What can I expect when I work with you?',
    answer:
      'We look at the system, tell you what we found in plain language, give you a price, and do the job clean. If something needs a follow up, you know who to call.',
  },
] as const

export default function AboutFaqSection() {
  return (
    <FaqSection
      id="about-faq"
      title="Questions about Havana"
      description="A few straight answers about who we are and how a visit usually goes."
      faqs={aboutFaqs}
      className="bg-white"
    />
  )
}
