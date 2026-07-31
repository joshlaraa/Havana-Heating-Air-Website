import Image from 'next/image'

export default function SanDiegoMapPoster() {
  return (
    <div className="relative h-full min-h-[inherit] w-full overflow-hidden bg-[#F7EAEB]">
      <Image
        src="/images/san-diego-county-map.png"
        alt="Stylized map of San Diego County"
        fill
        className="object-cover object-[center_20%]"
        sizes="(max-width: 1024px) 45vw, 250px"
      />

      {/* Soft fade into the title block */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#F7EAEB] via-[#F7EAEB]/88 to-transparent"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-3 pb-5 pt-10 text-center sm:pb-6 sm:pt-12">
        <p className="font-heading text-[0.7rem] font-bold uppercase leading-tight tracking-[0.38em] text-ink sm:text-sm">
          San Diego
        </p>
        <p className="font-heading mt-0.5 text-[0.7rem] font-bold uppercase leading-tight tracking-[0.38em] text-ink sm:text-sm">
          County
        </p>
        <div className="mt-2.5 h-px w-12 bg-ink/35 sm:mt-3 sm:w-14" aria-hidden="true" />
        <p className="mt-2 text-[0.55rem] font-medium uppercase tracking-[0.28em] text-ink/65 sm:text-[0.65rem]">
          California
        </p>
        <p className="mt-1.5 font-sans text-[0.5rem] tracking-[0.08em] text-ink/45 sm:text-[0.58rem]">
          32.7157° N / 117.1611° W
        </p>
      </div>
    </div>
  )
}
