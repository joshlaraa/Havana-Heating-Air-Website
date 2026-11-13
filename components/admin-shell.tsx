import { redirect } from 'next/navigation'
import Link from 'next/link'
import { clearAdminSession, isAdminAuthenticated } from '@/lib/admin-auth'
import AdminNav, { type AdminTab } from '@/components/admin-nav'

const btn = 'inline-flex h-11 items-center justify-center rounded-[14px] bg-ink/[0.07] px-5 text-[15px] font-medium tracking-tight text-ink transition active:scale-[0.98] active:opacity-80'

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login')
}

export default function AdminShell({ active, title, subtitle, wide, children }: { active: AdminTab; title: string; subtitle?: string; wide?: boolean; children: React.ReactNode }) {
  async function logout() {
    'use server'
    await clearAdminSession()
    redirect('/admin/login')
  }
  return (
    <main className="min-h-screen overflow-x-hidden bg-brand-light px-4 py-6 sm:px-8 sm:py-10 lg:px-12">
      <div className={`mx-auto w-full min-w-0 ${wide ? 'max-w-7xl' : 'max-w-4xl'}`}>
        <AdminNav active={active} />
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-3">Administrator workspace</p>
            <h1 className="heading-display">{title}</h1>
            {subtitle && <p className="body-lead mt-4 max-w-2xl">{subtitle}</p>}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
            <Link href="/" className={btn}>Back to home</Link>
            <form action={logout} className="contents"><button className={btn}>Sign out</button></form>
          </div>
        </div>
        {children}
      </div>
    </main>
  )
}
