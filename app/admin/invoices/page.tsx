import { redirect } from 'next/navigation'
import Link from 'next/link'
import { business, invoiceServices } from '@/lib/business'
import { clearAdminSession, isAdminAuthenticated } from '@/lib/admin-auth'
import InvoiceForm from '@/components/invoice-form'

export default async function AdminInvoicesPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login')
  async function logout() {
    'use server'
    await clearAdminSession()
    redirect('/admin/login')
  }
  return (
    <main className="min-h-screen bg-brand-light px-4 py-6 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-10 sm:gap-5 sm:flex-row sm:items-end">
        <div><p className="eyebrow mb-3">Administrator workspace</p><h1 className="heading-display">Create an invoice</h1><p className="body-lead mt-4 max-w-2xl">Generate a professional PDF using {business.name} branding and the configured HVAC service catalog.</p></div>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn-submit w-auto">Back to home</Link>
          <form action={logout}><button className="btn-submit w-auto">Sign out</button></form>
        </div>
      </div>
      <InvoiceForm services={invoiceServices} />
      </div>
    </main>
  )
}
