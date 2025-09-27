import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import PromptShowcase, { type ShowcasePrompt } from '@/components/PromptShowcase'
import EmailSubscribe from '@/components/EmailSubscribe'
import { getPrompts } from '@/lib/content'
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

const blogHighlights = [
  {
    title: '$10K Product Shoots Without a Studio',
    description: 'Learn how Gemini delivers commercial-grade AI product photography with ready-to-use prompts.',
    href: '/blog/gemini-product-photography-guide'
  },
  {
    title: 'Gemini Figurine Prompt Workflow',
    description: 'Transform a screenshot into a collectible figurine scene using our Nano Banana prompt and iteration tips.',
    href: '/blog/gemini-figurine-photo-prompt'
  }
]

export default async function HomePage() {
  const siteDescription = metadata.description ?? 'Explore curated Gemini AI photo prompts and tutorials.'

  const allPrompts = await getPrompts()
  const featuredPrompts = allPrompts.filter((prompt) => prompt.featured)
  const selectedPrompts = (featuredPrompts.length > 0 ? featuredPrompts : allPrompts).slice(0, 6)
  const showcasePrompts: ShowcasePrompt[] = selectedPrompts.map((prompt) => ({
    slug: prompt.slug,
    title: prompt.title,
    description: prompt.description,
    prompt: prompt.template,
    coverImage: prompt.coverImage,
    category: prompt.category,
    useCase: prompt.useCase,
  }))

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
              <h2 className="font-display text-3xl text-gray-900">This week’s top Gemini AI prompts</h2>
              <p className="mt-3 text-base text-gray-600">Hand-picked prompts the community is copying right now. Paste, tweak, and render in seconds.</p>
            </div>
            <div className="mt-12">
              <PromptShowcase prompts={showcasePrompts} />
            </div>
          </div>
        </section>

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
              {blogHighlights.map((post) => (
                <Link
                  key={post.href}
                  href={post.href}
                  className="group flex h-full flex-col justify-between rounded-lg border-2 border-gray-900 bg-white p-6 text-gray-900 transition-transform duration-200 hover:-translate-y-1"
                >
                  <div>
                    <h3 className="font-display text-xl">{post.title}</h3>
                    <p className="mt-4 text-sm text-gray-600 leading-relaxed">{post.description}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                    Read article
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              ))}
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
