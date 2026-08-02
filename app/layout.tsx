import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import './globals.css'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://havana-heating-air-website.vercel.app')

const title = 'Havana Heating and Air | Your Comfort Is Our Passion'
const description =
  'Havana Heating and Air offers HVAC installation, repair, and maintenance for San Diego County homes. Call 909.235.0771 for a free estimate.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords:
    'HVAC, heating, air conditioning, AC repair, furnace installation, Havana Heating and Air, Escondido',
  applicationName: 'Havana Heating and Air',
  authors: [{ name: 'Havana Heating and Air' }],
  creator: 'Havana Heating and Air',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Havana Heating and Air',
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  appleWebApp: {
    title: 'Havana Heating and Air',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0a1f3d',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-white">
      <body className="font-sans antialiased">
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
