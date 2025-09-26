// ========================================
// 基础类型定义
// ========================================

export interface BaseContent {
  slug: string
  title: string
  description: string
  publishDate?: string
  lastModified?: string
  featured?: boolean
  tags?: string[]
  seoTitle?: string
  seoDescription?: string
}

// ========================================
// 博客相关类型
// ========================================

export interface BlogPost extends BaseContent {
  author: string
  readTime: string
  category: string
  content?: string
  excerpt?: string
  coverImage?: string
}

export interface BlogCategory {
  slug: string
  title: string
  description: string
  count?: number
}

export interface BlogConfig {
  posts: BlogPost[]
  categories?: BlogCategory[]
}

// ========================================
// 提示词相关类型
// ========================================

export interface PromptExample {
  input: string
  output: string
}

export interface Prompt extends BaseContent {
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  useCase: string
  template: string
  example?: PromptExample
  variables?: string[]
  coverImage?: string
}

export interface PromptCategory {
  slug: string
  title: string
  description: string
  icon: string
  color: 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'indigo'
  count?: number
}

export interface PromptCategorySummary extends PromptCategory {
  subcategories: string[]
  promptCount: number
  prompts: Prompt[]
}

export interface PromptConfig {
  categories: PromptCategory[]
  prompts: Prompt[]
}

// ========================================
// 资源相关类型
// ========================================

export interface Resource extends BaseContent {
  type: 'tutorial' | 'tool' | 'article' | 'video' | 'course' | 'community'
  url?: string
  isExternal?: boolean
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  isPaid?: boolean
  content?: string
}

export interface ResourceCategory {
  slug: string
  title: string
  description: string
  icon?: string
  count?: number
}

export interface ResourceConfig {
  resources: Resource[]
  categories?: ResourceCategory[]
}

// ========================================
// SEO 和元数据类型
// ========================================

export interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  author?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  twitterCard?: 'summary' | 'summary_large_image'
  schema?: Record<string, any>
}

export interface PageMetadata extends SEOMetadata {
  lastModified?: string
  publishDate?: string
}

// ========================================
// 导航和菜单类型
// ========================================

export interface NavItem {
  label: string
  href: string
  icon?: string
  isExternal?: boolean
  children?: NavItem[]
}

export interface FooterLink {
  label: string
  href: string
  isExternal?: boolean
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

// ========================================
// 内容管理系统类型
// ========================================

export interface ContentConfig {
  blog?: BlogConfig
  prompts?: PromptConfig
  resources?: ResourceConfig
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter?: string
    github?: string
    facebook?: string
    instagram?: string
    linkedin?: string
    newsletter?: string
  }
  navigation: NavItem[]
  footer: FooterSection[]
}

// ========================================
// API 响应类型
// ========================================

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface SearchResult<T> {
  results: T[]
  query: string
  total: number
  took: number
}

// ========================================
// 表单和用户交互类型
// ========================================

export interface NewsletterSubscription {
  email: string
  source?: string
  timestamp?: string
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

// ========================================
// 错误处理类型
// ========================================

export interface APIError {
  code: string
  message: string
  details?: any
}

export interface ContentError extends Error {
  code: 'CONTENT_NOT_FOUND' | 'CONTENT_PARSE_ERROR' | 'CONTENT_VALIDATION_ERROR'
  path?: string
}

// ========================================
// 工具函数类型
// ========================================

export type ContentType = 'blog' | 'prompt' | 'resource'

export interface ContentQuery {
  type: ContentType
  category?: string
  tag?: string
  featured?: boolean
  limit?: number
  offset?: number
  sortBy?: 'publishDate' | 'title' | 'featured'
  sortOrder?: 'asc' | 'desc'
}

export interface SlugParams {
  slug: string
}

export interface CategoryParams {
  category: string
  slug?: string
}
