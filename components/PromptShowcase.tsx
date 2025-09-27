'use client'

import { useState } from 'react'
import Link from 'next/link'

export interface ShowcasePrompt {
  slug: string
  title: string
  description: string
  prompt: string
  coverImage?: string
  category?: string
  useCase?: string
}

const BLOG_LINKS: Record<string, { href: string; label: string }> = {
  'gemini-black-myth-figurine': {
    href: '/blog/gemini-figurine-photo-prompt',
    label: 'Read the figurine workflow guide'
  }
}

export default function PromptShowcase({ prompts }: { prompts: ShowcasePrompt[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.slug} prompt={prompt} />
      ))}
    </div>
  )
}

function PromptCard({ prompt }: { prompt: ShowcasePrompt }) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1800)
    } catch (error) {
      console.error('Failed to copy prompt', error)
    }
  }

  const detailHref = `/prompts#prompt-${prompt.slug}`

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border-2 border-gray-900 bg-white">
      <Link
        href={detailHref}
        className="relative aspect-[4/3] w-full overflow-hidden border-b border-gray-200 bg-gray-100"
      >
        {prompt.coverImage ? (
          <img
            src={prompt.coverImage}
            alt={`${prompt.title} preview`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-200 via-white to-indigo-200">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Gemini Output</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Link href={detailHref} className="font-display text-lg leading-tight text-gray-900 hover:text-gray-600">
          {prompt.title}
        </Link>
        <p className="text-sm text-gray-600">{prompt.description}</p>
        <p className="line-clamp-6 flex-1 whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm leading-relaxed text-gray-800">
          {prompt.prompt}
        </p>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center justify-center gap-2 rounded-md border-2 px-4 py-2 text-sm font-semibold transition-colors ${isCopied ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-900 bg-gray-900 text-white hover:bg-white hover:text-gray-900'}`}
          >
            {isCopied ? 'Copied!' : 'Copy prompt'}
          </button>
          {BLOG_LINKS[prompt.slug] && (
            <Link
              href={BLOG_LINKS[prompt.slug].href}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-900 underline underline-offset-4 transition-colors hover:text-primary-600"
            >
              {BLOG_LINKS[prompt.slug].label}
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
