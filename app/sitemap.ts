import type { MetadataRoute } from 'next'
import { generateSitemap } from '@/lib/content'
import { SITE_CONFIG } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url.replace(/\/$/, '')
  const paths = await generateSitemap()
  const uniquePaths = Array.from(new Set(paths))
  const lastModified = new Date().toISOString()

  return uniquePaths.map((path) => ({
    url: path.startsWith('http') ? path : `${baseUrl}${path}`,
    lastModified,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))
}
