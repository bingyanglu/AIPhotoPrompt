import Link from 'next/link'
import type { BlogPost } from '@/lib/types'

interface BlogCardProps {
  post: BlogPost
  className?: string
}

const formatDate = (date?: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function BlogCard({ post, className = '' }: BlogCardProps) {
  const displayDate = formatDate(post.publishDate)
  const dateLabel = displayDate ? displayDate.toUpperCase() : ''
  const readTimeLabel = post.readTime ? ` • ${post.readTime.toUpperCase()}` : ''
  const borderState = post.featured ? 'border-gray-900' : 'border-transparent'

  return (
    <Link href={`/blog/${post.slug}`} className={`group block h-full ${className}`}>
      <article className={`flex h-full flex-col rounded-xl border-2 ${borderState} bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md`}>
        <div className="overflow-hidden rounded-lg">
          <div className="aspect-[16/9] w-full overflow-hidden bg-gray-200">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 text-white">
                <svg
                  className="h-12 w-12 opacity-80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6l4 2"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-1 flex-col gap-4">
          <div className="text-xs font-semibold uppercase tracking-[0.32em] text-gray-500">
            {dateLabel}
            {readTimeLabel}
          </div>

          <h3 className="font-display text-2xl leading-snug text-gray-900 transition-colors duration-200 group-hover:text-gray-700">
            {post.title}
          </h3>

          <p className="mt-auto text-sm text-gray-600 line-clamp-3">
            {post.excerpt || post.description}
          </p>
        </div>
      </article>
    </Link>
  )
}

/**
 * 博客文章网格容器
 */
export function BlogGrid({ 
  posts, 
  className = '' 
}: { 
  posts: BlogPost[]
  className?: string 
}) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
        <p className="text-gray-500">Check back later for new articles and insights.</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 ${className}`}>
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  )
}

/**
 * 紧凑版博客卡片，用于列表视图
 */
export function CompactBlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group flex items-center gap-4 rounded-lg border-2 border-gray-900 bg-white p-4 transition-colors duration-200 hover:bg-gray-50">
        {/* Thumbnail */}
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-500">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Meta */}
          <div className="mb-1 flex items-center space-x-2 text-xs text-gray-500">
            <time>{new Date(post.publishDate || '').toLocaleDateString()}</time>
            <span>•</span>
            <span>{post.readTime}</span>
            {post.featured && (
              <>
                <span>•</span>
                <span className="font-medium text-gray-900">Featured</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display text-lg text-gray-900 transition-colors duration-200 group-hover:text-gray-700 line-clamp-1">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {post.excerpt || post.description}
          </p>
        </div>

        {/* Arrow */}
        <span className="flex-shrink-0 text-lg text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-gray-600" aria-hidden>
          →
        </span>
      </article>
    </Link>
  )
}
