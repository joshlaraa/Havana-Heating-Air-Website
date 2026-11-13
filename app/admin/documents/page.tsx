import { redirect } from 'next/navigation'
import Link from 'next/link'
import { clearAdminSession, isAdminAuthenticated } from '@/lib/admin-auth'
import { isSupabaseConfigured } from '@/lib/supabase'
import { listDocuments } from '@/lib/documents'
import AdminNav from '@/components/admin-nav'
import DocumentList, { type DocItem } from '@/components/document-list'

export const dynamic = 'force-dynamic'

export default async function AdminDocumentsPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login')
  async function logout() {
    'use server'
    await clearAdminSession()
    redirect('/admin/login')
  }
  let items: DocItem[] = []
  let error = ''
  if (!isSupabaseConfigured()) error = 'Database is not configured.'
  else {
    try {
      const rows = await listDocuments()
      const converted = new Set(rows.map((r) => r.converted_from).filter(Boolean))
      items = rows.map((r) => ({
        id: r.id, type: r.type, number: r.number, customer: r.customer_name, total: Number(r.total), status: r.status,
        issue: r.issue_date, due: r.due_date, converted: converted.has(r.id),
      }))
    } catch {
      error = 'Could not load documents. Make sure supabase/schema.sql has been run.'
    }
  }
  const btn = 'inline-flex h-11 items-center justify-center rounded-[14px] bg-ink/[0.07] px-5 text-[15px] font-medium tracking-tight text-ink transition active:scale-[0.98] active:opacity-80'
  return (
    <main className="min-h-screen overflow-x-hidden bg-brand-light px-4 py-6 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto w-full min-w-0 max-w-4xl">
        <AdminNav active="documents" />
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-3">Administrator workspace</p>
            <h1 className="heading-display">Documents</h1>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
            <Link href="/" className={btn}>Back to home</Link>
            <form action={logout} className="contents"><button className={btn}>Sign out</button></form>
          </div>
        </div>
        {error ? <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p> : <DocumentList items={items} />}
      </div>
    </main>
  )
}
