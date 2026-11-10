import { redirect } from 'next/navigation'
import { isAdminAuthenticated, isAdminConfigured } from '@/lib/admin-auth'
import AdminLoginForm from '@/components/admin-login-form'

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect('/admin/invoices')
  return (
    <main className="page-top container-site min-h-[70vh] pb-24">
      <div className="mx-auto max-w-md rounded-3xl border border-border bg-white p-8 shadow-sm">
        <p className="eyebrow mb-3">Administrator access</p>
        <h1 className="heading-section mb-3 text-3xl">Invoice sign in</h1>
        <p className="body-sm mb-8">Sign in to create professional invoices for your HVAC customers.</p>
        {!isAdminConfigured() && (
          <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            Admin access is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET in the server environment.
          </p>
        )}
        <AdminLoginForm />
      </div>
    </main>
  )
}
