import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CategoryOverview from '@/components/CategoryOverview'
import CategoryQuickLinks from '@/components/CategoryQuickLinks'
import PromptCollection from '@/components/PromptCollection'
import { getPromptCategories, getPrompts } from '@/lib/content'
import type { PromptCategorySummary } from '@/lib/types'
import { generateSEOMetadata } from '@/lib/seo'

export default async function SoraPromptsPage() {
  const [categories, prompts] = await Promise.all([
    getPromptCategories(),
    getPrompts()
  ])

  const soraCategories = categories.filter((category) => category.slug.startsWith('sora-2-'))
  const soraPrompts = prompts.filter((prompt) => prompt.category.startsWith('sora-2-'))

  const categoriesWithSubcategories: PromptCategorySummary[] = soraCategories.map((category) => {
    const categoryPrompts = soraPrompts.filter((prompt) => prompt.category === category.slug)

    const subcategories = [
      ...new Set(
        categoryPrompts.map((prompt) => prompt.useCase?.trim() || 'General Prompts')
      )
    ]

    return {
      ...category,
      prompts: categoryPrompts,
      subcategories,
      promptCount: categoryPrompts.length
    }
  })

  const totalPrompts = soraPrompts.length
  const totalCategories = soraCategories.length
  const uniqueUseCases = new Set(categoriesWithSubcategories.flatMap((category) => category.subcategories))
  const featuredPrompts = soraPrompts.filter((prompt) => prompt.featured)
  const formattedMonth = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date())

  const hasData = categoriesWithSubcategories.length > 0

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="bg-white py-20">
          <div className="container-custom">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-full border border-gray-200 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Sora 2 Prompts
              </span>
              <h1 className="mt-6 font-display text-4xl text-gray-900 sm:text-5xl">
                {totalPrompts} Sora 2 Prompt Explorations
              </h1>
              <p className="mt-4 text-base text-gray-600 sm:text-lg">
                Explore Sora 2 prompt explorations and audio-video recipes. Updated for {formattedMonth} · {totalCategories} categories · {uniqueUseCases.size} use cases · {featuredPrompts.length} featured prompts
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="#categories-grid"
                  className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-gray-900 bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
                >
                  Browse categories
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="#prompts"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
                >
                  Jump to prompts
                  <span aria-hidden>↓</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="categories-grid" className="bg-gray-50 py-16">
          <div className="container-custom">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                Explore
              </span>
              <h2 className="mt-3 font-display text-3xl text-gray-900">
                Browse by category
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-600 lg:mx-auto lg:text-base">
                Each collection highlights flagship Sora 2 workflows. Surface cinematic sequences, stylised animations, and Cameo remixes ready for your next video.
              </p>
            </div>

            <div className="mt-12">
              {hasData ? (
                <CategoryOverview categories={categoriesWithSubcategories} />
              ) : (
                <div className="rounded-lg border-2 border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
                  We&apos;re cataloging Sora 2 prompt packs right now. Check back soon for curated categories.
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="prompts" className="border-t border-gray-200 bg-white py-16">
          <div className="container-custom">
            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-8">
                {hasData ? (
                  <PromptCollection categories={categoriesWithSubcategories} />
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-600">
                    No published Sora 2 prompts yet. Subscribe to the newsletter for release announcements.
                  </div>
                )}
              </div>
              <div className="mt-12 lg:col-span-4 lg:mt-0">
                <CategoryQuickLinks categories={categoriesWithSubcategories} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export const metadata = generateSEOMetadata({
  title: 'Sora 2 Prompt Library',
  description: 'Explore Sora 2 prompt explorations and audio-video recipes covering cinematic storyboards, animation styles, and Cameo remixes.',
  path: '/prompts/sora-2-prompt',
  keywords: [
    'sora 2 prompt',
    'sora 2 prompts copy paste',
    'openai sora prompt library',
    'sora video generation workflows'
  ]
})
