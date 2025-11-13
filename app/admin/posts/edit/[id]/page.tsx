"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
import { getAllPosts, updatePost, type Post } from "@/lib/db-actions"

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Post | null>(null)

  useEffect(() => {
    loadPost()
  }, [params.id])

  const loadPost = async () => {
    try {
      const posts = await getAllPosts()
      const post = posts.find((p) => p.id === Number(params.id))
      if (post) {
        setFormData(post)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load post",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setSaving(true)
    try {
      if (!formData.title.trim() || !formData.excerpt.trim() || !formData.richContent.trim()) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setSaving(false)
        return
      }

      await updatePost(formData.id, {
        title: formData.title,
        excerpt: formData.excerpt,
        richContent: formData.richContent,
        content: formData.richContent,
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
        description: "Post updated successfully!",
      })
      router.push("/admin/posts")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (!formData) return <div className="text-center py-12">Post not found</div>

  return (
    <div className="space-y-6">
      <Link href="/admin/posts" className="flex items-center gap-2 text-amber-700 hover:text-amber-800">
        <ArrowLeft size={20} />
        Back to Posts
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Post Title *</label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter post title"
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

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                />
                <span className="text-sm font-medium text-gray-900">Publish</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <span className="text-sm font-medium text-gray-900">Feature this post</span>
              </label>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="bg-amber-700 hover:bg-amber-800 text-white" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
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
