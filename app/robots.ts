import type { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = `${SITE_CONFIG.url.replace(/\/$/, '')}/sitemap.xml`

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: sitemapUrl,
  }
}
