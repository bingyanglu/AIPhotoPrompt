import type { PromptCategorySummary, Prompt } from '@/lib/types'
import PromptCard from './PromptCard'
import { slugify } from '@/lib/utils'

interface PromptCollectionProps {
  categories: PromptCategorySummary[]
}

export default function PromptCollection({ categories }: PromptCollectionProps) {
  const categoriesWithPrompts = categories.filter((category) => category.prompts.length > 0)

  return (
    <div className="space-y-16">
      {categoriesWithPrompts.map((category) => (
        <section key={category.slug} id={`category-prompts-${category.slug}`} className="scroll-mt-32">
          {(() => {
            const [rawPrefix, rawFocus] = category.title.split(':').map((part) => part.trim())
            const sectionPrefix = rawFocus ? rawPrefix : null
            const sectionTitle = rawFocus || rawPrefix || category.title

            return (
              <header className="mb-8">
                {sectionPrefix && (
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                    {sectionPrefix}
                  </p>
                )}
                <h2 className="mt-3 font-display text-3xl text-gray-900">
                  {sectionTitle}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-gray-600">
                  {category.description}
                </p>
              </header>
            )
          })()}

          <div className="space-y-12">
            {Object.entries(groupPromptsByUseCase(category.prompts)).map(([useCase, prompts]) => {
              const useCaseId = `usecase-${category.slug}-${slugify(useCase)}`

              return (
                <section key={useCaseId} id={useCaseId} className="space-y-8 scroll-mt-32">
                  <header>
                    <h3 className="font-display text-2xl text-gray-900">{useCase}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {prompts.length} {prompts.length === 1 ? 'prompt' : 'prompts'}
                    </p>
                  </header>
                  <div className="space-y-12">
                    {prompts.map((prompt: Prompt) => (
                      <PromptCard key={prompt.slug} prompt={prompt} />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

function groupPromptsByUseCase(prompts: Prompt[]): Record<string, Prompt[]> {
  return prompts.reduce((groups, prompt) => {
    const key = prompt.useCase?.trim() || 'General Prompts'
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(prompt)
    return groups
  }, {} as Record<string, Prompt[]>)
}
