import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Havana Heating and Air — Your Comfort Is Our Passion'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const NAVY = '#0a1f3d'
const NAVY_DEEP = '#06152b'
const RED = '#c1121f'
const BLUE = '#1a6fb5'
const WHITE = '#ffffff'

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), 'public/images/havana-logo.png'),
    'base64'
  )
  const logoSrc = `data:image/png;base64,${logoData}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: `linear-gradient(135deg, ${NAVY_DEEP} 0%, ${NAVY} 55%, #0d2749 100%)`,
          overflow: 'hidden',
        }}
      >
        {/* Soft blue glow */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -80,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: BLUE,
            opacity: 0.18,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -160,
            right: -60,
            width: 480,
            height: 480,
            borderRadius: 999,
            background: RED,
            opacity: 0.16,
            display: 'flex',
          }}
        />

        {/* Red accent swoop (business-card inspired) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: 18,
            background: RED,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 18,
            width: '100%',
            height: 6,
            background: BLUE,
            opacity: 0.85,
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '56px 72px 72px',
            position: 'relative',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 420,
              height: 420,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
              border: '2px solid rgba(255,255,255,0.12)',
            }}
          >
            <img
              src={logoSrc}
              width={360}
              height={360}
              alt=""
              style={{ objectFit: 'contain' }}
            />
          </div>

          {/* Copy */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: 560,
              paddingLeft: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 4,
                  background: RED,
                  borderRadius: 2,
                  marginRight: 14,
                  display: 'flex',
                }}
              />
              <div
                style={{
                  fontSize: 22,
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.72)',
                  fontWeight: 600,
                }}
              >
                San Diego County HVAC
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                color: WHITE,
                fontSize: 58,
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: -1,
                marginBottom: 22,
              }}
            >
              <span>Havana Heating</span>
              <span>
                and{' '}
                <span style={{ color: RED }}>Air</span>
              </span>
            </div>

            <div
              style={{
                fontSize: 28,
                color: 'rgba(255,255,255,0.82)',
                fontWeight: 500,
                lineHeight: 1.35,
                marginBottom: 36,
              }}
            >
              Your Comfort Is Our Passion
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: RED,
                  color: WHITE,
                  fontSize: 22,
                  fontWeight: 700,
                  padding: '14px 26px',
                  borderRadius: 999,
                }}
              >
                909.235.0771
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500,
                }}
              >
                Escondido, CA
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
