import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import PromptShowcase, { type ShowcasePrompt } from '@/components/PromptShowcase'
import EmailSubscribe from '@/components/EmailSubscribe'
import { getLatestPrompts, getPrompts, getBlogPosts } from '@/lib/content'
import { SITE_CONFIG } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Gemini AI Photo Prompts – Copy & Paste Ready',
  description: 'Explore trending Gemini AI photo prompts curated for photographers and creatives. Copy & paste ready prompts for editing, travel, portraits, and more.',
  alternates: {
    canonical: 'https://www.aiphotoprompt.net/',
  },
}

const benefits = [
  {
    title: 'Copy & Paste Ready',
    description: 'Every Gemini prompt is optimized and one-click copy friendly so you can build images without tweaking.'
  },
  {
    title: 'Curated by Category',
    description: 'Browse editing, trending styles, creative use cases, and official Gemini prompt upgrades.'
  },
  {
    title: 'Always Updated',
    description: 'New trending prompts drop weekly with fresh monthly photo collections you can trust.'
  }
]

const featuredCategories = [
  {
    title: 'Photo Editing',
    description: 'Make your photos stylish, polished, and gallery ready with pro-level prompts.',
    href: '/prompts'
  },
  {
    title: 'Trending Prompts',
    description: 'Stay on top of the viral looks shaping social feeds this week.',
    href: '/prompts'
  },
  {
    title: 'Use Cases',
    description: 'Couples, portraits, travel, products – pick the scenario, paste the prompt.',
    href: '/prompts'
  },
  {
    title: 'Google Gemini Official',
    description: 'Optimized spins on Google’s own Gemini photo prompts for sharper results.',
    href: '/prompts'
  }
]

export default async function HomePage() {
  const siteDescription = metadata.description ?? 'Explore curated Gemini AI photo prompts and tutorials.'

const latestPrompts = await getLatestPrompts(12)
const allPrompts = latestPrompts.length > 0 ? latestPrompts : await getPrompts()
let geminiPromptPool = allPrompts.filter((prompt) => !prompt.category.startsWith('sora-2-'))
let soraPromptPool = allPrompts.filter((prompt) => prompt.category.startsWith('sora-2-'))

if (geminiPromptPool.length < 6) {
  const fullPrompts = await getPrompts()
  geminiPromptPool = fullPrompts.filter((prompt) => !prompt.category.startsWith('sora-2-'))
  if (soraPromptPool.length === 0) {
    soraPromptPool = fullPrompts.filter((prompt) => prompt.category.startsWith('sora-2-'))
  }
}

const selectedPrompts = geminiPromptPool.slice(0, 6)
const showcasePrompts: ShowcasePrompt[] = selectedPrompts.map((prompt) => ({
  slug: prompt.slug,
  title: prompt.title,
  description: prompt.description,
  prompt: prompt.template,
  coverImage: prompt.coverImage,
  category: prompt.category,
  useCase: prompt.useCase,
}))

const soraHighlights = soraPromptPool.slice(0, 6)

const blogPosts = await getBlogPosts()
const featuredReads = blogPosts.filter((post) => post.featured).slice(0, 3)
const latestBlogPosts = blogPosts.slice(0, 3)
const blogDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
})

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: siteDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I copy Gemini photo prompts quickly?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every prompt card on AI Photo Prompt Lab includes an always-visible Copy Prompt button. Click once to capture the complete Gemini prompt with retro palettes, Polaroid framing, and lens cues ready to paste into your workflow.'
        }
      },
      {
        '@type': 'Question',
        name: 'What kinds of Gemini prompts are available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The library spans trending saree portraits, cinematic travel vistas, product flatlays, and editing-ready looks. New Gemini prompt collections ship weekly so photographers can match client briefs faster.'
        }
      }
    ]
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
       <section id="trending-prompts" className="bg-white py-20">
         <div className="container-custom">
           <div className="mx-auto max-w-2xl text-center">
             <h2 className="font-display text-3xl text-gray-900">Latest Gemini AI Photo Prompts</h2>
             <p className="mt-3 text-base text-gray-600">Fresh uploads direct from the catalog. Discover what just dropped and take it for a spin instantly.</p>
           </div>
           <div className="mt-12">
             <PromptShowcase prompts={showcasePrompts} />
           </div>
           <div className="mt-10 flex justify-center">
             <Link
               href="/prompts"
               className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-gray-900 px-5 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
             >
               View more prompts
               <span aria-hidden>→</span>
             </Link>
           </div>
         </div>
       </section>

        {soraHighlights.length > 0 && (
          <section className="border-t border-gray-200 bg-gray-50 py-20">
            <div className="container-custom">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-display text-3xl text-gray-900">Latest Sora 2 Prompts</h2>
                <p className="mt-3 text-base text-gray-600">Audio-video ready recipes for Sora 2. Copy the prompt, fine-tune, and render your next sequence.</p>
              </div>
              <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {soraHighlights.map((prompt) => (
                  <article key={prompt.slug} className="flex h-full flex-col justify-between rounded-lg border-2 border-gray-900 bg-white p-6 text-gray-900">
                    <div className="space-y-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                        Sora 2 · {prompt.useCase}
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-gray-900">{prompt.title}</h3>
                        <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-4">{prompt.description}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-mono leading-relaxed text-gray-700 line-clamp-6">
                        {prompt.template}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Link
                        href={`/prompts/sora-2-prompt#prompt-${prompt.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-gray-900 underline underline-offset-4 transition-colors hover:text-primary-600"
                      >
                        View Sora 2 prompt
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <Link
                  href="/prompts/sora-2-prompt"
                  className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-gray-900 px-5 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
                >
                  View more Sora prompts
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {featuredReads.length > 0 && (
          <section className="border-t border-gray-200 bg-gray-50 py-20">
            <div className="container-custom">
              <div className="mb-10 text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Featured reads</span>
                <h2 className="mt-3 font-display text-3xl text-gray-900">Curated stories for Gemini creators</h2>
                <p className="mt-3 text-base text-gray-600">Dive deeper into the launches, workflows, and experiments shaping the prompt frontier.</p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                {featuredReads.map((post) => {
                  const formattedDate = post.publishDate
                    ? blogDateFormatter.format(new Date(post.publishDate))
                    : null

                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-lg border-2 border-gray-900 bg-white text-gray-900 transition-transform duration-200 hover:-translate-y-1"
                    >
                      {post.coverImage && (
                        <figure className="relative aspect-[4/3] w-full overflow-hidden border-b border-gray-200 bg-gray-100">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        </figure>
                      )}
                      <div className="space-y-4 p-6">
                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                          {post.category?.toUpperCase() || 'BLOG'}
                          {formattedDate && (
                            <span className="ml-2 normal-case tracking-normal text-gray-400">{formattedDate}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-display text-xl text-gray-900">{post.title}</h3>
                          <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-4">{post.description}</p>
                        </div>
                      </div>
                      <span className="mt-auto flex items-center justify-end gap-2 border-t border-gray-200 px-6 py-4 text-sm font-semibold text-gray-900">
                        Read now
                        <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        <section className="border-y border-gray-200 bg-gray-50 py-20">
          <div className="container-custom">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="font-display text-3xl text-gray-900">Featured categories</h2>
                <p className="mt-3 text-base text-gray-600">Explore dedicated libraries curated for the most requested Gemini photo styles.</p>
              </div>
              <Link
                href="/prompts"
                className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-gray-900 px-5 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
              >
                Browse all categories
                <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featuredCategories.map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className="group flex h-full flex-col justify-between rounded-lg border-2 border-gray-900 bg-white p-6 text-gray-900 transition-transform duration-200 hover:-translate-y-1"
                >
                  <div>
                    <h3 className="font-display text-xl">{category.title}</h3>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">{category.description}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                    View prompts
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container-custom">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl text-gray-900">Why creators choose AI Photo Prompt Lab</h2>
              <p className="mt-3 text-base text-gray-600">
                Gemini photo prompting without guesswork. Grab the exact wording, generate, and keep moving. Creators lean on our retro color grades, Polaroid-inspired framing, and saree portrait lighting recipes to match client briefs in minutes. Every prompt spells out composition, mood, and lens cues so you can skip trial-and-error and ship gallery-ready results.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="rounded-lg border-2 border-gray-900 bg-white p-8">
                  <h3 className="font-display text-xl text-gray-900">{benefit.title}</h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 bg-gray-50 py-20">
          <div className="container-custom">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl text-gray-900">Learn prompting faster</h2>
              <p className="mt-3 text-base text-gray-600">Guides to sharpen your Gemini workflow and stay ahead of emerging styles.</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {latestBlogPosts.map((post) => {
                const categoryLabel = post.category
                  ? post.category
                      .split('-')
                      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
                      .join(' ')
                  : 'Blog'
                const formattedDate = post.publishDate
                  ? blogDateFormatter.format(new Date(post.publishDate))
                  : null
                const metaDetails = [formattedDate, post.readTime].filter(Boolean).join(' · ')

                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col justify-between rounded-lg border-2 border-gray-900 bg-white p-6 text-gray-900 transition-transform duration-200 hover:-translate-y-1"
                  >
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                        {categoryLabel}
                        {metaDetails && (
                          <span className="ml-2 normal-case tracking-normal text-gray-400">
                            {metaDetails}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 font-display text-xl">{post.title}</h3>
                      <p className="mt-4 text-sm text-gray-600 leading-relaxed">{post.description}</p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                      Read article
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container-custom">
            <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-gray-900 bg-gray-50 p-12 text-center">
              <h2 className="font-display text-3xl text-gray-900">Want the hottest Gemini AI prompts delivered weekly?</h2>
              <p className="max-w-2xl text-base text-gray-600">
                Join thousands of creators getting curated prompt drops, trending looks, and editing recipes straight to their inbox.
              </p>
              <EmailSubscribe className="w-full max-w-xl" placeholder="you@example.com" />
            </div>
          </div>
        </section>

        <Script id="homepage-website-schema" type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </Script>
        <Script id="homepage-faq-schema" type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </Script>
      </main>
      <Footer />
    </div>
  )
}
