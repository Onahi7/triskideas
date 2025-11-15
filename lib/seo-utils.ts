import type { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  author?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'blog'
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

const DEFAULT_CONFIG = {
  siteName: 'TRISKIDEAS - The Mind\'s Fruit',
  defaultTitle: 'TRISKIDEAS - The Mind\'s Fruit',
  defaultDescription: 'Explore ideas about human potential, personal development, and making positive change. By Dr. Ferdinand Ibu Ogbaji',
  siteUrl: 'https://triskideas.com',
  author: 'Dr. Ferdinand Ibu Ogbaji',
  defaultImage: '/Gemini_Generated_Image_koz312koz312koz3.png',
  twitter: '@triskideas',
  locale: 'en_US',
  type: 'website' as const
}

export function generateSEOMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    author = DEFAULT_CONFIG.author,
    image = DEFAULT_CONFIG.defaultImage,
    url = DEFAULT_CONFIG.siteUrl,
    type = 'website',
    publishedTime,
    modifiedTime,
    section,
    tags = []
  } = config

  const fullTitle = title === DEFAULT_CONFIG.defaultTitle ? title : `${title} | ${DEFAULT_CONFIG.siteName}`
  const fullUrl = url.startsWith('http') ? url : `${DEFAULT_CONFIG.siteUrl}${url}`
  const fullImage = image.startsWith('http') ? image : `${DEFAULT_CONFIG.siteUrl}${image}`
  
  // Ensure HTTPS for secure image URL (required by WhatsApp)
  const secureImageUrl = fullImage.replace(/^http:/, 'https:')

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: author,
    publisher: DEFAULT_CONFIG.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(DEFAULT_CONFIG.siteUrl),
    alternates: {
      canonical: fullUrl,
    },
    other: {
      // Additional Open Graph tags
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:type': 'image/jpeg',
      'og:image:secure_url': secureImageUrl,
      'og:locale': DEFAULT_CONFIG.locale,
      'og:site_name': DEFAULT_CONFIG.siteName,
      // WhatsApp specific
      'whatsapp:image': secureImageUrl,
      // Facebook specific
      'fb:app_id': process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
      // Twitter specific
      'twitter:image:alt': title,
      'twitter:domain': DEFAULT_CONFIG.siteUrl.replace('https://', ''),
      // Additional meta tags for better sharing
      'article:publisher': DEFAULT_CONFIG.siteName,
      ...(type === 'article' && publishedTime && {
        'article:published_time': publishedTime,
        'article:modified_time': modifiedTime || publishedTime,
        'article:author': author,
        'article:section': section || 'Blog',
        'article:tag': tags.join(', '),
      }),
    },
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      locale: DEFAULT_CONFIG.locale,
      url: fullUrl,
      title: fullTitle,
      description,
      siteName: DEFAULT_CONFIG.siteName,
      images: [
        {
          url: secureImageUrl,
          secureUrl: secureImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/jpeg',
        }
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        section,
        authors: [author],
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      site: DEFAULT_CONFIG.twitter,
      creator: DEFAULT_CONFIG.twitter,
      title: fullTitle,
      description,
      images: [secureImageUrl],
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
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
  }

  return metadata
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${DEFAULT_CONFIG.siteUrl}${item.url}`,
    })),
  }
}

export function generateArticleSchema({
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  image,
  url,
  keywords = [],
}: {
  title: string
  description: string
  author: string
  publishedTime: string
  modifiedTime?: string
  image: string
  url: string
  keywords?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image.startsWith('http') ? image : `${DEFAULT_CONFIG.siteUrl}${image}`,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_CONFIG.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${DEFAULT_CONFIG.siteUrl}/Gemini_Generated_Image_koz312koz312koz3.png`,
      },
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url.startsWith('http') ? url : `${DEFAULT_CONFIG.siteUrl}${url}`,
    },
    keywords: keywords.join(', '),
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: DEFAULT_CONFIG.siteName,
    url: DEFAULT_CONFIG.siteUrl,
    logo: `${DEFAULT_CONFIG.siteUrl}/Gemini_Generated_Image_koz312koz312koz3.png`,
    description: DEFAULT_CONFIG.defaultDescription,
    founder: {
      '@type': 'Person',
      name: DEFAULT_CONFIG.author,
    },
    sameAs: [
      'https://twitter.com/triskideas',
      'https://linkedin.com/company/triskideas',
    ],
  }
}

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: DEFAULT_CONFIG.author,
    url: DEFAULT_CONFIG.siteUrl,
    image: `${DEFAULT_CONFIG.siteUrl}/dr-ferdinand-doctor-artist-professional.jpg`,
    description: 'Doctor, artist, and thought leader exploring human potential and personal development',
    jobTitle: 'Doctor & Author',
    knowsAbout: [
      'Human Potential',
      'Personal Development',
      'Medicine',
      'Art',
      'Philosophy',
      'Wellness'
    ],
    sameAs: [
      'https://twitter.com/triskideas',
      'https://linkedin.com/in/ferdinand-ibu-ogbaji',
    ],
  }
}

export const DEFAULT_KEYWORDS = [
  'human potential',
  'personal development',
  'self improvement',
  'wellness',
  'mindfulness',
  'philosophy',
  'medicine',
  'art',
  'creativity',
  'inspiration',
  'Dr Ferdinand Ibu Ogbaji',
  'TRISKIDEAS'
]