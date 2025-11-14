"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { getPublishedSeries } from "@/lib/db-actions"

interface SeriesWithCount {
  id: number
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  featured: boolean
  published: boolean
  createdAt: Date | null
  updatedAt: Date | null
  episodeCount: number
}

export default function SeriesPage() {
  const [series, setSeries] = useState<SeriesWithCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const data = await getPublishedSeries()
        setSeries(data)
      } catch (error) {
        console.error("Failed to fetch series:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSeries()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <BlogHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Blog Series</h1>
          <p className="text-xl text-gray-600">
            Dive into episodic content collections on various topics
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading series...</div>
        ) : series.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600 py-12">No series published yet. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {series.map((s, index) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/series/${s.slug}`}>
                  <Card className="hover:shadow-xl transition-all duration-300 h-full group">
                    {s.imageUrl && (
                      <div className="h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={s.imageUrl}
                          alt={s.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={20} className="text-amber-700" />
                        {s.featured && (
                          <Badge variant="default" className="bg-amber-700">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl group-hover:text-amber-700 transition-colors">
                        {s.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {s.description && (
                        <p className="text-gray-600 mb-4 line-clamp-3">{s.description}</p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-amber-700 font-medium">
                          {s.episodeCount} {s.episodeCount === 1 ? "episode" : "episodes"}
                        </span>
                        <ArrowRight size={16} className="text-amber-700 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <BlogFooter />
    </div>
  )
}
