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
      'Named after Havana and rooted in Cuban hospitality, we built this company to bring hard work, warmth, and dependable HVAC care to every home we serve across San Diego County.',
  },
  {
    title: 'Our Mission',
    icon: PiHouseLine,
    description:
      'Deliver honest, lasting comfort — from precise installs to careful repairs — so your family stays cool in summer, warm in winter, and confident year-round.',
  },
  {
    title: 'What Sets Us Apart',
    icon: PiSealCheck,
    description:
      'Freshly licensed with real field experience. Owner-operated accountability, clear communication, and workmanship that treats your home with respect.',
  },
]

export default function ValuesSection() {
  return (
    <section id="values" className="section-y border-t border-border bg-white">
      <div className="container-site grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-10 lg:gap-16">
        {pillars.map(({ title, description, icon: Icon }) => (
          <div key={title} className="group flex flex-col items-start">
            <Icon
              size={40}
              className="text-ink transition-colors duration-300 group-hover:text-brand-red"
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
