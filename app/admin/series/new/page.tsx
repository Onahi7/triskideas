"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ImageUploadModal } from "@/components/image-upload-modal"
import { createSeries } from "@/lib/db-actions"

export default function NewSeriesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    featured: false,
    published: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.name.trim()) {
        toast({ title: "Error", description: "Series name is required", variant: "destructive" })
        setLoading(false)
        return
      }

      const slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")

      await createSeries({
        name: formData.name,
        slug,
        description: formData.description || null,
        imageUrl: formData.imageUrl || null,
        featured: formData.featured,
        published: formData.published,
      })

      toast({ title: "Success", description: "Series created! Now add episodes to it." })
      router.push("/admin/series")
    } catch (error) {
      toast({ title: "Error", description: "Failed to create series", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/series" className="flex items-center gap-2 text-amber-700 hover:text-amber-800">
        <ArrowLeft size={20} />
        Back to Series
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Series</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Series Name *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Journey to Wellness, The Art of Healing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this series is about (optional)"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Series Image</label>
              <ImageUploadModal 
                onUploadSuccess={(url) => setFormData({ ...formData, imageUrl: url })} 
                currentImage={formData.imageUrl}
              />
              {formData.imageUrl && (
                <p className="text-sm text-green-600 mt-2">✓ Image uploaded successfully</p>
              )}
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                />
                <span className="text-sm font-medium text-gray-900">Publish immediately</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <span className="text-sm font-medium text-gray-900">Feature this series</span>
              </label>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="bg-amber-700 hover:bg-amber-800 text-white" disabled={loading}>
                {loading ? "Creating..." : "Create Series"}
              </Button>
              <Link href="/admin/series">
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
