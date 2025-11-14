import { generateSEOMetadata, generateArticleSchema, generateBreadcrumbSchema } from "@/lib/seo-utils"
import { StructuredData } from "@/components/seo/structured-data"
import { getPostBySlug } from "@/lib/db-actions"
import { BlogPostClient } from "./blog-post-client"
import { notFound } from 'next/navigation'
import type { Metadata } from "next"

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found."
    }
  }

  // Use custom post image if available, otherwise use dynamic OG image
  const ogImageUrl = post.imageUrl || `/api/og/blog/${slug}`

  return generateSEOMetadata({
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    keywords: post.category ? [post.category, 'human potential', 'personal development'] : ['human potential', 'personal development'],
    author: post.author,
    image: ogImageUrl,
    url: `/blog/${post.slug}`,
    type: "article",
    publishedTime: new Date(post.createdAt).toISOString(),
    modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    section: post.category || "Blog",
    tags: post.category ? [post.category] : []
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt || post.content.substring(0, 200),
    author: post.author || "Dr. Ferdinand Ibu Ogbaji",
    publishedTime: new Date(post.createdAt).toISOString(),
    modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date(post.createdAt).toISOString(),
    image: post.imageUrl || "/Gemini_Generated_Image_koz312koz312koz3.png",
    url: `/blog/${post.slug}`,
    keywords: post.category ? [post.category] : []
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` }
  ])

  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbSchema} />
      <BlogPostClient slug={slug} />
    </>
  )
}
