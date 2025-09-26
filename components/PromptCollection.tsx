import type { PromptCategorySummary } from '@/lib/types'
import PromptCard from './PromptCard'

interface PromptCollectionProps {
  categories: PromptCategorySummary[]
}

export default function PromptCollection({ categories }: PromptCollectionProps) {
  const categoriesWithPrompts = categories.filter((category) => category.prompts.length > 0)

  return (
    <div className="space-y-16">
      {categoriesWithPrompts.map((category) => (
        <section key={category.slug} id={`category-prompts-${category.slug}`} className="scroll-mt-32">
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
              {category.title.replace(' Prompts', '')}
            </p>
            <h2 className="mt-3 font-display text-3xl text-gray-900">
              Gemini Prompts for {category.title.replace(' Prompts', '')}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              {category.description}
            </p>
          </header>

          <div className="space-y-12">
            {category.prompts.map((prompt) => (
              <PromptCard key={prompt.slug} prompt={prompt} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
