"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { TiptapEditor } from "@/components/tiptap-editor"
import { ImageUploadModal } from "@/components/image-upload-modal"
import { createEpisode, getSeriesById, type Series } from "@/lib/db-actions"

export default function NewEpisodePage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [series, setSeries] = useState<Series | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    richContent: "",
    imageUrl: "",
    episodeNumber: 1,
    published: false,
  })

  const seriesId = parseInt(params.id as string)

  useEffect(() => {
    const loadSeries = async () => {
      try {
        const seriesData = await getSeriesById(seriesId)
        setSeries(seriesData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load series",
          variant: "destructive",
        })
      }
    }
    loadSeries()
  }, [seriesId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.title.trim() || !formData.excerpt.trim() || !formData.richContent.trim()) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")

      await createEpisode({
        seriesId,
        title: formData.title,
        slug,
        episodeNumber: formData.episodeNumber,
        excerpt: formData.excerpt,
        content: formData.richContent,
        richContent: formData.richContent,
        imageUrl: formData.imageUrl,
        published: formData.published,
        publishedAt: formData.published ? new Date() : null,
      })

      toast({
        title: "Success",
        description: formData.published ? "Episode published successfully!" : "Episode saved as draft!",
      })

      router.push(`/admin/series/${seriesId}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create episode",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!series) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/series/${seriesId}`}
        className="flex items-center gap-2 text-amber-700 hover:text-amber-800"
      >
        <ArrowLeft size={20} />
        Back to {series.name}
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Episode</CardTitle>
          <p className="text-sm text-gray-600">Adding episode to: {series.name}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Episode Title *</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter episode title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Episode Number *</label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={formData.episodeNumber}
                  onChange={(e) => setFormData({ ...formData, episodeNumber: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Excerpt *</label>
              <Textarea
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary of this episode"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Content *</label>
              <TiptapEditor
                value={formData.richContent}
                onChange={(content) => setFormData({ ...formData, richContent: content })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Episode Image</label>
              <ImageUploadModal
                onUploadSuccess={(url) => setFormData({ ...formData, imageUrl: url })}
                currentImage={formData.imageUrl}
              />
              {formData.imageUrl && <p className="text-sm text-green-600 mt-2">✓ Image uploaded successfully</p>}
            </div>

            <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <label className="block text-sm font-medium text-gray-900 mb-3">Episode Options</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-gray-900">Publish Now</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="bg-amber-700 hover:bg-amber-800 text-white" disabled={loading}>
                {loading ? "Creating..." : "Create Episode"}
              </Button>
              <Link href={`/admin/series/${seriesId}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
