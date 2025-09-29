import { Metadata } from 'next'
import { SEOMetadata, PageMetadata } from './types'

// ========================================
// Default SEO configuration
// ========================================

export const DEFAULT_SEO: SEOMetadata = {
  title: 'Get Smarter About Gemini AI - AI Photo Prompt Lab',
  description: 'Join 10,000+ creators and get weekly Gemini AI photo prompt templates, guides, and product updates.',
  keywords: ['Gemini AI photo prompts', 'AI photography prompts', 'prompt engineering', 'AI photo guides'],
  author: 'AI Photo Prompt Lab Team',
  canonicalUrl: 'https://www.aiphotoprompt.net',
  ogImage: 'https://www.aiphotoprompt.net/images/og-image.png',
  ogType: 'website',
  twitterCard: 'summary_large_image'
}

export const SITE_CONFIG = {
  name: 'AI Photo Prompt Lab',
  url: 'https://www.aiphotoprompt.net',
  description: DEFAULT_SEO.description,
  twitter: '@AIPhotoPromptLab',
  facebook: 'https://www.facebook.com/aiphotopromptlab',
  instagram: 'https://instagram.com/aiphotopromptlab',
  newsletter: 'https://socialprompt.substack.com/'
}

// ========================================
// SEO utility functions
// ========================================

/**
 * Generate full SEO metadata for a page
 */
export function generateSEOMetadata(
  pageData: Partial<SEOMetadata> & { 
    path?: string 
    publishDate?: string
    lastModified?: string
  }
): Metadata {
  const title = pageData.title 
    ? `${pageData.title} - ${SITE_CONFIG.name}`
    : DEFAULT_SEO.title
    
  const description = pageData.description || DEFAULT_SEO.description
  const canonicalUrl = pageData.path 
    ? `${SITE_CONFIG.url}${pageData.path}`
    : pageData.canonicalUrl || DEFAULT_SEO.canonicalUrl
    
  const ogImage = pageData.ogImage || DEFAULT_SEO.ogImage
  const keywords = pageData.keywords || DEFAULT_SEO.keywords

  return {
    title,
    description,
    keywords: typeof keywords === 'string' ? keywords : keywords?.join(', '),
    authors: [{ name: pageData.author || DEFAULT_SEO.author }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    
    // Open Graph
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: ogImage || '/images/og-default.png',
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      locale: 'en_US',
      type: pageData.ogType || DEFAULT_SEO.ogType,
      ...(pageData.publishDate && { publishedTime: pageData.publishDate }),
      ...(pageData.lastModified && { modifiedTime: pageData.lastModified }),
    },
    
    // Twitter
    twitter: {
      card: pageData.twitterCard || DEFAULT_SEO.twitterCard,
      title,
      description,
      creator: SITE_CONFIG.twitter,
      images: ogImage ? [ogImage] : [],
    },
    
    // Additional meta tags
    other: {
      ...(pageData.author && { 'article:author': pageData.author }),
      'article:publisher': SITE_CONFIG.name,
      ...(pageData.publishDate && { 'article:published_time': pageData.publishDate }),
      ...(pageData.lastModified && { 'article:modified_time': pageData.lastModified }),
    },
    
    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },
    
    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

/**
 * Generate SEO metadata for blog posts
 */
export function generateBlogSEO(post: {
  title: string
  description: string
  slug: string
  author?: string
  publishDate?: string
  tags?: string[]
  coverImage?: string
}): Metadata {
  return generateSEOMetadata({
    title: post.title,
    description: post.description,
    author: post.author,
    path: `/blog/${post.slug}`,
    publishDate: post.publishDate,
    keywords: post.tags,
    ogImage: post.coverImage,
    ogType: 'article'
  })
}

/**
 * Generate SEO metadata for prompt pages
 */
export function generatePromptSEO(prompt: {
  title: string
  description: string
  category: string
  slug: string
  tags?: string[]
}): Metadata {
  const keywords = [
    ...DEFAULT_SEO.keywords!,
    ...prompt.tags || [],
    prompt.category,
    'prompt',
    'template'
  ].filter(Boolean)

  return generateSEOMetadata({
    title: `${prompt.title} - Gemini Prompt`,
    description: prompt.description,
    path: `/prompts/${prompt.category}/${prompt.slug}`,
    keywords,
    ogType: 'website'
  })
}

/**
 * Generate structured data (JSON-LD)
 */
export function generateStructuredData(type: 'website' | 'article' | 'organization', data: any) {
  const baseSchema = {
    '@context': 'https://schema.org',
  }

  switch (type) {
    case 'website':
      return {
        ...baseSchema,
        '@type': 'WebSite',
        name: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }

    case 'article':
      return {
        ...baseSchema,
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image,
        author: {
          '@type': 'Person',
          name: data.author || DEFAULT_SEO.author
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_CONFIG.name,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_CONFIG.url}/images/logo.png`
          }
        },
        datePublished: data.publishDate,
        dateModified: data.lastModified || data.publishDate,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url
        }
      }

    case 'organization':
      return {
        ...baseSchema,
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/images/logo.png`,
        sameAs: [
          SITE_CONFIG.twitter.replace('@', 'https://twitter.com/'),
          SITE_CONFIG.facebook,
          SITE_CONFIG.instagram
        ].filter(Boolean)
      }

    default:
      return baseSchema
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  }
}

/**
 * Validate SEO data integrity
 */
export function validateSEOData(data: Partial<SEOMetadata>): {
  isValid: boolean
  warnings: string[]
  errors: string[]
} {
  const warnings: string[] = []
  const errors: string[] = []

  // Required field checks
  if (!data.title) errors.push('Title is required')
  if (!data.description) errors.push('Description is required')

  // Length checks
  if (data.title && data.title.length > 60) {
    warnings.push('Title is longer than 60 characters')
  }
  if (data.description && data.description.length > 160) {
    warnings.push('Description is longer than 160 characters')
  }
  if (data.title && data.title.length < 30) {
    warnings.push('Title might be too short (less than 30 characters)')
  }

  // Keyword checks
  if (data.keywords && Array.isArray(data.keywords) && data.keywords.length === 0) {
    warnings.push('No keywords specified')
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors
  }
}

/**
 * Generate URL list for sitemap
 */
export async function generateSitemapUrls(): Promise<Array<{
  url: string
  lastModified: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}>> {
  const urls = [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1.0
    },
    {
      url: `${SITE_CONFIG.url}/prompts`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    },
    {
      url: `${SITE_CONFIG.url}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.7
    }
  ]

  return urls
}
