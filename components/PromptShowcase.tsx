'use client'

import { useState } from 'react'

export interface ShowcasePrompt {
  slug: string
  title: string
  description: string
  prompt: string
  color?: string
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

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border-2 border-gray-900 bg-white">
      <div className="h-36 border-b border-gray-200 bg-gray-100" aria-hidden>
        <div className="flex h-full flex-col justify-between p-5 text-gray-700">
          <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Gemini Output</span>
          <h3 className="font-display text-lg leading-tight text-gray-900">{prompt.title}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <p className="text-sm text-gray-600">{prompt.description}</p>
        <p className="line-clamp-6 flex-1 whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm leading-relaxed text-gray-800">
          {prompt.prompt}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center justify-center gap-2 rounded-md border-2 px-4 py-2 text-sm font-semibold transition-colors ${isCopied ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-900 bg-gray-900 text-white hover:bg-white hover:text-gray-900'}`}
        >
          {isCopied ? 'Copied!' : 'Copy prompt'}
        </button>
      </div>
    </article>
  )
}
