"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { TiptapEditor } from "@/components/tiptap-editor"
import { ImageUploadModal } from "@/components/image-upload-modal"
import { createPost } from "@/lib/db-actions"

export default function NewPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    richContent: "",
    author: "Dr. Ferdinand Ibu Ogbaji",
    imageUrl: "",
    category: "Uncategorized",
    readTimeMinutes: 5,
    featured: false,
    published: false,
    seoDescription: "",
  })

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

      await createPost({
        title: formData.title,
        slug,
        excerpt: formData.excerpt,
        content: formData.richContent,
        richContent: formData.richContent,
        author: formData.author,
        imageUrl: formData.imageUrl,
        category: formData.category,
        readTimeMinutes: formData.readTimeMinutes,
        featured: formData.featured,
        published: formData.published,
        seoDescription: formData.seoDescription,
      })

      toast({
        title: "Success",
        description: formData.published ? "Post published successfully!" : "Post saved as draft!",
      })

      router.push("/admin/posts")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/posts" className="flex items-center gap-2 text-amber-700 hover:text-amber-800">
        <ArrowLeft size={20} />
        Back to Posts
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Post Title *</label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter an engaging title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Personal Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Read Time (minutes)</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.readTimeMinutes}
                  onChange={(e) => setFormData({ ...formData, readTimeMinutes: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Excerpt *</label>
              <Textarea
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary of the post"
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
              <label className="block text-sm font-medium text-gray-900 mb-2">Featured Image</label>
              <ImageUploadModal 
                onUploadSuccess={(url) => setFormData({ ...formData, imageUrl: url })} 
                currentImage={formData.imageUrl}
              />
              {formData.imageUrl && (
                <p className="text-sm text-green-600 mt-2">✓ Image uploaded successfully</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">SEO Description</label>
              <Textarea
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="Meta description for search engines"
                rows={2}
              />
            </div>

            <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <label className="block text-sm font-medium text-gray-900 mb-3">Post Options</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-gray-900">Publish Now</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span className="text-sm font-medium text-gray-900">Feature This Post</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="bg-amber-700 hover:bg-amber-800 text-white" disabled={loading}>
                {loading ? "Creating..." : "Create Post"}
              </Button>
              <Link href="/admin/posts">
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
