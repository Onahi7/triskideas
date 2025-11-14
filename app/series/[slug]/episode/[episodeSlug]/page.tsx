"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Eye, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { SocialShare } from "@/components/social-share"
import { CommentSection } from "@/components/comment-section"
import { getEpisodeBySlug, getSeriesBySlug, type Episode, type Series } from "@/lib/db-actions"

export default function EpisodeDetailPage() {
  const params = useParams()
  const [episode, setEpisode] = useState<Episode | null>(null)
  const [series, setSeries] = useState<Series | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const episodeData = await getEpisodeBySlug(params.episodeSlug as string)
        if (episodeData) {
          setEpisode(episodeData)
          const seriesData = await getSeriesBySlug(params.slug as string)
          setSeries(seriesData)
        }
      } catch (error) {
        console.error("Failed to fetch episode:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.slug, params.episodeSlug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <BlogHeader />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">
          Loading episode...
        </div>
        <BlogFooter />
      </div>
    )
  }

  if (!episode || !series) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <BlogHeader />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600 py-12">Episode not found</p>
              <div className="text-center">
                <Link href="/series">
                  <Button variant="outline">Back to Series</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <BlogFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <BlogHeader />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href={`/series/${params.slug}`}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-8"
        >
          <ArrowLeft size={20} />
          Back to {series.name}
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Link href="/series" className="flex items-center gap-2 text-gray-600 hover:text-amber-700">
              <BookOpen size={18} />
              <span className="text-sm">{series.name}</span>
            </Link>
            <span className="text-gray-400">•</span>
            <Badge className="bg-amber-700">Episode {episode.episodeNumber}</Badge>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">{episode.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-8">
            {episode.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {new Date(episode.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye size={16} />
              {episode.viewCount || 0} views
            </span>
          </div>

          {episode.imageUrl && (
            <div className="h-96 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg overflow-hidden mb-8">
              <img
                src={episode.imageUrl}
                alt={episode.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-amber-700 prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: episode.richContent || episode.content }}
              />
            </CardContent>
          </Card>

          <SocialShare
            url={`${process.env.NEXT_PUBLIC_APP_URL || "https://triskideas.com"}/series/${params.slug}/episode/${params.episodeSlug}`}
            title={episode.title}
          />

          <div className="mt-12">
            <CommentSection postId={episode.id} postTitle={episode.title} />
          </div>
        </motion.article>
      </main>

      <BlogFooter />
    </div>
  )
}
