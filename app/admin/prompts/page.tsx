import { getPromptCategories } from '@/lib/content'
import type { PromptCategory } from '@/lib/types'

import PromptForm from './prompt-form'

export const dynamic = 'force-dynamic'

export default async function AdminPromptsPage() {
  if (process.env.NEXT_PUBLIC_ADMIN_ACCESS_TOKEN) {
    const categories = await getPromptCategories()
    return <PromptForm categories={categories} />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg text-center">
        <h1 className="font-display text-3xl text-gray-900">管理员配置缺失</h1>
        <p className="mt-4 text-sm text-gray-600">
          请先设置 <code className="rounded bg-gray-100 px-2 py-1 text-xs">NEXT_PUBLIC_ADMIN_ACCESS_TOKEN</code> 环境变量，然后访问 <code className="rounded bg-gray-100 px-2 py-1 text-xs">/admin/login</code> 进行登录。
        </p>
      </div>
    </div>
  )
}
