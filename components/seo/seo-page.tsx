import { generateSEOMetadata, generateBreadcrumbSchema } from '@/lib/seo-utils'
import { StructuredData } from '@/components/seo/structured-data'

interface SEOPageProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'blog'
  publishedTime?: string
  modifiedTime?: string
  breadcrumbs?: Array<{ name: string; url: string }>
  children: React.ReactNode
}

export function SEOPage({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  breadcrumbs,
  children,
}: SEOPageProps) {
  const breadcrumbSchema = breadcrumbs ? generateBreadcrumbSchema(breadcrumbs) : null

  return (
    <>
      {breadcrumbSchema && <StructuredData data={breadcrumbSchema} />}
      {children}
    </>
  )
}

export { generateSEOMetadata } from '@/lib/seo-utils'