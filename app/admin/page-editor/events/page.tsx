"use client"

import { useEffect, useState } from "react"
import { VisualPageEditor } from "@/components/visual-editor/visual-page-editor"
import { getPageLayout, savePageLayout } from "@/lib/page-layout-actions"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface Section {
  id: string
  type: string
  content: {
    title?: string
    subtitle?: string
    description?: string
    buttonText?: string
    buttonLink?: string
    imageUrl?: string
    items?: any[]
  }
}

export default function EventsPageEditor() {
  const { toast } = useToast()
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPageLayout()
  }, [])

  const loadPageLayout = async () => {
    try {
      const layout = await getPageLayout("events")
      if (layout?.sections) {
        setSections(layout.sections as Section[])
      } else {
        setSections([
          {
            id: "hero",
            type: "hero",
            content: {
              title: "Upcoming Events",
              subtitle: "Join Us for Amazing Experiences",
              description: "Discover and register for our latest events and activities.",
            },
          },
          {
            id: "events-grid",
            type: "events-grid",
            content: {
              title: "Featured Events",
              description: "Don't miss out on these exciting opportunities",
            },
          },
          {
            id: "cta",
            type: "cta-section",
            content: {
              title: "Stay Updated",
              description: "Subscribe to get notifications about upcoming events",
              buttonText: "Subscribe Now",
            },
          },
        ])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load page layout",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (updatedSections: Section[]) => {
    try {
      await savePageLayout("events", updatedSections)
      toast({
        title: "Saved!",
        description: "Events page layout has been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save page layout",
        variant: "destructive",
      })
      throw error
    }
  }

  const renderSection = (section: Section) => {
    switch (section.type) {
      case "hero":
        return (
          <div className="bg-gradient-to-r from-theme-background to-theme-accent py-20 px-6 text-center">
            <h1 className="text-5xl font-bold text-theme-primary-dark mb-4">
              {section.content.title}
            </h1>
            <p className="text-2xl text-theme-primary mb-6">
              {section.content.subtitle}
            </p>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              {section.content.description}
            </p>
          </div>
        )

      case "events-grid":
        return (
          <div className="py-16 px-6 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-theme-primary-dark mb-4 text-center">
              {section.content.title}
            </h2>
            <p className="text-lg text-gray-600 mb-12 text-center">
              {section.content.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-theme-accent rounded-lg overflow-hidden hover:shadow-lg transition">
                  <div className="bg-gray-200 h-48 flex items-center justify-center">
                    <span className="text-4xl">📅</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-theme-primary font-semibold mb-2">
                      <span>📍 Location</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Event Title {i}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      This is a preview of your events. Actual events will show here...
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Jan {i + 10}, 2025</span>
                      <button className="bg-theme-primary text-white px-4 py-2 rounded font-semibold">
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "cta-section":
        return (
          <div className="bg-gradient-to-r from-theme-primary to-theme-primary-dark py-16 px-6 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">{section.content.title}</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">{section.content.description}</p>
            {section.content.buttonText && (
              <button className="bg-white text-theme-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                {section.content.buttonText}
              </button>
            )}
          </div>
        )

      case "custom":
        return (
          <div className="py-16 px-6 max-w-7xl mx-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {section.content.title || "Custom Section"}
              </h3>
              <p className="text-gray-600">
                {section.content.description || "Add your custom content here"}
              </p>
            </div>
          </div>
        )

      default:
        return (
          <div className="py-8 px-6 bg-gray-100">
            <p className="text-center text-gray-500">Unknown section type: {section.type}</p>
          </div>
        )
    }
  }

  const availableSectionTypes = [
    { value: "hero", label: "Hero Section" },
    { value: "events-grid", label: "Events Grid" },
    { value: "cta-section", label: "CTA Section" },
    { value: "custom", label: "Custom Section" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <VisualPageEditor
        sections={sections}
        onSave={handleSave}
        renderSection={renderSection}
        availableSectionTypes={availableSectionTypes}
        pageName="Events Page"
      />
    </div>
  )
}
