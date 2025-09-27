import Link from 'next/link'
import type { PromptCategorySummary } from '@/lib/types'

interface CategoryOverviewProps {
  categories: PromptCategorySummary[]
}

function CategoryCard({ category }: { category: PromptCategorySummary }) {
  const topPrompts = category.prompts.slice(0, 6)
  const [rawPrefix, rawFocus] = category.title.split(':').map((part) => part.trim())
  const sectionPrefix = rawFocus ? rawPrefix : null
  const sectionTitle = rawFocus || rawPrefix || category.title

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
          {category.promptCount} curated templates
        </p>
      </div>

      <ul
        role="list"
        className="mb-6 max-h-64 space-y-3 overflow-y-auto pr-1"
      >
        {topPrompts.length > 0 ? (
          topPrompts.map((prompt) => (
            <li
              key={prompt.slug}
              className="border-b border-gray-200 pb-2 last:border-b-0"
            >
              <Link
                href={`#prompt-${prompt.slug}`}
                className="group/item flex items-center gap-3 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                <span aria-hidden className="text-gray-400 transition-colors group-hover/item:text-gray-900">
                  &rarr;
                </span>
                <span className="flex-1 leading-tight line-clamp-2">
                  {prompt.title}
                </span>
              </Link>
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                {prompt.description}
              </p>
            </li>
          ))
        ) : (
          <li className="rounded-md border border-dashed border-gray-200 px-3 py-6 text-center text-sm text-gray-500">
            New templates coming soon.
          </li>
        )}
      </ul>

      <div className="mt-auto space-y-4">
        {category.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {category.subcategories.slice(0, 5).map((subcategory) => (
              <span
                key={subcategory}
                className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600"
              >
                {subcategory}
              </span>
            ))}
            {category.subcategories.length > 5 && (
              <span className="inline-flex items-center rounded-full border border-dashed border-gray-200 px-3 py-1 text-xs text-gray-500">
                +{category.subcategories.length - 5} more
              </span>
            )}
          </div>
        )}

        <Link
          href={`#category-prompts-${category.slug}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
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
