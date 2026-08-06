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
      'Osiel came from Cuba and built this business in California. The name Havana is a nod to where he started, and to showing up for people the same way family would.',
  },
  {
    title: 'Our Mission',
    icon: PiHouseLine,
    description:
      'Fix what is broken, install what fits your house, and leave you with a system that works when San Diego weather gets rough.',
  },
  {
    title: 'What Sets Us Apart',
    icon: PiSealCheck,
    description:
      'Years in the field before the license on the wall. You deal with the owner, get plain answers, and know who is accountable if something needs follow up.',
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
