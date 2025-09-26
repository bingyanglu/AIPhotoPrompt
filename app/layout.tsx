import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import type { Metadata } from 'next'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'AI Photo Prompt Lab – Gemini AI Photo Prompts & Guides',
  description: 'Explore curated Gemini AI photo prompts and practical guides. Copy & paste templates, tutorials, and insights to elevate your creative workflow.',
  keywords: ['gemini ai photo prompts', 'copy paste prompts', 'ai photo prompt library', 'prompt guides', 'ai photography'],
  authors: [{ name: 'AI Photo Prompt Lab Team' }],
  creator: 'AI Photo Prompt Lab',
  publisher: 'AI Photo Prompt Lab',
  alternates: {
    canonical: 'https://www.aiphotoprompt.net',
  },
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.aiphotoprompt.net',
    title: 'AI Photo Prompt Lab – Gemini AI Photo Prompts & Guides',
    description: 'Explore curated Gemini AI photo prompts and practical guides. Copy & paste templates, tutorials, and insights to elevate your creative workflow.',
    siteName: 'AI Photo Prompt Lab',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Photo Prompt Lab – Gemini AI Photo Prompts & Guides',
    description: 'Explore curated Gemini AI photo prompts and practical guides. Copy & paste templates, tutorials, and insights to elevate your creative workflow.',
    creator: '@AIPhotoPromptLab',
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Z7RJH0N7PD"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Z7RJH0N7PD');
          `}
        </Script>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
