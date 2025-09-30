import Link from 'next/link'
import type { PromptCategorySummary } from '@/lib/types'
import { slugify } from '@/lib/utils'

interface CategoryQuickLinksProps {
  categories: PromptCategorySummary[]
}

export default function CategoryQuickLinks({ categories }: CategoryQuickLinksProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <aside className="sticky top-32">
      <div className="rounded-lg border-2 border-gray-900 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4 text-center">
          <h3 className="font-display text-xl text-gray-900">Quick Links</h3>
        </div>
        <div className="px-6 pb-6 pt-4">
          <ol className="max-h-[calc(100vh-260px)] space-y-5 overflow-y-auto pr-1">
            {categories.map((category) => (
              <li key={category.slug} className="space-y-2">
                {(() => {
                  const [rawPrefix, rawFocus] = category.title.split(':').map((part) => part.trim())
                  const displayTitle = rawFocus || rawPrefix || category.title
                  return (
                    <Link
                      href={`#category-prompts-${category.slug}`}
                      className="block text-left text-sm font-semibold text-gray-900 transition-colors hover:text-primary-500"
                    >
                      {displayTitle}
                    </Link>
                  )
                })()}
                {category.subcategories.length > 0 && (
                  <ul className="space-y-1.5 pl-3 text-sm text-gray-600">
                    {category.subcategories.slice(0, 20).map((subcategory) => {
                      const groupId = `usecase-${category.slug}-${slugify(subcategory || 'general')}`
                      return (
                        <li key={subcategory} className="leading-snug">
                          <Link
                            href={`#${groupId}`}
                            className="inline-flex items-center text-gray-600 transition-colors hover:text-gray-900"
                          >
                            {subcategory || 'General Prompts'}
                          </Link>
                        </li>
                      )
                    })}
                    {category.subcategories.length > 20 && (
                      <li className="text-xs text-gray-500">
                        +{category.subcategories.length - 20} more
                      </li>
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </aside>
  )
}
