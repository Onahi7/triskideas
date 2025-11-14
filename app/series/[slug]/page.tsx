"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Eye, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { getSeriesBySlug, getEpisodesBySeriesId, type Series, type Episode } from "@/lib/db-actions"

export default function SeriesDetailPage() {
  const params = useParams()
  const [series, setSeries] = useState<Series | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seriesData = await getSeriesBySlug(params.slug as string)
        if (seriesData) {
          setSeries(seriesData)
          const episodesData = await getEpisodesBySeriesId(seriesData.id)
          // Only show published episodes
          setEpisodes(episodesData.filter(ep => ep.published))
        }
      } catch (error) {
        console.error("Failed to fetch series:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <BlogHeader />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">
          Loading series...
        </div>
        <BlogFooter />
      </div>
    )
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <BlogHeader />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600 py-12">Series not found</p>
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
        <Link href="/series" className="flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-8">
          <ArrowLeft size={20} />
          Back to All Series
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {series.imageUrl && (
            <div className="h-96 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg overflow-hidden mb-8">
              <img
                src={series.imageUrl}
                alt={series.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <BookOpen size={24} className="text-amber-700" />
            <h1 className="text-5xl font-bold text-gray-900">{series.name}</h1>
          </div>

          {series.description && (
            <p className="text-xl text-gray-600 mb-8">{series.description}</p>
          )}

          <div className="mb-8">
            <Badge variant="outline" className="text-amber-700 border-amber-700">
              {episodes.length} {episodes.length === 1 ? "Episode" : "Episodes"}
            </Badge>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Episodes</h2>

          {episodes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600 py-8">No published episodes yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {episodes.map((episode, index) => (
                <motion.div
                  key={episode.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/series/${params.slug}/episode/${episode.slug}`}>
                    <Card className="hover:shadow-lg transition-all duration-300 group">
                      <CardContent className="pt-6">
                        <div className="flex gap-6">
                          {episode.imageUrl && (
                            <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                              <img
                                src={episode.imageUrl}
                                alt={episode.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className="bg-amber-700">Episode {episode.episodeNumber}</Badge>
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                                {episode.title}
                              </h3>
                            </div>
                            <p className="text-gray-600 mb-3 line-clamp-2">{episode.excerpt}</p>
                            <div className="flex gap-4 text-sm text-gray-500">
                              {episode.publishedAt && (
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {new Date(episode.publishedAt).toLocaleDateString()}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Eye size={14} />
                                {episode.viewCount || 0} views
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <BlogFooter />
    </div>
  )
}
