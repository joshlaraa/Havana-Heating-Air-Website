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
    <main className="min-h-screen overflow-x-hidden bg-brand-light px-4 py-6 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-10 sm:gap-5 sm:flex-row sm:items-end">
        <div><p className="eyebrow mb-3">Administrator workspace</p><h1 className="heading-display">Create an invoice</h1><p className="body-lead mt-4 max-w-2xl">Generate a professional PDF using {business.name} branding and the configured HVAC service catalog.</p></div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
          <Link href="/" className="inline-flex h-11 items-center justify-center rounded-[14px] bg-ink/[0.07] px-5 text-[15px] font-medium tracking-tight text-ink transition active:scale-[0.98] active:opacity-80">Back to home</Link>
          <form action={logout} className="contents"><button className="inline-flex h-11 items-center justify-center rounded-[14px] bg-ink/[0.07] px-5 text-[15px] font-medium tracking-tight text-ink transition active:scale-[0.98] active:opacity-80">Sign out</button></form>
        </div>
      </div>
      <InvoiceForm services={invoiceServices} />
      </div>
    </main>
  )
}
