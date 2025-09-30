import fs from 'fs'
import path from 'path'
import {
  parseMarkdownFile,
  parseMarkdownDirectory,
  validateFrontmatter,
  generateContentMetadata
} from './mdx'
import {
  BlogPost,
  Prompt,
  Resource,
  BlogConfig,
  PromptConfig,
  ResourceConfig,
  ContentQuery,
  SearchResult,
  PromptCategory
} from './types'
import { getSupabaseClient, isSupabaseConfigured } from './supabase/client'

// ========================================
// Path configuration
// ========================================

const CONTENT_DIR = path.join(process.cwd(), 'content')
const BLOG_DIR = path.join(CONTENT_DIR, 'blog')
const PROMPTS_DIR = path.join(CONTENT_DIR, 'prompts')
const RESOURCES_DIR = path.join(CONTENT_DIR, 'resources')

// ========================================
// JSON config helpers
// ========================================

async function readJSONConfig<T>(filePath: string): Promise<T> {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Config file not found: ${filePath}`)
    }
    
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content) as T
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error(`Failed to read JSON config: ${filePath}`)
  }
}

// ========================================
// Blog content management
// ========================================

export async function getBlogConfig(): Promise<BlogConfig> {
  const configPath = path.join(BLOG_DIR, 'config', 'posts-meta.json')
  return readJSONConfig<BlogConfig>(configPath)
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const config = await getBlogConfig()
    return config.posts.sort((a, b) => {
      const dateA = new Date(a.publishDate || '')
      const dateB = new Date(b.publishDate || '')
      return dateB.getTime() - dateA.getTime() // latest first
    })
  } catch (error) {
    console.error('Error getting blog posts:', error)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await getBlogPosts()
    const postMeta = posts.find(post => post.slug === slug)
    
    if (!postMeta) {
      return null
    }
    
    // Read Markdown content
    const postPath = path.join(BLOG_DIR, 'posts', `${slug}.md`)
    
    if (!fs.existsSync(postPath)) {
      console.warn(`Markdown file not found for post: ${slug}`)
      return postMeta // return metadata when no content is found
    }
    
    const { frontmatter, htmlContent, rawContent } = await parseMarkdownFile(postPath)
    const metadata = generateContentMetadata(frontmatter, rawContent)
    
    return {
      ...postMeta,
      content: htmlContent,
      excerpt: metadata.excerpt,
      readTime: metadata.readingTime
    }
  } catch (error) {
    console.error(`Error getting blog post ${slug}:`, error)
    return null
  }
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const posts = await getBlogPosts()
  return posts.filter(post => post.featured)
}

// ========================================
// Prompt content management
// ========================================

async function getPromptCategoriesFromSupabase(): Promise<PromptCategory[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('prompt_categories')
    .select('slug, title, description, icon, color, display_order')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Supabase error fetching prompt categories:', error)
    throw error
  }

  return (data ?? []).map((category) => ({
    slug: category.slug,
    title: category.title,
    description: category.description ?? '',
    icon: category.icon ?? '✨',
    color: (category.color ?? 'blue') as PromptCategory['color']
  }))
}

export async function getPromptCategories(): Promise<PromptCategory[]> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured; returning empty prompt categories list.')
    return []
  }

  try {
    return await getPromptCategoriesFromSupabase()
  } catch (error) {
    console.error('Error getting prompt categories from Supabase:', error)
    return []
  }
}

type PromptRow = {
  slug: string
  title: string
  description: string | null
  template: string
  cover_image: string | null
  use_case: string | null
  difficulty: string | null
  tags: string[] | null
  featured: boolean | null
  copy_count: number | null
  created_at: string | null
  prompt_categories: { slug: string }[] | { slug: string } | null
}

function mapPromptRowToPrompt(row: PromptRow): Prompt {
  const categorySlug = Array.isArray(row.prompt_categories)
    ? row.prompt_categories[0]?.slug ?? ''
    : row.prompt_categories?.slug ?? ''

  return {
    slug: row.slug,
    title: row.title,
    description: row.description ?? '',
    template: row.template,
    coverImage: row.cover_image ?? undefined,
    category: categorySlug,
    useCase: row.use_case ?? '',
    difficulty: (row.difficulty ?? 'beginner') as Prompt['difficulty'],
    tags: row.tags ?? [],
    featured: row.featured ?? false,
    copyCount: row.copy_count ?? 0,
    createdAt: row.created_at ?? undefined
  }
}

async function getPromptsFromSupabase(): Promise<Prompt[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('prompts')
    .select(`
      slug,
      title,
      description,
      template,
      cover_image,
      use_case,
      difficulty,
      tags,
      featured,
      copy_count,
      created_at,
      prompt_categories:prompt_categories!inner ( slug )
    `)
    .order('featured', { ascending: false })
    .order('title', { ascending: true })

  if (error) {
    console.error('Supabase error fetching prompts:', error)
    throw error
  }

  const rows = (data ?? []) as PromptRow[]

  return rows.map(mapPromptRowToPrompt)
}

export async function getPrompts(): Promise<Prompt[]> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured; returning empty prompts list.')
    return []
  }

  try {
    return await getPromptsFromSupabase()
  } catch (error) {
    console.error('Error getting prompts from Supabase:', error)
    return []
  }
}

export async function getPrompt(slug: string): Promise<Prompt | null> {
  if (!isSupabaseConfigured) {
    console.warn(`Supabase is not configured; unable to load prompt: ${slug}`)
    return null
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('prompts')
      .select(`
        slug,
        title,
        description,
        template,
        cover_image,
        use_case,
        difficulty,
        tags,
        featured,
        copy_count,
        created_at,
        prompt_categories:prompt_categories!inner ( slug )
      `)
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      console.error(`Supabase error fetching prompt ${slug}:`, error)
      return null
    }

    const row = (data ?? null) as PromptRow | null
    if (!row) {
      return null
    }

    const promptMeta = mapPromptRowToPrompt(row)

    const promptPath = path.join(PROMPTS_DIR, 'docs', `${slug}.md`)
    if (fs.existsSync(promptPath)) {
      await parseMarkdownFile(promptPath)
    }

    return promptMeta
  } catch (error) {
    console.error(`Error getting prompt ${slug} from Supabase:`, error)
    return null
  }
}

export async function getPromptsByCategory(category: string): Promise<Prompt[]> {
  const prompts = await getPrompts()
  return prompts.filter((prompt) => prompt.category === category)
}

export async function getLatestPrompts(limit = 6): Promise<Prompt[]> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured; returning empty latest prompts list.')
    return []
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('prompts')
      .select(`
        slug,
        title,
        description,
        template,
        cover_image,
        use_case,
        difficulty,
        tags,
        featured,
        copy_count,
        created_at,
        prompt_categories:prompt_categories!inner ( slug )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Supabase error fetching latest prompts:', error)
      return []
    }

    const rows = (data ?? []) as PromptRow[]
    return rows.map(mapPromptRowToPrompt)
  } catch (error) {
    console.error('Error getting latest prompts from Supabase:', error)
    return []
  }
}

export async function getPromptConfig(): Promise<PromptConfig> {
  const [categories, prompts] = await Promise.all([
    getPromptCategories(),
    getPrompts()
  ])

  return {
    categories,
    prompts
  }
}

// ========================================
// Resource content management
// ========================================

export async function getResourceConfig(): Promise<ResourceConfig> {
  const configPath = path.join(RESOURCES_DIR, 'config', 'resources-meta.json')
  return readJSONConfig<ResourceConfig>(configPath)
}

export async function getResources(): Promise<Resource[]> {
  try {
    const config = await getResourceConfig()
    return config.resources.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return a.title.localeCompare(b.title)
    })
  } catch (error) {
    console.error('Error getting resources:', error)
    return []
  }
}

// ========================================
// Generic content query
// ========================================

export async function queryContent(query: ContentQuery): Promise<any[]> {
  try {
    let content: any[] = []
    
    switch (query.type) {
      case 'blog':
        content = await getBlogPosts()
        break
      case 'prompt':
        content = await getPrompts()
        break
      case 'resource':
        content = await getResources()
        break
      default:
        return []
    }
    
    // Apply filters
    if (query.category) {
      content = content.filter(item => item.category === query.category)
    }
    
    if (query.tag) {
      content = content.filter(item => 
        item.tags && item.tags.includes(query.tag)
      )
    }
    
    if (query.featured !== undefined) {
      content = content.filter(item => item.featured === query.featured)
    }
    
    // Sorting
    if (query.sortBy) {
      content.sort((a, b) => {
        const aValue = a[query.sortBy!]
        const bValue = b[query.sortBy!]
        
        if (query.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1
        }
        return aValue > bValue ? 1 : -1
      })
    }
    
    // Pagination
    if (query.offset !== undefined || query.limit !== undefined) {
      const offset = query.offset || 0
      const limit = query.limit || 10
      content = content.slice(offset, offset + limit)
    }
    
    return content
  } catch (error) {
    console.error('Error querying content:', error)
    return []
  }
}

// ========================================
// Search functionality
// ========================================

export async function searchContent(searchQuery: string): Promise<SearchResult<any>> {
  const startTime = Date.now()
  
  try {
    // Fetch all content
    const [blogs, prompts, resources] = await Promise.all([
      getBlogPosts(),
      getPrompts(),
      getResources()
    ])
    
    const allContent = [
      ...blogs.map(item => ({ ...item, type: 'blog' })),
      ...prompts.map(item => ({ ...item, type: 'prompt' })),
      ...resources.map(item => ({ ...item, type: 'resource' }))
    ]
    
    // Simple text search
    const searchTerms = searchQuery.toLowerCase().split(' ')
    const results = allContent.filter(item => {
      const searchText = `${item.title} ${item.description} ${item.tags?.join(' ') || ''}`.toLowerCase()
      return searchTerms.some(term => searchText.includes(term))
    })
    
    const took = Date.now() - startTime
    
    return {
      results,
      query: searchQuery,
      total: results.length,
      took
    }
  } catch (error) {
    console.error('Error searching content:', error)
    return {
      results: [],
      query: searchQuery,
      total: 0,
      took: Date.now() - startTime
    }
  }
}

// ========================================
// Cache helpers (simple in-memory cache)
// ========================================

const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCacheKey(...parts: string[]): string {
  return parts.join(':')
}

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (!cached) return null
  
  const isExpired = Date.now() - cached.timestamp > CACHE_TTL
  if (isExpired) {
    cache.delete(key)
    return null
  }
  
  return cached.data as T
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// ========================================
// Sitemap generation
// ========================================

export async function generateSitemap(): Promise<string[]> {
  try {
    const urls = new Set<string>()

    // Static pages that exist in the app router
    urls.add('/')
    urls.add('/prompts')
    urls.add('/blog')
    urls.add('/legal/privacy-policy')
    urls.add('/legal/terms-of-service')

    // Blog posts
    const posts = await getBlogPosts()
    posts.forEach((post) => {
      urls.add(`/blog/${post.slug}`)
    })

    return Array.from(urls)
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return []
  }
}
