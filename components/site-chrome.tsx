'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FinancingToast from '@/components/financing-toast'

export default function SiteChrome() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <Navbar />
      <FinancingToast />
      <Footer />
    </>
  )
}
