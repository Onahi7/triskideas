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
import { getAllEvents, updateEvent, type Event } from "@/lib/db-actions"

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Event | null>(null)

  useEffect(() => {
    loadEvent()
  }, [params.id])

  const loadEvent = async () => {
    try {
      const events = await getAllEvents()
      const event = events.find((e) => e.id === Number(params.id))
      if (event) {
        setFormData(event)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load event",
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
      if (!formData.title.trim() || !formData.description.trim() || !formData.startDate) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setSaving(false)
        return
      }

      await updateEvent(formData.id, {
        title: formData.title,
        description: formData.description,
        richContent: formData.richContent,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        location: formData.location,
        capacity: formData.capacity,
        eventType: formData.eventType,
        price: formData.price,
        imageUrl: formData.imageUrl,
        featured: formData.featured,
        published: formData.published,
      })

      toast({
        title: "Success",
        description: "Event updated successfully!",
      })
      router.push("/admin/events")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (!formData) return <div className="text-center py-12">Event not found</div>

  return (
    <div className="space-y-6">
      <Link href="/admin/events" className="flex items-center gap-2 text-amber-700 hover:text-amber-800">
        <ArrowLeft size={20} />
        Back to Events
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
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
                <label className="block text-sm font-medium text-gray-900 mb-2">End Date</label>
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
                  placeholder="Max attendees"
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
                <span className="text-sm font-medium text-gray-900">Publish</span>
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
              <Button type="submit" className="bg-amber-700 hover:bg-amber-800 text-white" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
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
