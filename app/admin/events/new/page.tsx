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
import { TiptapEditor } from "@/components/tiptap-editor"
import { ImageUploadModal } from "@/components/image-upload-modal"
import { useToast } from "@/hooks/use-toast"
import { createEvent } from "@/lib/db-actions"

export default function NewEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    richContent: "",
    startDate: "",
    endDate: "",
    location: "",
    capacity: "",
    eventType: "free" as "free" | "paid",
    price: "",
    imageUrl: "",
    featured: false,
    published: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.title.trim() || !formData.description.trim() || !formData.startDate) {
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

      await createEvent({
        title: formData.title,
        slug,
        description: formData.description,
        richContent: formData.richContent,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : new Date(formData.startDate),
        location: formData.location || null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        eventType: formData.eventType,
        price: formData.price || "0",
        imageUrl: formData.imageUrl || null,
        featured: formData.featured,
        published: formData.published,
      })

      toast({
        title: "Success",
        description: "Event created successfully!",
      })

      router.push("/admin/events")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/events" className="flex items-center gap-2 text-amber-700 hover:text-amber-800">
        <ArrowLeft size={20} />
        Back to Events
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Event Title *</label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Start Date *</label>
                <Input
                  type="datetime-local"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">End Date *</label>
                <Input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Event location or 'Online'"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Capacity</label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="Max attendees (leave empty for unlimited)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Description *</label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Event Content</label>
              <TiptapEditor
                value={formData.richContent}
                onChange={(content) => setFormData({ ...formData, richContent: content })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Event Image</label>
              <ImageUploadModal 
                onUploadSuccess={(url) => setFormData({ ...formData, imageUrl: url })} 
                currentImage={formData.imageUrl}
              />
              {formData.imageUrl && (
                <p className="text-sm text-green-600 mt-2">✓ Image uploaded successfully</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Event Type *</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value as "free" | "paid" })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              {formData.eventType === "paid" && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Price ($) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
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
                <span className="text-sm font-medium text-gray-900">Feature this event</span>
              </label>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" className="bg-amber-700 hover:bg-amber-800 text-white" disabled={loading}>
                {loading ? "Creating..." : "Create Event"}
              </Button>
              <Link href="/admin/events">
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
