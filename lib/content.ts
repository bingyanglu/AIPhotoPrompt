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
  SearchResult
} from './types'

// ========================================
// 路径配置
// ========================================

const CONTENT_DIR = path.join(process.cwd(), 'content')
const BLOG_DIR = path.join(CONTENT_DIR, 'blog')
const PROMPTS_DIR = path.join(CONTENT_DIR, 'prompts')
const RESOURCES_DIR = path.join(CONTENT_DIR, 'resources')

// ========================================
// JSON 配置读取工具
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
// 博客内容管理
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
      return dateB.getTime() - dateA.getTime() // 最新的在前
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
    
    // 读取 Markdown 内容
    const postPath = path.join(BLOG_DIR, 'posts', `${slug}.md`)
    
    if (!fs.existsSync(postPath)) {
      console.warn(`Markdown file not found for post: ${slug}`)
      return postMeta // 返回元数据，没有内容
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
// 提示词内容管理
// ========================================

export async function getPromptConfig(): Promise<PromptConfig> {
  const configPath = path.join(PROMPTS_DIR, 'config', 'prompts-meta.json')
  return readJSONConfig<PromptConfig>(configPath)
}

export async function getPrompts(): Promise<Prompt[]> {
  try {
    const config = await getPromptConfig()
    return config.prompts.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return a.title.localeCompare(b.title)
    })
  } catch (error) {
    console.error('Error getting prompts:', error)
    return []
  }
}

export async function getPrompt(slug: string): Promise<Prompt | null> {
  try {
    const prompts = await getPrompts()
    const promptMeta = prompts.find(prompt => prompt.slug === slug)
    
    if (!promptMeta) {
      return null
    }
    
    // 尝试读取 Markdown 内容
    const promptPath = path.join(PROMPTS_DIR, 'docs', `${slug}.md`)
    
    if (fs.existsSync(promptPath)) {
      const { htmlContent } = await parseMarkdownFile(promptPath)
      return promptMeta
    }
    
    return promptMeta
  } catch (error) {
    console.error(`Error getting prompt ${slug}:`, error)
    return null
  }
}

export async function getPromptsByCategory(category: string): Promise<Prompt[]> {
  const prompts = await getPrompts()
  return prompts.filter(prompt => prompt.category === category)
}

export async function getPromptCategories() {
  try {
    const config = await getPromptConfig()
    return config.categories || []
  } catch (error) {
    console.error('Error getting prompt categories:', error)
    return []
  }
}

// ========================================
// 资源内容管理
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
// 通用内容查询
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
    
    // 应用过滤器
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
    
    // 排序
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
    
    // 分页
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
// 搜索功能
// ========================================

export async function searchContent(searchQuery: string): Promise<SearchResult<any>> {
  const startTime = Date.now()
  
  try {
    // 获取所有内容
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
    
    // 简单的文本搜索
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
// 缓存工具 (简单的内存缓存)
// ========================================

const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 分钟

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
// 站点地图生成
// ========================================

export async function generateSitemap(): Promise<string[]> {
  try {
    const urls: string[] = []
    
    // 静态页面
    urls.push('/', '/prompts', '/blog')
    
    // 博客文章
    const posts = await getBlogPosts()
    posts.forEach(post => {
      urls.push(`/blog/${post.slug}`)
    })
    
    // 提示词分类和详情
    const categories = await getPromptCategories()
    categories.forEach(category => {
      urls.push(`/prompts/${category.slug}`)
    })
    
    const prompts = await getPrompts()
    prompts.forEach(prompt => {
      urls.push(`/prompts/${prompt.category}/${prompt.slug}`)
    })
    
    return urls
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return []
  }
}
