import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'
import fs from 'fs'
import path from 'path'
// Import removed to fix build issue

// ========================================
// Markdown processing configuration
// ========================================

const processor = remark()
  .use(remarkGfm) // GitHub Flavored Markdown support
  .use(remarkHtml, { 
    sanitize: false, // allow HTML tags for richer content
    allowDangerousHtml: true 
  })

// ========================================
// File system helpers
// ========================================

/**
 * Check whether a file exists
 */
export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath)
  } catch {
    return false
  }
}

/**
 * Get all Markdown files in a directory
 */
export function getMarkdownFiles(dirPath: string): string[] {
  try {
    if (!fs.existsSync(dirPath)) {
      return []
    }
    
    return fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
      .map(file => path.join(dirPath, file))
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error)
    return []
  }
}

/**
 * Derive slug from filename
 */
export function getSlugFromFilename(filename: string): string {
  return path.basename(filename, path.extname(filename))
}

// ========================================
// Markdown parsing core functions
// ========================================

/**
 * Parse frontmatter and content from Markdown file
 */
export async function parseMarkdownFile<T = Record<string, any>>(
  filePath: string
): Promise<{
  frontmatter: T
  content: string
  rawContent: string
  htmlContent: string
  slug: string
}> {
  try {
    // check if file exists
    if (!fileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    // read file content
    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    // parse frontmatter
    const { data: frontmatter, content: rawContent } = matter(fileContent)
    
    // convert Markdown to HTML
    const processedContent = await processor.process(rawContent)
    const htmlContent = processedContent.toString()
    
    // derive slug
    const slug = frontmatter.slug || getSlugFromFilename(filePath)
    
    return {
      frontmatter: frontmatter as T,
      content: rawContent,
      rawContent,
      htmlContent,
      slug
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error(`Failed to parse markdown file: ${filePath}`)
  }
}

/**
 * Parse every Markdown file under a directory
 */
export async function parseMarkdownDirectory<T = Record<string, any>>(
  dirPath: string
): Promise<Array<{
  frontmatter: T
  content: string
  rawContent: string
  htmlContent: string
  slug: string
  filePath: string
}>> {
  try {
    const files = getMarkdownFiles(dirPath)
    const results = []
    
    for (const filePath of files) {
      try {
        const parsed = await parseMarkdownFile<T>(filePath)
        results.push({
          ...parsed,
          filePath
        })
      } catch (error) {
        console.error(`Error parsing file ${filePath}:`, error)
        // Continue processing remaining files even if one fails
        continue
      }
    }
    
    return results
  } catch (error) {
    throw new Error(`Failed to parse markdown directory: ${dirPath}`)
  }
}

// ========================================
// Content processing utilities
// ========================================

/**
 * Extract content excerpt
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove Markdown syntax
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // remove heading markers
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold markers
    .replace(/\*(.*?)\*/g, '$1') // remove italic markers
    .replace(/`(.*?)`/g, '$1') // remove code markers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove links keep text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // remove images
    .replace(/\n+/g, ' ') // replace line breaks with spaces
    .trim()
  
  // Trim to desired length
  if (plainText.length <= maxLength) {
    return plainText
  }
  
  const excerpt = plainText.substring(0, maxLength)
  const lastSpaceIndex = excerpt.lastIndexOf(' ')
  
  return lastSpaceIndex > 0 
    ? excerpt.substring(0, lastSpaceIndex) + '...'
    : excerpt + '...'
}

/**
 * Calculate reading time (based on 200 words/minute)
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  
  return `${minutes} min read`
}

/**
 * Extract headings from content (for TOC)
 */
export function extractHeadings(content: string): Array<{
  level: number
  text: string
  id: string
}> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings = []
  let match
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    
    headings.push({ level, text, id })
  }
  
  return headings
}

/**
 * Validate required frontmatter fields
 */
export function validateFrontmatter<T>(
  frontmatter: any,
  requiredFields: string[]
): T {
  for (const field of requiredFields) {
    if (!frontmatter[field]) {
      throw new Error(`Missing required frontmatter field: ${field}`)
    }
  }
  
  return frontmatter as T
}

/**
 * Format date
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

/**
 * Generate metadata for content
 */
export function generateContentMetadata(
  frontmatter: any,
  content: string
): {
  wordCount: number
  readingTime: string
  excerpt: string
  headings: Array<{ level: number; text: string; id: string }>
  lastModified: string
} {
  return {
    wordCount: content.split(/\s+/).length,
    readingTime: calculateReadingTime(content),
    excerpt: frontmatter.description || extractExcerpt(content),
    headings: extractHeadings(content),
    lastModified: new Date().toISOString()
  }
}

