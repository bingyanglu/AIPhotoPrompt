import Link from 'next/link'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CategoryOverview from '@/components/CategoryOverview'
import CategoryQuickLinks from '@/components/CategoryQuickLinks'
import PromptCollection from '@/components/PromptCollection'
import { getPromptCategories, getPrompts } from '@/lib/content'
import type { PromptCategorySummary } from '@/lib/types'

export default async function PromptsPage() {
  const [categories, prompts] = await Promise.all([
    getPromptCategories(),
    getPrompts()
  ])

  // 为每个分类创建子分类（基于 useCase）
  const categoriesWithSubcategories: PromptCategorySummary[] = categories.map((category) => {
    const categoryPrompts = prompts.filter((prompt) => prompt.category === category.slug)

    // 提取该分类下的所有 useCase 作为子分类
    const subcategories = [...new Set(categoryPrompts.map((prompt) => prompt.useCase))].filter(Boolean)

    return {
      ...category,
      prompts: categoryPrompts,
      subcategories,
      promptCount: categoryPrompts.length
    }
  })

  const totalPrompts = prompts.length
  const totalCategories = categories.length
  const uniqueUseCases = new Set(categoriesWithSubcategories.flatMap((category) => category.subcategories))
  const featuredPrompts = prompts.filter((prompt) => prompt.featured)
  const formattedMonth = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date())

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="bg-white py-20">
          <div className="container-custom">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-full border border-gray-200 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Gemini Prompts
              </span>
              <h1 className="mt-6 font-display text-4xl text-gray-900 sm:text-5xl">
                {totalPrompts} Must-Try Gemini Prompts
              </h1>
              <p className="mt-4 text-base text-gray-600 sm:text-lg">
                Discover curated prompts to accelerate writing, coding, marketing, and more. Copy, customise, and deploy faster with dependable templates.
              </p>
              <p className="mt-3 text-sm text-gray-500">
                Updated for {formattedMonth} · {totalCategories} categories · {uniqueUseCases.size} use cases · {featuredPrompts.length} featured templates
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href="#categories-grid"
                  className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-gray-900 bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
                >
                  Browse categories
                  <span aria-hidden>→</span>
                </a>
                <a
                  href="#prompts"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
                >
                  Jump to prompts
                  <span aria-hidden>↓</span>
                </a>
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
                Each collection below highlights flagship templates and popular use cases. Jump in to customise the prompts that match your workflow, then copy them in one click.
              </p>
            </div>

            <div className="mt-12">
              <CategoryOverview categories={categoriesWithSubcategories} />
            </div>
          </div>
        </section>

        <section id="prompts" className="border-t border-gray-200 bg-white py-16">
          <div className="container-custom">
            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-8">
                <PromptCollection categories={categoriesWithSubcategories} />
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

export const metadata: Metadata = {
  title: 'Gemini Prompts Library - Categories',
  description: 'Browse our collection of Gemini prompts organized by category. Copy and customize prompts for writing, coding, business, and more.',
  alternates: {
    canonical: 'https://www.aiphotoprompt.net/prompts',
  },
}
