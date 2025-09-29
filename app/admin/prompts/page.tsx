import { getPromptCategories } from '@/lib/content'
import type { PromptCategory } from '@/lib/types'

import PromptForm from './prompt-form'

export const dynamic = 'force-dynamic'

export default async function AdminPromptsPage() {
  const categories = await getPromptCategories()
  return <PromptForm categories={categories} />
}
