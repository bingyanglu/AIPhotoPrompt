import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogCard, { BlogGrid } from '@/components/BlogCard'
import { getBlogPosts, getBlogConfig } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Blog - AI Photo Prompt Lab',
  description: 'Latest Gemini AI photo prompt tips, tutorials, and insights for prompt engineers and creators.',
  alternates: {
    canonical: 'https://www.aiphotoprompt.net/blog',
  },
}

export default async function BlogPage() {
  const [posts, config] = await Promise.all([
    getBlogPosts(),
    getBlogConfig()
  ])

  const totalPosts = posts.length
  const featuredPosts = posts.filter((post) => post.featured)
  const regularPosts = posts.filter((post) => !post.featured)
  const categoryLookup = (config.categories || []).map((category) => ({
    ...category,
    count: posts.filter((post) => post.category === category.slug).length
  })).filter((category) => category.count > 0)
  const latestPublishDate = posts[0]?.publishDate

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-white py-20">
          <div className="container-custom">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-full border border-gray-200 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                AI Photo Prompt Lab Blog
              </span>
              <h1 className="mt-6 font-display text-4xl text-gray-900 sm:text-5xl">
                Stories and strategies for better prompts
              </h1>
              <p className="mt-4 text-base text-gray-600 sm:text-lg">
                Deep dives, tutorials, and curated updates to help you ship smarter Gemini AI photo workflows. Fresh insights every week from the AI Photo Prompt Lab team and community experts.
              </p>
              <p className="mt-3 text-sm text-gray-500">
                {totalPosts} articles · Updated {latestPublishDate ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(latestPublishDate)) : 'regularly'}
              </p>
              {categoryLookup.length > 0 && (
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {categoryLookup.map((category) => (
                    <span
                      key={category.slug}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600"
                    >
                      {category.title}
                      <span className="text-gray-400">({category.count})</span>
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/prompts"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
                >
                  Explore prompts
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="#articles"
                  className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-gray-900 bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
                >
                  Read the latest
                  <span aria-hidden>↓</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {featuredPosts.length > 0 && (
          <section className="border-t border-gray-200 bg-gray-50 py-20">
            <div className="container-custom">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Editor’s picks</span>
                  <h2 className="mt-2 font-display text-3xl text-gray-900">Featured reads</h2>
                </div>
                <p className="max-w-xl text-sm text-gray-600">
                  Hand-picked tutorials and deep dives to take your prompt engineering to the next level.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {featuredPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="articles" className="bg-white py-20">
          <div className="container-custom">
            <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">All articles</span>
                <h2 className="mt-2 font-display text-3xl text-gray-900">Latest from the blog</h2>
              </div>
              <p className="max-w-xl text-sm text-gray-600">
                Stay ahead with actionable guides, prompt libraries, and AI product updates straight from our team.
              </p>
            </div>
            <BlogGrid posts={regularPosts.length > 0 ? regularPosts : posts} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
