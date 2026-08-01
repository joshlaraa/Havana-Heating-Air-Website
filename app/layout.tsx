import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Havana Heating and Air | Your Comfort Is Our Passion',
  description:
    'Havana Heating and Air offers HVAC installation, repair, and maintenance for San Diego County homes. Call 909.235.0771 for a free estimate.',
  keywords: 'HVAC, heating, air conditioning, AC repair, furnace installation, Havana Heating and Air',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#c1121f',
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
