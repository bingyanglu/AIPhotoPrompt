import Link from 'next/link'
import type { PromptCategorySummary } from '@/lib/types'
import { slugify } from '@/lib/utils'

interface CategoryOverviewProps {
  categories: PromptCategorySummary[]
}

function CategoryCard({ category }: { category: PromptCategorySummary }) {
  const [rawPrefix, rawFocus] = category.title.split(':').map((part) => part.trim())
  const sectionPrefix = rawFocus ? rawPrefix : null
  const sectionTitle = rawFocus || rawPrefix || category.title

  const useCaseCounts = category.prompts.reduce<Record<string, number>>((acc, prompt) => {
    const key = prompt.useCase?.trim() || 'General Prompts'
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})

  const seenUseCases = new Set<string>()
  const useCaseEntries = (category.subcategories.length > 0
    ? category.subcategories
    : Object.keys(useCaseCounts)
  ).reduce<Array<{ label: string; anchorId: string; count: number }>>((acc, rawUseCase) => {
    const label = rawUseCase?.trim() || 'General Prompts'
    if (!label || seenUseCases.has(label)) {
      return acc
    }
    seenUseCases.add(label)
    const anchorId = `usecase-${category.slug}-${slugify(label)}`
    const count = useCaseCounts[label] ?? 0
    acc.push({ label, anchorId, count })
    return acc
  }, [])

  return (
    <div
      id={`category-${category.slug}`}
      className="group flex h-full flex-col rounded-lg border-2 border-gray-900 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-6 flex flex-col items-center text-center">
        {sectionPrefix && (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            {sectionPrefix}
          </p>
        )}
        <p className="mt-1 font-display text-base text-gray-800">
          {sectionTitle}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          {category.promptCount}
          <span className="sr-only"> prompts in this category</span>
        </p>
      </div>

      <ul className="mb-6 max-h-64 space-y-2 overflow-y-auto pr-1 text-left">
        {useCaseEntries.length > 0 ? (
          useCaseEntries.map(({ label, anchorId, count }) => (
            <li key={label} className="leading-snug">
              <Link
                href={`#${anchorId}`}
                className="inline-flex items-baseline gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                <span>•</span>
                <span>{label}</span>
                <span className="text-xs text-gray-500">
                  ({count})
                </span>
              </Link>
            </li>
          ))
        ) : (
          <li className="list-none rounded-md border border-dashed border-gray-200 px-3 py-6 text-center text-sm text-gray-500">
            Use cases coming soon.
          </li>
        )}
      </ul>

      <Link
        href={`#category-prompts-${category.slug}`}
        className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
      >
        Browse all prompts
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.333 8h8.334M8 3.333 12.667 8 8 12.667"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  )
}

export default function CategoryOverview({ categories }: CategoryOverviewProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard key={category.slug} category={category} />
      ))}
    </div>
  )
}
