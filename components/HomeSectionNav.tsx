'use client'

import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'trending-prompts', label: 'Latest Gemini Prompts' },
  { id: 'sora-prompts', label: 'Latest Sora 2 Prompts' },
  { id: 'featured-reads', label: 'Featured Reads' },
  { id: 'categories-grid', label: 'Featured Categories' },
  { id: 'prompts', label: 'Prompt Library' },
  { id: 'benefits', label: 'Why Choose Us' },
  { id: 'learn-prompting', label: 'Learn Prompting' }
]

export default function HomeSectionNav() {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(section.id)
            }
          })
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  return (
    <nav className="pointer-events-none fixed right-6 top-32 z-30 hidden lg:block">
      <div className="pointer-events-auto group relative flex flex-col items-end">
        <button className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-600 shadow-sm transition-colors hover:bg-gray-900 hover:text-white">
          Sections
        </button>
        <div className="absolute right-0 top-full z-30 mt-3 hidden min-w-[16rem] space-y-2 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur group-hover:block">
          <ul className="space-y-1 text-sm">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`inline-flex w-full items-center rounded-md px-3 py-2 transition-colors ${
                    activeId === section.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
