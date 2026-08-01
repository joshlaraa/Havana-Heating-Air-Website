import {
  PiHandshake,
  PiHouseLine,
  PiSealCheck,
} from 'react-icons/pi'
import type { IconType } from 'react-icons'

const pillars: {
  title: string
  description: string
  icon: IconType
}[] = [
  {
    title: 'Our Story',
    icon: PiHandshake,
    description:
      'Named after Havana and built on Cuban hospitality, we bring hard work and dependable HVAC care to every home we serve in San Diego County.',
  },
  {
    title: 'Our Mission',
    icon: PiHouseLine,
    description:
      'Keep your family comfortable with honest installs, careful repairs, and service you can trust when summer heat or winter cold hits.',
  },
  {
    title: 'What Sets Us Apart',
    icon: PiSealCheck,
    description:
      'Freshly licensed with real field experience. Owner-operated, clear communication, and workmanship that treats your home with respect.',
  },
]

export default function ValuesSection() {
  return (
    <section id="values" className="section-y bg-brand-light">
      <div className="container-site grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10 lg:gap-16">
        {pillars.map(({ title, description, icon: Icon }) => (
          <div key={title} className="flex flex-col items-start">
            <Icon
              size={40}
              className="text-brand-red"
              aria-hidden="true"
            />
            <h3 className="font-heading mt-5 text-xl font-bold text-ink sm:text-[1.35rem]">
              {title}
            </h3>
            <p className="body-sm mt-3 max-w-sm">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
