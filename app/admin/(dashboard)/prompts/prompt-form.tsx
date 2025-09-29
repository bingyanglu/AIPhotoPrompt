'use client'

import { useState } from 'react'
import type { PromptCategory } from '@/lib/types'

interface PromptFormProps {
  categories: PromptCategory[]
}

export default function PromptForm({ categories }: PromptFormProps) {
  const [form, setForm] = useState({
    slug: '',
    title: '',
    description: '',
    template: '',
    coverImage: '',
    category: categories[0]?.slug ?? '',
    useCase: '',
    difficulty: 'beginner',
    tags: '',
    featured: false
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          category: form.category,
          tags: form.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        })
      })

      const result = await response.json()
      if (!response.ok || !result.success) {
        setMessage(result.message || '提交失败，请检查数据。')
        return
      }

      setMessage('提示词保存成功！')
      setForm((prev) => ({
        ...prev,
        slug: '',
        title: '',
        description: '',
        template: '',
        coverImage: '',
        useCase: '',
        tags: '',
        featured: false
      }))
    } catch (error) {
      console.error('Failed to create prompt', error)
      setMessage('提交过程中出现错误，请稍后再试。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white">
      <div className="px-6 py-8">
        <h1 className="font-display text-3xl text-gray-900">提示词管理后台</h1>
        <p className="mt-3 text-sm text-gray-600">填写下列表单，提交后数据将写入 Supabase 数据库。</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-gray-700">Slug *</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="例如 gemini-new-prompt"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="简短描述提示词用途"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Template *</label>
            <textarea
              name="template"
              value={form.template}
              onChange={handleChange}
              rows={10}
              required
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-gray-700">封面图 URL</label>
              <input
                type="text"
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Use Case</label>
              <input
                type="text"
                name="useCase"
                value={form.useCase}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="例如 Retail Flatlay Prompts"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="text-sm font-semibold text-gray-700">所属分类 *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">难度 *</label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">标签（逗号分隔）</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="例如 gemini, figurine, product"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">Featured</label>
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="h-4 w-4"
            />
          </div>

          {message && (
            <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {message}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md border-2 border-gray-900 bg-gray-900 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? '提交中…' : '保存提示词'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
