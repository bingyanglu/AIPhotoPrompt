import Link from 'next/link'

interface FooterLink {
  label: string
  href: string
}

const primaryLinks: FooterLink[] = [
  { label: 'Prompts', href: '/prompts' },
  { label: 'Blog', href: '/blog' }
]

const legalLinks: FooterLink[] = [
  { label: 'Privacy Policy', href: '/legal/privacy-policy' },
  { label: 'Terms of Service', href: '/legal/terms-of-service' }
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t-2 border-gray-900 bg-white">
      <div className="container-custom py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md space-y-4">
            <Link href="/" className="text-2xl font-display font-semibold text-gray-900">
              AI Photo Prompt Lab
            </Link>
            <p className="text-sm text-gray-600">
              Curated Gemini AI photo prompt collections and guides to help you ship better AI-powered visuals faster.
            </p>
          </div>

        <div className="flex flex-col gap-6 text-sm text-gray-600">
            <nav aria-label="Footer" className="flex flex-wrap gap-4 font-medium text-gray-900">
              {primaryLinks.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-gray-500">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              {legalLinks.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-gray-700">
                  {link.label}
                </Link>
              ))}
            </div>
            <a
              href="https://socialprompt.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-max items-center gap-2 rounded-md border-2 border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
            >
              Read newsletter
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-4 border-t border-gray-200 pt-6 text-xs text-gray-500 lg:grid-cols-2">
          <p>© {year} AI Photo Prompt Lab. All rights reserved.</p>
          <p className="lg:text-right">Built for prompt engineers and AI teams working with Gemini AI. Not affiliated with OpenAI or Google.</p>
        </div>
      </div>
    </footer>
  )
}

export function SimpleFooter() {
  return (
    <footer className="border-t-2 border-gray-900 bg-white py-6">
      <div className="container-custom flex flex-col gap-3 text-sm text-center text-gray-600 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-lg font-display text-gray-900">
          AI Photo Prompt Lab
        </Link>
        <p className="text-xs">© {new Date().getFullYear()} AI Photo Prompt Lab. All rights reserved.</p>
      </div>
    </footer>
  )
}
