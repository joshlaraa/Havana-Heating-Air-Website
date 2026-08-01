import Link from 'next/link'

export default function PagePlaceholder({ title }: { title: string }) {
  return (
    <section className="page-top section-x flex min-h-[50vh] items-center justify-center bg-white pb-24 lg:pb-28">
      <div className="max-w-md text-center">
        <h1 className="heading-section mb-3">{title}</h1>
        <p className="mb-8 text-sm font-medium text-ink-muted">This page is coming soon.</p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </section>
  )
}
