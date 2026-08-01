import {
  PiFanFill,
  PiFlameFill,
  PiSnowflakeFill,
  PiSparkleFill,
  PiWrenchFill,
} from 'react-icons/pi'
import type { IconType } from 'react-icons'

export type ServiceExpectation = {
  title: string
  description: string
}

export type ServiceDetail = {
  about: readonly string[]
  expectations: readonly ServiceExpectation[]
  quote: { text: string; author: string }
  beneficiaries: readonly string[]
  closing: readonly string[]
}

export type Service = {
  id: string
  label: string
  href: string
  /** Prefills the contact form subject select */
  estimateSubject: string
  icon: IconType
  description: string
  images: readonly [{ src: string; alt: string }, { src: string; alt: string }]
  detail: ServiceDetail
}

export const services: readonly Service[] = [
  {
    id: 'ac-installation',
    label: 'AC Installation',
    href: '/services/ac-installation',
    estimateSubject: 'New Installation',
    icon: PiSnowflakeFill,
    description:
      'New AC systems sized for your home. Clean installs, honest pricing, and equipment that holds up through San Diego summers.',
    images: [
      {
        src: '/images/ac-installation.png',
        alt: 'Technician installing a residential air conditioning unit',
      },
      {
        src: '/images/ac-installation-2.png',
        alt: 'HVAC professional working on ceiling AC equipment',
      },
    ],
    detail: {
      about: [
        'The right AC for your home depends on more than square footage. We look at your layout, insulation, and how you use the space so the system we install actually fits your house.',
        'From picking the equipment to startup, we keep the job site clean and walk you through what we are doing. No surprises when we leave.',
        'Whether you are replacing an old unit or adding AC for the first time, we install for quiet operation, good efficiency, and years of reliable cooling in San Diego heat.',
      ],
      expectations: [
        {
          title: 'Honest sizing',
          description:
            'We recommend what your home needs. Not a bigger unit than necessary, and not one that will struggle on hot days.',
        },
        {
          title: 'Clean install',
          description:
            'We protect your floors and work areas, handle equipment carefully, and leave the job site tidy.',
        },
        {
          title: 'Walkthrough when done',
          description:
            'We show you the thermostat, filters, and basic upkeep so you know how to run the system from day one.',
        },
        {
          title: 'Available after install',
          description:
            'Questions after we leave? Call us. We stand behind the work we do in your home.',
        },
      ],
      quote: {
        text: 'Our new AC was installed cleanly and quickly. The house stays cool even on the hottest days, and the team explained every step.',
        author: 'Daniel R., Chula Vista',
      },
      beneficiaries: [
        'Homeowners replacing an old or unreliable AC',
        'New residents who need cooling sized for San Diego summers',
        'Families who want quieter, more even cooling',
        'Property managers coordinating residential installs',
      ],
      closing: [
        'Thinking about a new AC? Request a free estimate. We will look at your home, lay out your options, and give you a straight answer. No pressure.',
      ],
    },
  },
  {
    id: 'heating-repair',
    label: 'Heating Repair',
    href: '/services/heating-repair',
    estimateSubject: 'Heating Repair',
    icon: PiFlameFill,
    description:
      'Heating repair when you need it. We find the problem, explain your options in plain English, and get your heat back on without the runaround.',
    images: [
      {
        src: '/images/hero-bg-2.png',
        alt: 'Technician servicing heating and cooling equipment',
      },
      {
        src: '/images/hero-bg-mobile.png',
        alt: 'Close-up of HVAC service work in progress',
      },
    ],
    detail: {
      about: [
        'When the heat goes out, you want a straight answer, not a sales pitch. We inspect the system, find what failed, and tell you what it takes to fix it so you can decide with confidence.',
        'Ignition problems, airflow issues, thermostat trouble, safety concerns. We have seen it all and we fix it the right way.',
        'We treat your home with respect, keep you in the loop during the visit, and make sure the heat is working before we go.',
      ],
      expectations: [
        {
          title: 'Clear diagnosis',
          description:
            'We tell you what broke, why it matters, and what the repair involves. Up front, before any work starts.',
        },
        {
          title: 'Fair options',
          description:
            'If a repair makes sense, we do it. If replacement is the smarter move, we will tell you that too.',
        },
        {
          title: 'Careful work',
          description:
            'We work clean, watch safety, and keep the service area tidy while we are in your home.',
        },
        {
          title: 'Heat verified before we leave',
          description:
            'We confirm the system is heating properly and we are here if anything comes up after the visit.',
        },
      ],
      quote: {
        text: 'Same-day heating repair when our furnace went out. Honest diagnosis, fair pricing, and the house was warm again by evening.',
        author: 'Heather M., El Cajon',
      },
      beneficiaries: [
        'Homeowners with no heat or cold spots in the house',
        'Families who need a fast, trustworthy repair',
        'Anyone hearing strange noises or smelling burning dust at startup',
        'Property managers coordinating heating service calls',
      ],
      closing: [
        'Heat not working or acting up? Request a free estimate and we will help you figure out the next step to get your home warm again.',
      ],
    },
  },
  {
    id: 'ac-maintenance',
    label: 'AC Maintenance',
    href: '/services/ac-maintenance',
    estimateSubject: 'Maintenance / Tune-Up',
    icon: PiWrenchFill,
    description:
      'Seasonal tune-ups to keep your AC running quiet and cool. We catch small problems before they turn into expensive breakdowns.',
    images: [
      {
        src: '/images/hero-bg.png',
        alt: 'Technician performing air conditioning maintenance',
      },
      {
        src: '/images/about-hvac.png',
        alt: 'Residential HVAC unit being serviced outdoors',
      },
    ],
    detail: {
      about: [
        'A tune-up once or twice a year is the easiest way to avoid a breakdown in the middle of summer. We clean, check, and adjust the system so it runs cooler and uses less energy.',
        'This is more than swapping a filter. We inspect the parts that wear out, check airflow, and make sure everything is ready before the hot months hit.',
        'Whether you stay on schedule every year or it has been a while, our maintenance visits are thorough and we explain what we find in plain terms.',
      ],
      expectations: [
        {
          title: 'Full system check',
          description:
            'We review performance, airflow, electrical connections, and safety. Not just a quick look and a filter change.',
        },
        {
          title: 'Efficiency tune-up',
          description:
            'Cleaning and adjustments that help your AC cool better without running up your electric bill.',
        },
        {
          title: 'Catch problems early',
          description:
            'We flag worn parts and small issues before they leave you without AC on the hottest day of the year.',
        },
        {
          title: 'Simple tips for between visits',
          description:
            'Filter schedule and a few habits that keep your system running smooth between tune-ups.',
        },
      ],
      quote: {
        text: 'Seasonal tune-up made a real difference. Quieter system, lower bills, and no surprise breakdowns this summer.',
        author: 'Andre C., La Mesa',
      },
      beneficiaries: [
        'Homeowners getting ready for San Diego summer heat',
        'Families who want fewer emergency repair calls',
        'Anyone noticing weak airflow or a higher electric bill',
        'Property managers scheduling regular maintenance',
      ],
      closing: [
        'Want to stay ahead of breakdowns? Request a free estimate for AC maintenance and we will help you get on a tune-up schedule that fits your system.',
      ],
    },
  },
  {
    id: 'furnace-repair',
    label: 'Furnace Repair',
    href: '/services/furnace-repair',
    estimateSubject: 'Heating Repair',
    icon: PiFanFill,
    description:
      'Furnace repair to get your heat back on safely. Ignition issues, airflow problems, and everything in between. We fix it and we explain what we did.',
    images: [
      {
        src: '/images/hero-bg-mobile-2.png',
        alt: 'HVAC technician inspecting furnace and duct equipment',
      },
      {
        src: '/images/hero-bg-2.png',
        alt: 'Professional heating system service',
      },
    ],
    detail: {
      about: [
        'Furnace trouble shows up in different ways. Cold rooms, short cycling, weird noises, or a burner that will not stay lit. We track down the cause, tell you what we found, and fix it with safety first.',
        'We handle ignition, sensors, airflow, and control issues every week. If a repair is the right call, we do it. If something bigger is going on, we will say so.',
        'You get owner-operated service, clean work, and a furnace that heats your home reliably again.',
      ],
      expectations: [
        {
          title: 'Safety first',
          description:
            'We check for safe operation and tell you plainly if something needs attention.',
        },
        {
          title: 'Targeted repairs',
          description:
            'We fix the actual problem. Ignition, airflow, controls. No unnecessary parts or upsells.',
        },
        {
          title: 'Respect for your home',
          description:
            'Clean work habits and careful access around your living spaces and utility areas.',
        },
        {
          title: 'Verified before we leave',
          description:
            'We run the furnace and confirm heat output so you are not left wondering if it actually works.',
        },
      ],
      quote: {
        text: 'They fixed our furnace the same week it failed, explained the part that went out, and left everything clean. Highly recommend.',
        author: 'Maria S., Oceanside',
      },
      beneficiaries: [
        'Homeowners with a furnace that will not start or stay running',
        'Families dealing with uneven heat or the system turning on and off too often',
        'Anyone worried about furnace safety or unusual smells',
        'Landlords and property managers who need dependable furnace service',
      ],
      closing: [
        'Furnace giving you trouble? Request a free estimate and we will walk you through the repair so your home gets back to steady heat.',
      ],
    },
  },
  {
    id: 'indoor-air-quality',
    label: 'Indoor Air Quality',
    href: '/services/indoor-air-quality',
    estimateSubject: 'General Inquiry',
    icon: PiSparkleFill,
    description:
      'Better air at home with filtration upgrades, duct work, and humidity control. Less dust, fewer allergens, and air that actually feels fresh.',
    images: [
      {
        src: '/images/about-hvac.png',
        alt: 'Home comfort system supporting cleaner indoor air',
      },
      {
        src: '/images/hero-bg-mobile.png',
        alt: 'Technician improving indoor air quality systems',
      },
    ],
    detail: {
      about: [
        'Dusty rooms, allergies acting up, stale air, humidity that swings too high or too low. Your HVAC system plays a big role in all of it, and we can help you improve what you breathe at home.',
        'We will not sell you gadgets you do not need. We look at your system, listen to what is bothering you, and recommend what will actually make a difference for your household.',
        'Cleaner air, more comfortable rooms, and solutions that work with the equipment you already have. That is the goal.',
      ],
      expectations: [
        {
          title: 'Honest recommendations',
          description:
            'Solutions matched to your home and system. Not a sales catalog of add-ons you do not need.',
        },
        {
          title: 'Filtration and airflow',
          description:
            'Upgrades and adjustments that cut down on dust, allergens, and stuffy rooms.',
        },
        {
          title: 'Humidity guidance',
          description:
            'When moisture control will make your home more comfortable, we will tell you and explain your options.',
        },
        {
          title: 'Clear priorities',
          description:
            'You leave knowing what will help most right now and what can wait.',
        },
      ],
      quote: {
        text: 'Less dust, fresher air, and they never pushed us into extras we did not need. Exactly the kind of help we wanted.',
        author: 'Priya N., Carlsbad',
      },
      beneficiaries: [
        'Households dealing with dust, allergens, or stuffy rooms',
        'Families with kids or guests who are sensitive to indoor air',
        'Homeowners upgrading filtration on an existing HVAC system',
        'Anyone who wants straight advice before buying air quality products',
      ],
      closing: [
        'Want cleaner air at home? Request a free estimate and we will recommend practical improvements that fit your space and budget.',
      ],
    },
  },
] as const

export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id)
}

export function serviceEstimateHref(service: Service) {
  const params = new URLSearchParams({
    subject: service.estimateSubject,
    service: service.label,
  })
  return `/contact?${params.toString()}`
}
