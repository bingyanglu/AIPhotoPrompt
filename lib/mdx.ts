import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'
import fs from 'fs'
import path from 'path'
// Import removed to fix build issue

// ========================================
// Markdown 处理配置
// ========================================

const processor = remark()
  .use(remarkGfm) // GitHub Flavored Markdown support
  .use(remarkHtml, { 
    sanitize: false, // 允许 HTML 标签，用于更丰富的内容
    allowDangerousHtml: true 
  })

// ========================================
// 文件系统工具函数
// ========================================

/**
 * 检查文件是否存在
 */
export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath)
  } catch {
    return false
  }
}

/**
 * 获取目录下所有 Markdown 文件
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
 * 从文件名获取 slug
 */
export function getSlugFromFilename(filename: string): string {
  return path.basename(filename, path.extname(filename))
}

// ========================================
// Markdown 解析核心函数
// ========================================

/**
 * 解析 Markdown 文件的 frontmatter 和内容
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
    // 检查文件是否存在
    if (!fileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    // 解析 frontmatter
    const { data: frontmatter, content: rawContent } = matter(fileContent)
    
    // 将 Markdown 转换为 HTML
    const processedContent = await processor.process(rawContent)
    const htmlContent = processedContent.toString()
    
    // 获取 slug
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
 * 批量解析目录下的所有 Markdown 文件
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
        // 继续处理其他文件，不因单个文件错误而终止
        continue
      }
    }
    
    return results
  } catch (error) {
    throw new Error(`Failed to parse markdown directory: ${dirPath}`)
  }
}

// ========================================
// 内容处理工具函数
// ========================================

/**
 * 提取内容摘要
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  // 移除 Markdown 语法
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // 移除标题标记
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
    .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
    .replace(/`(.*?)`/g, '$1') // 移除代码标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .replace(/\n+/g, ' ') // 替换换行为空格
    .trim()
  
  // 截取指定长度
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
 * 计算阅读时间（基于平均阅读速度 200 词/分钟）
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  
  return `${minutes} min read`
}

/**
 * 从内容中提取标题列表（用于目录生成）
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
 * 验证 frontmatter 必需字段
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
 * 格式化日期
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
 * 生成内容的元数据
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

