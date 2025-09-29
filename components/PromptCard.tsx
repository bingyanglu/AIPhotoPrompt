'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Prompt } from '@/lib/types'

interface PromptCardProps {
  prompt: Prompt
}

const BLOG_LINKS: Record<string, { href: string; label: string }> = {
  'gemini-black-myth-figurine': {
    href: '/blog/gemini-figurine-photo-prompt',
    label: 'Read the figurine workflow guide'
  }
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false)
  const [copyCount, setCopyCount] = useState<number>(prompt.copyCount ?? 0)

  // hydrate copy count from local storage so it persists per user
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(`prompt-copy-count:${prompt.slug}`)
    if (stored) {
      const parsed = parseInt(stored, 10)
      if (!Number.isNaN(parsed)) {
        setCopyCount(parsed)
      }
    }
  }, [prompt.slug])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.template)
      setCopied(true)
      const next = copyCount + 1
      setCopyCount(next)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(`prompt-copy-count:${prompt.slug}`, String(next))
      }
      void fetch(`/api/prompts/${prompt.slug}/copy`, { method: 'POST' }).catch((error) => {
        console.error('Failed to record copy count', error)
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy prompt', error)
    }
  }

  return (
    <article
      id={`prompt-${prompt.slug}`}
      className="scroll-mt-32 rounded-lg border-2 border-gray-900 bg-white p-6 shadow-sm"
    >
      <h3 className="font-display text-2xl text-gray-900">
        {prompt.title}
      </h3>
      {prompt.coverImage && (
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          <a
            href={prompt.coverImage}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-[4/3]"
          >
            <img
              src={prompt.coverImage}
              alt={prompt.title}
              className="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <span className="sr-only">View full size image</span>
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-white/70 bg-black/60 px-3 py-1 text-xs font-medium text-white opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
              View original
            </span>
          </a>
        </div>
      )}
      <div className="mt-4 space-y-3">
        <div className="rounded-md border border-gray-200 bg-neutral-100 px-6 py-5">
          <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-800">
            {prompt.template}
          </p>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 rounded-md border-2 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] transition-colors ${copied ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-900 bg-gray-900 text-white hover:bg-white hover:text-gray-900'}`}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy prompt'}
          </button>
        </div>
        <div className="flex flex-col gap-2 text-right text-xs font-medium text-gray-500">
          <p>
            Copied {copyCount} {copyCount === 1 ? 'time' : 'times'}
          </p>
          {BLOG_LINKS[prompt.slug] && (
            <Link
              href={BLOG_LINKS[prompt.slug].href}
              className="inline-flex items-center justify-end gap-1 text-xs font-semibold text-gray-900 underline underline-offset-4 transition-colors hover:text-primary-600"
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
