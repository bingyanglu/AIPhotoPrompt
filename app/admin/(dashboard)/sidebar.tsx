'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/admin/prompts', label: 'Prompt Library', disabled: false },
  { href: '/admin/categories', label: 'Categories', disabled: true },
  { href: '/admin/blog', label: 'Blog Posts', disabled: true },
  { href: '/admin/settings', label: 'Settings', disabled: true }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white md:flex md:flex-col">
      <div className="px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">Admin Menu</p>
      </div>
      <nav className="flex-1 space-y-1 px-4 pb-6">
        {NAV_ITEMS.map((item) => {
          if (item.disabled) {
            return (
              <div
                key={item.href}
                className="rounded-lg border border-dashed border-gray-200 px-4 py-3 text-sm text-gray-400"
              >
                {item.label}
                <span className="ml-2 text-xs">(coming soon)</span>
              </div>
            )
          }

          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-transparent text-gray-700 hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
