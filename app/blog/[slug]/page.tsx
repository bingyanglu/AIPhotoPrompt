import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogCard from '@/components/BlogCard'
import { getBlogPost, getBlogPosts, getPrompts } from '@/lib/content'
import { generateBlogSEO } from '@/lib/seo'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Article not found - AI Photo Prompt Lab',
      alternates: {
        canonical: 'https://www.aiphotoprompt.net/blog',
      },
    }
  }

  return generateBlogSEO({
    title: post.title,
    description: post.description,
    slug: post.slug,
    author: post.author,
    publishDate: post.publishDate,
    tags: post.tags,
    coverImage: post.coverImage,
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const allPosts = await getBlogPosts()
  const related = allPosts.filter((item) => item.slug !== post.slug).slice(0, 3)
  const promptPool = await getPrompts()
  const recommendedPrompts = [...promptPool]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(3, promptPool.length))

  const formattedDate = post.publishDate
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(post.publishDate))
    : null

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <article className="border-b border-gray-200 bg-white">
          <div className="container-custom max-w-3xl py-16">
            <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
              <ol className="flex items-center space-x-3">
                <li>
                  <Link href="/" className="text-gray-500 transition-colors hover:text-gray-900">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/
                </li>
                <li>
                  <Link href="/blog" className="text-gray-500 transition-colors hover:text-gray-900">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">/
                </li>
                <li className="font-medium text-gray-900">{post.title}</li>
              </ol>
            </nav>

            <header className="mt-8 space-y-6">
              <span className="inline-flex items-center rounded-full border border-gray-200 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                {post.category?.toUpperCase() || 'BLOG'}
              </span>
              <h1 className="font-display text-4xl text-gray-900 sm:text-5xl">
                {post.title}
              </h1>
              <p className="text-lg text-gray-600">
                {post.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span>By {post.author}</span>
                {formattedDate && (
                  <>
                    <span aria-hidden>·</span>
                    <time dateTime={post.publishDate}>{formattedDate}</time>
                  </>
                )}
                {post.readTime && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{post.readTime}</span>
                  </>
                )}
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div
              className="article-content mt-12"
              dangerouslySetInnerHTML={{ __html: post.content || post.description || '' }}
            />
          </div>
        </article>

        {recommendedPrompts.length > 0 && (
          <section className="bg-gray-50 py-20">
            <div className="container-custom">
              <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Prompt picks</span>
                  <h2 className="mt-2 font-display text-3xl text-gray-900">Try these Gemini prompts next</h2>
                </div>
                <Link href="/prompts" className="text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900">
                  Browse all prompts →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {recommendedPrompts.map((prompt) => (
                  <article key={prompt.slug} className="flex h-full flex-col overflow-hidden rounded-lg border-2 border-gray-900 bg-white">
                    {prompt.coverImage && (
                      <Link href={`/prompts#prompt-${prompt.slug}`} className="relative aspect-[4/3] w-full overflow-hidden border-b border-gray-200 bg-gray-100">
                        <img
                          src={prompt.coverImage}
                          alt={prompt.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                        />
                      </Link>
                    )}
                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <div>
                        <h3 className="font-display text-xl text-gray-900">{prompt.title}</h3>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{prompt.description}</p>
                      </div>
                      <div className="mt-auto flex justify-between text-xs text-gray-500">
                        <span className="rounded-full border border-gray-200 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-500">
                          {prompt.useCase || 'Gemini Prompt'}
                        </span>
                        <Link
                          href={`/prompts#prompt-${prompt.slug}`}
                          className="inline-flex items-center gap-1 font-semibold text-gray-900 underline underline-offset-4 transition-colors hover:text-primary-600"
                        >
                          View prompt
                          <span aria-hidden>→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="bg-gray-50 py-20">
            <div className="container-custom">
              <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Keep reading</span>
                  <h2 className="mt-2 font-display text-3xl text-gray-900">More articles from AI Photo Prompt Lab</h2>
                </div>
                <Link href="/blog" className="text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900">
                  View all articles →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {related.map((item) => (
                  <BlogCard key={item.slug} post={item} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
