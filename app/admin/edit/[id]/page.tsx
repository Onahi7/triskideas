"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getAllPosts, updatePost, type BlogPost } from "@/lib/blog-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    featured: false,
    imageUrl: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }

    const foundPost = getAllPosts().find((p) => p.id === params.id)
    if (foundPost) {
      setPost(foundPost)
      setFormData({
        title: foundPost.title,
        excerpt: foundPost.excerpt,
        content: foundPost.content,
        author: foundPost.author,
        featured: foundPost.featured,
        imageUrl: foundPost.imageUrl || "",
      })
    }
  }, [isAuthenticated, router, params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post) return

    setLoading(true)
    try {
      updatePost(post.id, {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        featured: formData.featured,
        imageUrl: formData.imageUrl || undefined,
      })

      router.push("/admin/dashboard")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || !post) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Post Title *</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Excerpt (Short Summary) *</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Enter a brief excerpt"
              required
              disabled={loading}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Full Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter the full post content (separate paragraphs with blank lines)"
              required
              disabled={loading}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Author</label>
            <Input type="text" name="author" value={formData.author} onChange={handleChange} disabled={loading} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Featured Image URL (Optional)</label>
            <Input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="e.g., /placeholder.svg?height=400&width=800&query=your-description"
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              checked={formData.featured}
              onChange={handleChange}
              disabled={loading}
              className="w-5 h-5 rounded border-gray-300"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-900">
              Feature this post on the homepage
            </label>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg flex-1"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
