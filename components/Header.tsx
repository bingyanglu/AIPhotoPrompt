'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
}

const navigation: NavItem[] = [
  { label: 'Gemini AI Photo Prompt', href: '/prompts' },
  { label: 'Sora 2 Prompt', href: '/prompts/sora-2-prompt' },
  { label: 'Sora 2 Invite Codes', href: '/sora-2-invite-codes' },
  { label: 'Blog', href: '/blog' }
]

export default function Header() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="border-b-2 border-gray-900 bg-white">
      <div className="container-custom flex h-20 items-center justify-between">
        <Link href="/" className="text-2xl font-display font-semibold text-gray-900">
          AI Photo Prompt Lab
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => {
            const isHighlighted = item.label === 'Sora 2 Invite Codes'
            const baseClasses = isActive(item.href)
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-900'
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isHighlighted
                    ? `inline-flex items-center gap-2 rounded-full border-2 border-emerald-400 bg-emerald-50 px-3 py-1 text-emerald-700 shadow-sm ${
                        isActive(item.href) ? 'border-emerald-500 bg-emerald-100 text-emerald-800' : ''
                      }`
                    : baseClasses
                }`}
              >
                {item.label}
                {isHighlighted && (
                  <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Share
                  </span>
                )}
              </Link>
            )
          })}
          <a
            href="https://socialprompt.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border-2 border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
          >
            Read newsletter
            <span aria-hidden>→</span>
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md border-2 border-gray-900 p-2 text-gray-900 md:hidden"
          aria-expanded={isMobileOpen}
        >
          <span className="sr-only">Toggle navigation</span>
          {isMobileOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {isMobileOpen && (
        <div className="border-b-2 border-gray-900 bg-white md:hidden">
          <div className="space-y-3 px-4 py-4">
            {navigation.map((item) => {
              const isHighlighted = item.label === 'Sora 2 Invite Codes'
              const mobileClasses = isActive(item.href)
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm font-medium ${mobileClasses} ${
                    isHighlighted ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : ''
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.label}
                  <span aria-hidden>→</span>
                </Link>
              )
            })}
            <a
              href="https://socialprompt.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-md border-2 border-gray-900 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white"
              onClick={() => setIsMobileOpen(false)}
            >
              Read newsletter
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
