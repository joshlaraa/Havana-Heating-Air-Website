'use client'

import { useEffect } from 'react'
import { LngLatBounds } from 'maplibre-gl'
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  useMap,
} from '@/components/ui/map'
import { HiStar } from 'react-icons/hi2'
import { FaGoogle, FaYelp, FaInstagram, FaFacebook } from 'react-icons/fa6'
import type { IconType } from 'react-icons'

type ReviewSource = 'Google' | 'Yelp' | 'Instagram' | 'Facebook'

const sourceIcons: Record<ReviewSource, IconType> = {
  Google: FaGoogle,
  Yelp: FaYelp,
  Instagram: FaInstagram,
  Facebook: FaFacebook,
}

/** Past completed job sites across San Diego County */
const jobSites = [
  { id: 1, city: 'Oceanside', lng: -117.3795, lat: 33.1959 },
  { id: 2, city: 'Carlsbad', lng: -117.3506, lat: 33.1581 },
  { id: 3, city: 'Encinitas', lng: -117.292, lat: 33.037 },
  { id: 4, city: 'Escondido', lng: -117.0864, lat: 33.1192 },
  { id: 5, city: 'La Jolla', lng: -117.2713, lat: 32.8328 },
  { id: 6, city: 'Mission Valley', lng: -117.1481, lat: 32.7678 },
  { id: 7, city: 'El Cajon', lng: -116.9625, lat: 32.7948 },
  { id: 8, city: 'La Mesa', lng: -117.0231, lat: 32.7678 },
  { id: 9, city: 'Chula Vista', lng: -117.0842, lat: 32.6401 },
  { id: 10, city: 'Coronado', lng: -117.1831, lat: 32.6859 },
] as const

const testimonials = [
  {
    quote:
      'Our new AC was installed cleanly and quickly. The house stays cool even on the hottest days, and the team explained every step.',
    city: 'Chula Vista',
    author: 'Daniel R.',
    source: 'Google' as const,
  },
  {
    quote:
      'Same-day heating repair when our furnace went out. Honest diagnosis, fair pricing, and the house was warm again by evening.',
    city: 'El Cajon',
    author: 'Heather M.',
    source: 'Yelp' as const,
  },
  {
    quote:
      'Seasonal tune-up made a real difference. Quieter system, lower bills, and no surprise breakdowns this summer.',
    city: 'La Mesa',
    author: 'Andre C.',
    source: 'Google' as const,
  },
]

/** Keep the static map framed on the coastal pin cluster at every breakpoint */
function FitToJobSites() {
  const { map, isLoaded } = useMap()

  useEffect(() => {
    if (!map || !isLoaded) return

    const framePins = () => {
      const bounds = new LngLatBounds()
      for (const site of jobSites) {
        bounds.extend([site.lng, site.lat])
      }

      const isMobile = window.innerWidth < 640
      map.fitBounds(bounds, {
        padding: isMobile
          ? { top: 72, bottom: 72, left: 36, right: 36 }
          : { top: 80, bottom: 80, left: 64, right: 64 },
        maxZoom: isMobile ? 10.1 : 9.6,
        duration: 0,
      })
    }

    framePins()
    map.on('resize', framePins)
    window.addEventListener('resize', framePins)

    return () => {
      map.off('resize', framePins)
      window.removeEventListener('resize', framePins)
    }
  }, [map, isLoaded])

  return null
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="section-y overflow-hidden bg-white">
      <div className="container-site">
        {/* Static San Diego County map — framed on western job sites */}
        <div className="relative mb-6 h-[28rem] overflow-hidden rounded-[1.75rem] bg-brand-light sm:mb-8 sm:h-[34rem] sm:rounded-[2rem] lg:h-[38rem]">
          <Map
            center={[-117.18, 32.92]}
            zoom={9.6}
            theme="light"
            interactive={false}
            attributionControl={false}
            className="h-full w-full rounded-[1.75rem] sm:rounded-[2rem] [&_.maplibregl-canvas]:cursor-default"
            styles={{
              light: 'https://tiles.openfreemap.org/styles/positron',
              dark: 'https://tiles.openfreemap.org/styles/dark',
            }}
            maxBounds={[
              [-117.55, 32.55],
              [-116.85, 33.28],
            ]}
          >
            <FitToJobSites />

            {jobSites.map((site, index) => {
              const durationSec = 2.8 + (index % 5) * 0.45
              const delaySec = (index * 0.55) % 2.6

              return (
                <MapMarker key={site.id} longitude={site.lng} latitude={site.lat}>
                  <MarkerContent>
                    <span className="relative flex size-4 items-center justify-center">
                      <span
                        className="map-marker-ripple absolute inline-flex size-full rounded-full bg-ink/35"
                        style={{
                          animationDuration: `${durationSec}s`,
                          animationDelay: `${delaySec}s`,
                        }}
                      />
                      <span
                        className="map-marker-ripple absolute inline-flex size-full rounded-full bg-ink/20"
                        style={{
                          animationDuration: `${durationSec}s`,
                          animationDelay: `${delaySec + durationSec * 0.45}s`,
                        }}
                      />
                      <span className="relative inline-flex size-4 rounded-full border-2 border-white bg-ink shadow-lg" />
                    </span>
                  </MarkerContent>
                  <MarkerTooltip>{site.city}</MarkerTooltip>
                  <MarkerPopup>
                    <div className="space-y-1">
                      <p className="font-medium text-ink">{site.city}</p>
                      <p className="text-xs text-ink-muted">Job completed</p>
                    </div>
                  </MarkerPopup>
                </MapMarker>
              )
            })}
          </Map>

          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
            <div className="max-w-xl text-center">
              <h2 className="heading-section text-ink">
                Trusted by homeowners
                <span className="mt-1 block font-sans text-base font-normal text-ink-muted sm:text-lg lg:text-xl">
                  across San Diego County
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Reviews bar — footer color */}
        <div className="rounded-[1.75rem] bg-brand-light px-6 py-10 sm:rounded-[2rem] sm:px-8 sm:py-12 lg:px-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8 lg:gap-12">
            {testimonials.map((item) => {
              const SourceIcon = sourceIcons[item.source]

              return (
                <blockquote key={item.city} className="flex flex-col">
                  <div className="mb-4 flex items-center gap-0.5" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <HiStar key={i} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="mb-6 flex-1 text-[15px] leading-relaxed text-ink-secondary">
                    &ldquo;{item.quote}&rdquo;
                  </p>

                  <footer>
                    <cite className="not-italic text-sm font-semibold text-ink">
                      {item.author}
                    </cite>
                    <p className="mt-0.5 text-xs text-ink-muted">{item.city}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-faint">
                      <SourceIcon size={11} aria-hidden="true" />
                      {item.source}
                    </p>
                  </footer>
                </blockquote>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
