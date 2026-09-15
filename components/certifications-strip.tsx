import Image from 'next/image'
import { cn } from '@/lib/utils'

const certifications = [
  {
    id: 'epa-608',
    label: 'EPA 608',
    src: '/images/certs/epa-608.png',
  },
  {
    id: 'osha-10',
    label: 'OSHA 10',
    src: '/images/certs/osha-10.png',
  },
  {
    id: 'nate',
    label: 'NATE',
    src: '/images/certs/nate.png',
  },
] as const

type CertificationsStripProps = {
  /** `onDark` for hero overlays; `onLight` for light page sections. */
  tone?: 'onDark' | 'onLight'
  /** `band` = full-width equal spread; `inline` = compact row. */
  variant?: 'band' | 'inline'
  className?: string
  showCaption?: boolean
}

export default function CertificationsStrip({
  tone = 'onLight',
  variant = 'inline',
  className,
  showCaption = true,
}: CertificationsStripProps) {
  const onDark = tone === 'onDark'
  const isBand = variant === 'band'

  if (isBand) {
    return (
      <div
        className={cn(
          'relative w-full',
          !onDark && 'border-y border-border bg-brand-light',
          className
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col px-0 sm:px-6 lg:px-8">
          {showCaption && (
            <p
              className={cn(
                'px-4 pt-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em]',
                onDark ? 'text-white/75' : 'text-ink-muted'
              )}
            >
              Certified technicians
            </p>
          )}

          <ul
            className={cn(
              'grid w-full grid-cols-3',
              showCaption ? 'pt-1.5 pb-2.5' : 'py-2.5'
            )}
            aria-label="Certifications: EPA 608, OSHA 10, and NATE"
          >
            {certifications.map(({ id, label, src }, index) => (
              <li
                key={id}
                className={cn(
                  'relative flex items-center justify-center',
                  index > 0 &&
                    (onDark
                      ? 'before:absolute before:left-0 before:top-1/2 before:h-8 before:w-px before:-translate-y-1/2 before:bg-white/45'
                      : 'before:absolute before:left-0 before:top-1/2 before:h-8 before:w-px before:-translate-y-1/2 before:bg-border')
                )}
              >
                <div
                  className="group flex w-full flex-col items-center gap-1 px-1 transition duration-200 hover:-translate-y-0.5 sm:px-3"
                  title={label}
                >
                  <span
                    className={cn(
                      'relative flex size-12 items-center justify-center overflow-hidden rounded-full sm:size-14',
                      onDark && 'bg-white/95 shadow-sm ring-1 ring-white/20'
                    )}
                  >
                    <Image
                      src={src}
                      alt={`${label} certification`}
                      width={56}
                      height={56}
                      className="size-[86%] object-contain transition duration-200 group-hover:scale-105"
                    />
                  </span>
                  <span
                    className={cn(
                      'font-heading text-[9px] font-bold tracking-[0.12em] uppercase sm:text-[10px]',
                      onDark
                        ? 'text-white/85 group-hover:text-white'
                        : 'text-ink-muted group-hover:text-brand-red'
                    )}
                  >
                    {label}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {showCaption && (
        <p
          className={cn(
            'mb-3 text-xs font-medium tracking-wide',
            onDark ? 'text-white/55' : 'text-ink-muted'
          )}
        >
          Certified technicians
        </p>
      )}
      <ul
        className="flex flex-wrap items-center gap-3 sm:gap-4"
        aria-label="Certifications: EPA 608, OSHA 10, and NATE"
      >
        {certifications.map(({ id, label, src }) => (
          <li key={id}>
            <div
              className={cn(
                'group flex flex-col items-center gap-1.5 transition duration-200',
                'hover:-translate-y-0.5'
              )}
              title={label}
            >
              <span
                className={cn(
                  'relative flex size-14 items-center justify-center overflow-hidden rounded-full sm:size-16',
                  onDark && 'bg-white/95 shadow-sm ring-1 ring-white/20'
                )}
              >
                <Image
                  src={src}
                  alt={`${label} certification`}
                  width={64}
                  height={64}
                  className="size-[85%] object-contain transition duration-200 group-hover:scale-105"
                />
              </span>
              <span
                className={cn(
                  'font-heading text-[11px] font-bold tracking-[0.14em] uppercase transition-colors duration-200',
                  onDark
                    ? 'text-white/70 group-hover:text-white'
                    : 'text-ink-muted group-hover:text-brand-red'
                )}
              >
                {label}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
