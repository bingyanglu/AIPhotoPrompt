import Link from 'next/link'
import EmailSubscribe from './EmailSubscribe'

export default function HeroSection() {
  return (
    <section className="border-b-2 border-gray-900 bg-white py-24">
      <div className="container-custom flex flex-col gap-16 lg:flex-row lg:items-center">
        <div className="max-w-2xl space-y-6">
          <span className="inline-flex items-center rounded-full border-2 border-gray-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-gray-600">
            Gemini AI Photo Prompts
          </span>
          <h1 className="font-display text-5xl leading-tight text-gray-900 sm:text-6xl">
            Gemini AI Photo Prompts – Copy &amp; Paste Ready
          </h1>
          <p className="text-lg text-gray-600 sm:text-xl">
            Discover trending, ready-to-use Gemini AI prompts for photos. Browse by style, function, or trend to generate stunning images instantly.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/prompts"
              className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-gray-900 bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
            >
              Explore prompts
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/#trending-prompts"
              className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
            >
              Latest trends
            </Link>
          </div>

          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Copy &amp; paste prompts • Weekly updates • Curated by photographers
          </p>
        </div>

        <div className="flex-1 max-w-xl">
          <div className="rounded-3xl border-2 border-gray-900 bg-white p-6 shadow-lg">
            <div className="aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              <div className="flex h-full w-full items-end justify-between p-6 text-gray-800">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Gemini Output</p>
                  <h2 className="mt-2 font-display text-2xl text-gray-900">Dreamy Couple Portrait</h2>
                </div>
                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600 shadow-sm">
                  8K Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function SimpleHero({
  title,
  description,
  showSubscribe = false
}: {
  title: string
  description?: string
  showSubscribe?: boolean
}) {
  return (
    <section className="border-b border-gray-200 bg-white py-16">
      <div className="container-custom text-center">
        <h1 className="font-display text-4xl leading-tight text-gray-900 sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
            {description}
          </p>
        )}
        {showSubscribe && (
          <div className="mx-auto mt-8 max-w-lg">
            <EmailSubscribe className="w-full" placeholder="you@example.com" />
          </div>
        )}
      </div>
    </section>
  )
}
