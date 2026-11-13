import Link from 'next/link'

const tabs = [
  { id: 'home', href: '/admin', label: 'Home' },
  { id: 'documents', href: '/admin/documents', label: 'Documents' },
  { id: 'estimates', href: '/admin/estimates', label: 'Estimate' },
  { id: 'invoices', href: '/admin/invoices', label: 'Invoice' },
  { id: 'expenses', href: '/admin/expenses', label: 'Expenses' },
  { id: 'mileage', href: '/admin/mileage', label: 'Mileage' },
  { id: 'reports', href: '/admin/reports', label: 'Reports' },
] as const

export type AdminTab = (typeof tabs)[number]['id']

export default function AdminNav({ active }: { active: AdminTab }) {
  return (
    <nav aria-label="Admin" className="mb-6 flex max-w-full gap-1 overflow-x-auto rounded-2xl bg-ink/[0.06] p-1 [scrollbar-width:none] sm:mb-8 sm:inline-flex [&::-webkit-scrollbar]:hidden">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          aria-current={tab.id === active ? 'page' : undefined}
          className={`flex-1 whitespace-nowrap rounded-xl px-4 py-2 text-center text-sm font-medium transition ${tab.id === active ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'}`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
