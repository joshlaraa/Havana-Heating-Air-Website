import {
  PiArrowsClockwiseFill,
  PiFireFill,
  PiHouseFill,
  PiSnowflakeFill,
  PiWindFill,
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

export type ServiceImage = {
  src: string
  alt: string
  /** Tailwind object-position class; defaults to center via object-cover */
  objectPosition?: string
}

export type Service = {
  id: string
  label: string
  href: string
  /** Prefills the contact form subject select */
  estimateSubject: string
  icon: IconType
  description: string
  /** Home page left / right pair */
  images: readonly [ServiceImage, ServiceImage]
  /** Services card + detail sidebar; defaults to images[0] */
  cardImage?: ServiceImage
  detail: ServiceDetail
}

export const services: readonly Service[] = [
  {
    id: 'air-conditioning',
    label: 'Air Conditioning',
    href: '/services/air-conditioning',
    estimateSubject: 'Air Conditioning',
    icon: PiSnowflakeFill,
    description:
      'Installation, repair, and maintenance for residential AC. Clean work, honest pricing, and cooling that holds up through San Diego summers.',
    images: [
      {
        src: '/images/duo-ac-units.png',
        alt: 'Two outdoor air conditioning condenser units',
      },
      {
        src: '/images/duo-ac-units-repaired.png',
        alt: 'Repaired outdoor air conditioning condenser units',
      },
    ],
    cardImage: {
      src: '/images/duo-ac-units-repaired.png',
      alt: 'Repaired outdoor air conditioning condenser units',
    },
    detail: {
      about: [
        'The right AC for your home depends on more than square footage. We look at your layout, insulation, and how you use the space so the system we install or repair actually fits your house.',
        'From new installs to same-day repairs and seasonal tune-ups, we keep the job site clean and walk you through what we are doing. No surprises when we leave.',
        'Whether you are replacing an old unit, fixing a breakdown, or keeping a solid system maintained, we work for quiet operation, good efficiency, and reliable cooling in San Diego heat.',
      ],
      expectations: [
        {
          title: 'Honest sizing and diagnosis',
          description:
            'We recommend what your home needs. Not a bigger unit than necessary, and not a repair that will not last.',
        },
        {
          title: 'Clean install and service',
          description:
            'We protect your floors and work areas, handle equipment carefully, and leave the job site tidy.',
        },
        {
          title: 'Walkthrough when done',
          description:
            'We show you the thermostat, filters, and basic upkeep so you know how to run the system from day one.',
        },
        {
          title: 'Available after the visit',
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
        'Families dealing with weak cooling or a sudden breakdown',
        'Anyone who wants quieter, more even cooling',
        'Property managers coordinating residential AC work',
      ],
      closing: [
        'Need AC install, repair, or maintenance? Request a free estimate. We will look at your home, lay out your options, and give you a straight answer. No pressure.',
      ],
    },
  },
  {
    id: 'heating',
    label: 'Heating',
    href: '/services/heating',
    estimateSubject: 'Heating',
    icon: PiFireFill,
    description:
      'Heating installation, repair, and maintenance when you need it. We find the problem, explain your options in plain English, and get your heat working right.',
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
        'When the heat goes out or a system needs replacing, you want a straight answer, not a sales pitch. We inspect the system, find what failed or what fits your home, and tell you what it takes so you can decide with confidence.',
        'Ignition problems, airflow issues, thermostat trouble, and full furnace or heat pump installs. We have seen it all and we do the work the right way.',
        'We treat your home with respect, keep you in the loop during the visit, and make sure the heat is working before we go.',
      ],
      expectations: [
        {
          title: 'Clear diagnosis',
          description:
            'We tell you what broke, why it matters, and what the repair or install involves. Up front, before any work starts.',
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
        'Families who need a fast, trustworthy repair or new install',
        'Anyone hearing strange noises or smelling burning dust at startup',
        'Property managers coordinating heating service calls',
      ],
      closing: [
        'Heat not working or ready for a new system? Request a free estimate and we will help you figure out the next step to get your home warm again.',
      ],
    },
  },
  {
    id: 'mini-split-systems',
    label: 'Mini Split Systems',
    href: '/services/mini-split-systems',
    estimateSubject: 'Mini Split Systems',
    icon: PiWindFill,
    description:
      'Ductless mini split installation, repair, and maintenance. Zone cooling and heating for rooms that central HVAC cannot reach well.',
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
        'Mini splits are a smart fit for additions, garages, rooms without ducts, or homes that need different temperatures in different zones. We size and place each head so comfort is even and the outdoor unit stays quiet.',
        'We install new ductless systems, repair existing ones, and keep them maintained so they cool and heat efficiently year-round.',
        'From single-zone setups to multi-head systems, you get clean installs, clear guidance on how to use the remotes or app, and service that stands behind the work.',
      ],
      expectations: [
        {
          title: 'Right-sized zones',
          description:
            'We match capacity and placement to the rooms you actually use, not a one-size guess.',
        },
        {
          title: 'Clean line-set work',
          description:
            'Neat refrigerant lines, proper drainage, and outdoor placement that respects your property.',
        },
        {
          title: 'Install, repair, and maintain',
          description:
            'New systems, leak and sensor repairs, and seasonal checkups so your mini splits stay reliable.',
        },
        {
          title: 'How-to walkthrough',
          description:
            'We show you modes, filters, and basic care so each zone stays comfortable without guesswork.',
        },
      ],
      quote: {
        text: 'They put mini splits in our bonus room and guest suite. Quiet, efficient, and finally cool where the central AC never reached.',
        author: 'Luis G., Encinitas',
      },
      beneficiaries: [
        'Homeowners finishing additions or rooms without ducts',
        'Families who want room-by-room temperature control',
        'Anyone with a failing or noisy ductless system that needs repair',
        'Property managers adding efficient cooling to select units',
      ],
      closing: [
        'Considering mini splits or need service on one you already have? Request a free estimate and we will map out the right install or repair for your space.',
      ],
    },
  },
  {
    id: 'quiet-cool-installation',
    label: 'Quiet Cool Installation',
    href: '/services/quiet-cool-installation',
    estimateSubject: 'Quiet Cool Installation',
    icon: PiArrowsClockwiseFill,
    description:
      'QuietCool whole-house fan installation. Efficient, reliable, and professionally installed to pull cool evening air through your home.',
    images: [
      {
        src: '/images/hero-bg-mobile-2.png',
        alt: 'HVAC technician inspecting attic and duct equipment',
      },
      {
        src: '/images/hero-bg-2.png',
        alt: 'Professional home comfort system service',
      },
    ],
    detail: {
      about: [
        'QuietCool whole-house fans move hot attic air out and pull cooler outdoor air in through open windows. On many San Diego evenings, that means less AC runtime and lower bills without sacrificing comfort.',
        'We handle professional QuietCool installation from attic prep to controls, with an eye on noise, sealing, and how the fan works with your existing HVAC.',
        'Efficient, reliable, and installed the right way so you get the airflow QuietCool is known for without drafts, rattles, or guesswork.',
      ],
      expectations: [
        {
          title: 'Efficient cooling assist',
          description:
            'A properly sized QuietCool fan can cut AC use on mild nights while keeping rooms comfortable.',
        },
        {
          title: 'Reliable install',
          description:
            'Secure mounting, correct ducting or dampering, and controls that are easy to run day to day.',
        },
        {
          title: 'Professional workmanship',
          description:
            'Clean attic access, tidy wiring, and finishes that respect your home and roof space.',
        },
        {
          title: 'Clear operating tips',
          description:
            'We explain when to run the fan, when to stick with AC, and how to get the most from the system.',
        },
      ],
      quote: {
        text: 'QuietCool install was smooth and the house cools down fast in the evenings. Wish we had done it years ago.',
        author: 'Sandra K., Escondido',
      },
      beneficiaries: [
        'Homeowners looking to lower summer cooling costs',
        'Families who want fresher evening air without blasting the AC',
        'Anyone with a stuffy upstairs that heats up after sundown',
        'Homeowners ready for a QuietCool upgrade done professionally',
      ],
      closing: [
        'Ready for QuietCool? Request a free estimate and we will confirm fit for your attic and home, then install it cleanly and professionally.',
      ],
    },
  },
  {
    id: 'service-repairs',
    label: 'Service & Repairs',
    href: '/services/service-repairs',
    estimateSubject: 'Service & Repairs',
    icon: PiWrenchFill,
    description:
      'Service and repairs for all makes and models. We diagnose the issue, explain your options, and fix it without the runaround.',
    images: [
      {
        src: '/images/hero-bg.png',
        alt: 'Technician performing HVAC service and repair',
      },
      {
        src: '/images/about-hvac.png',
        alt: 'Residential HVAC unit being serviced outdoors',
      },
    ],
    detail: {
      about: [
        'When something is not cooling, heating, or running right, you need a clear diagnosis and a fair repair. We service all makes and models and tell you what failed before any work starts.',
        'Strange noises, short cycling, weak airflow, error codes, and systems that will not start. We track down the cause and fix it the right way.',
        'Whether your equipment is brand new or years old, you get owner-operated service, clean work, and a system that works again when we leave.',
      ],
      expectations: [
        {
          title: 'All makes and models',
          description:
            'We work across common residential brands and system types. No runaround if it is not a brand we sell.',
        },
        {
          title: 'Straight diagnosis',
          description:
            'We explain what broke, what it costs to fix, and whether repair or replacement makes more sense.',
        },
        {
          title: 'Careful repairs',
          description:
            'Parts and adjustments that solve the actual problem. No unnecessary upsells.',
        },
        {
          title: 'Verified before we leave',
          description:
            'We run the system and confirm performance so you are not left wondering if it actually works.',
        },
      ],
      quote: {
        text: 'They fixed our system the same week it failed, explained the part that went out, and left everything clean. Highly recommend.',
        author: 'Maria S., Oceanside',
      },
      beneficiaries: [
        'Homeowners with AC or heat that will not start or stay running',
        'Families dealing with uneven comfort or frequent cycling',
        'Anyone with an older system that still deserves a fair repair',
        'Landlords and property managers who need dependable service calls',
      ],
      closing: [
        'System acting up? Request a free estimate and we will walk you through the repair so your home gets back to steady comfort.',
      ],
    },
  },
  {
    id: 'new-installations',
    label: 'New Installations',
    href: '/services/new-installations',
    estimateSubject: 'New Installations',
    icon: PiHouseFill,
    description:
      'High efficiency system installs sized for your home. Clean workmanship, clear options, and equipment built for San Diego comfort.',
    images: [
      {
        src: '/images/indoor-ac.png',
        alt: 'Indoor air conditioning unit ready for installation',
      },
      {
        src: '/images/indoor-ac-repaired.png',
        alt: 'Newly installed indoor air conditioning unit',
        objectPosition: 'object-[center_70%]',
      },
    ],
    cardImage: {
      src: '/images/indoor-ac-repaired.png',
      alt: 'Newly installed indoor air conditioning unit',
      objectPosition: 'object-[center_70%]',
    },
    detail: {
      about: [
        'A new HVAC system is a long-term decision. We size for your home, compare efficiency options that fit your budget, and install with care so the equipment performs the way it should.',
        'From removing the old unit to startup and walkthrough, we keep the job organized and explain what you are getting. No mystery line items.',
        'High efficiency systems that cool and heat evenly, run quieter, and are installed for years of reliable use in San Diego County homes.',
      ],
      expectations: [
        {
          title: 'High efficiency options',
          description:
            'We present equipment that fits your home and goals, with clear talk about efficiency, noise, and cost.',
        },
        {
          title: 'Proper sizing',
          description:
            'Right-sized equipment so you get comfort without short cycling or wasted energy.',
        },
        {
          title: 'Clean replacement',
          description:
            'Careful removal of old equipment, protected floors, and a tidy finish when the new system is in.',
        },
        {
          title: 'Startup and support',
          description:
            'We commission the system, show you the controls, and stay available if questions come up after install.',
        },
      ],
      quote: {
        text: 'New high-efficiency system installed on schedule. Quieter than our old unit, and the team never pushed us into extras.',
        author: 'James T., Carlsbad',
      },
      beneficiaries: [
        'Homeowners replacing aging or failing HVAC equipment',
        'New residents who need a system sized for San Diego summers',
        'Families upgrading to quieter, more efficient comfort',
        'Property managers coordinating residential replacements',
      ],
      closing: [
        'Ready for a new system? Request a free estimate. We will assess your home, compare high efficiency options, and give you a straight install plan.',
      ],
    },
  },
] as const

export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id)
}

export function serviceCardImage(service: Service): ServiceImage {
  return service.cardImage ?? service.images[0]
}

export function serviceEstimateHref(service: Service) {
  const params = new URLSearchParams({
    subject: service.estimateSubject,
    service: service.label,
  })
  return `/contact?${params.toString()}`
}
