import Link from 'next/link'

export default function PagePlaceholder({ title }: { title: string }) {
  return (
    <section className="min-h-[50vh] flex items-center justify-center px-6 py-24 bg-white">
      <div className="text-center max-w-md">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink mb-3">
          {title}
        </h1>
        <p className="text-ink-muted text-sm font-medium mb-8">
          This page is coming soon.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-ink hover:bg-ink/90 text-white font-light px-7 py-3.5 rounded-full text-sm transition-all duration-200"
        >
          Back to Home
        </Link>
      </div>
    </section>
  )
}
