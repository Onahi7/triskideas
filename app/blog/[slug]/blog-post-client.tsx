"use client"

import { useEffect, useState } from "react"
import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { CommentSection } from "@/components/comment-section"
import { NewsletterPopup } from "@/components/newsletter-popup"
import { SocialShare } from "@/components/social-share"
import { FloatingSocialShare } from "@/components/floating-social-share"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Eye, Calendar, User } from "lucide-react"
import { getPostBySlug, type Post } from "@/lib/db-actions"
import { getPostCommentsWithReplies } from "@/lib/comment-actions"
import { VISIBILITY_TOKEN_STORAGE_KEY } from "@/components/comment-section"

// Helper function to extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) return match[1]
  }
  
  return null
}

// Helper function to check if URL is a YouTube link
function isYouTubeUrl(url: string): boolean {
  if (!url) return false
  return url.includes('youtube.com') || url.includes('youtu.be') || /^[a-zA-Z0-9_-]{11}$/.test(url)
}

interface BlogPostClientProps {
  slug: string
}

export function BlogPostClient({ slug }: BlogPostClientProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [visibilityTokens, setVisibilityTokens] = useState<string[]>([])

  useEffect(() => {
    const storedTokens = JSON.parse(localStorage.getItem(VISIBILITY_TOKEN_STORAGE_KEY) || "[]") as string[]
    setVisibilityTokens(storedTokens)
    loadPost(storedTokens)
  }, [slug, refreshKey])

  const loadPost = async (tokens: string[] = visibilityTokens) => {
    try {
      const postData = await getPostBySlug(slug)
      if (postData) {
        setPost(postData)
        const commentsData = await getPostCommentsWithReplies(postData.id, tokens)
        setComments(commentsData)
      }
    } catch (error) {
      console.error("Failed to load post:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-amber-50">
        <BlogHeader />
        <div className="text-center py-20">Loading...</div>
        <BlogFooter />
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-amber-50">
        <BlogHeader />
        <section className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">Article Not Found</h1>
          <p className="text-amber-700 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog">
            <Button className="bg-amber-700 hover:bg-amber-800 text-white">Back to Articles</Button>
          </Link>
        </section>
        <BlogFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
      <BlogHeader />
      <NewsletterPopup />

      <article className="max-w-4xl mx-auto px-4 py-16">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="mb-6">
            <Link href="/blog">
              <span className="text-amber-700 hover:text-amber-800 font-medium">← Back to Articles</span>
            </Link>
          </div>

          <h1 className="text-5xl font-bold text-amber-900 mb-6 text-balance leading-tight">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-amber-200 text-gray-600">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <time dateTime={new Date(post.publishedAt || post.createdAt).toISOString()}>
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            {post.viewCount && (
              <div className="flex items-center gap-2">
                <Eye size={16} />
                <span>{post.viewCount} views</span>
              </div>
            )}
          </div>
        </motion.header>

        {post.imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12 rounded-xl overflow-hidden shadow-xl"
          >
            {isYouTubeUrl(post.imageUrl) ? (
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(post.imageUrl)}`}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <Image
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-lg max-w-none mb-16 
            prose-headings:text-gray-900 
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-theme-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
            prose-li:text-gray-700 prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-theme-primary prose-blockquote:pl-4 prose-blockquote:italic
            prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
            prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
            [&_iframe]:rounded-lg [&_iframe]:shadow-lg [&_iframe]:my-8 [&_iframe]:mx-auto"
        >
          {post.richContent ? (
            <div dangerouslySetInnerHTML={{ __html: post.richContent }} />
          ) : (
            post.content.split("\n\n").map((paragraph, idx) => (
              <p key={idx} className="text-lg text-gray-700 leading-relaxed mb-6 text-balance">
                {paragraph.trim()}
              </p>
            ))
          )}
        </motion.div>

        {/* Social Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-12"
        >
          <SocialShare
            url={`/blog/${post.slug}`}
            title={post.title}
            description={post.excerpt || post.content.substring(0, 160)}
            image={post.imageUrl || "/Gemini_Generated_Image_koz312koz312koz3.png"}
            hashtags={['TRISKIDEAS', 'PersonalDevelopment', 'HumanPotential', ...(post.category ? [post.category] : [])]}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-8 shadow-lg border border-amber-100 mb-12"
        >
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-linear-to-br from-amber-200 to-yellow-200 rounded-full shrink-0 flex items-center justify-center text-3xl">
              ✨
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">About the Author</h3>
              <p className="text-gray-700">
                Dr. Ferdinand Ibu Ogbaji is a passionate medical doctor, artist, and thinker based in Jos, Nigeria. He
                is dedicated to helping people unlock their God-given potential and make positive contributions to
                society. Married to Florence, Ferdinand combines his medical expertise with artistic creativity to
                explore transformative ideas.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center py-12 border-t border-amber-200"
        >
          <Link href="/blog">
            <Button className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-6">Explore More Articles</Button>
          </Link>
        </motion.div>

        {/* Comment Section */}
        <CommentSection
          postId={post.id}
          comments={comments}
          onCommentSubmit={(token) => {
            if (token) {
              const next = Array.from(new Set([...visibilityTokens, token]))
              localStorage.setItem(VISIBILITY_TOKEN_STORAGE_KEY, JSON.stringify(next))
              setVisibilityTokens(next)
            }
            setRefreshKey((prev) => prev + 1)
          }}
        />
      </article>

      {/* Floating Social Share */}
      <FloatingSocialShare
        url={`/blog/${post.slug}`}
        title={post.title}
        description={post.excerpt || post.content.substring(0, 160)}
        image={post.imageUrl || "/Gemini_Generated_Image_koz312koz312koz3.png"}
        hashtags={['TRISKIDEAS', 'PersonalDevelopment', 'HumanPotential', ...(post.category ? [post.category] : [])]}
      />

      <BlogFooter />
    </main>
  )
}