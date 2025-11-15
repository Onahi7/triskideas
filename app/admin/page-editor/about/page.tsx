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

export default function AboutPageEditor() {
  const { toast } = useToast()
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPageLayout()
  }, [])

  const loadPageLayout = async () => {
    try {
      const layout = await getPageLayout("about")
      if (layout?.sections) {
        setSections(layout.sections as Section[])
      } else {
        setSections([
          {
            id: "hero",
            type: "hero",
            content: {
              title: "About TRISKIDEAS",
              subtitle: "Our Story, Mission & Vision",
              description: "Learn more about who we are and what drives us forward.",
            },
          },
          {
            id: "mission",
            type: "text-content",
            content: {
              title: "Our Mission",
              description: "To empower minds and inspire ideas through thoughtful content and innovative perspectives.",
            },
          },
          {
            id: "team",
            type: "team-section",
            content: {
              title: "Meet Our Team",
              description: "The people behind TRISKIDEAS",
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
      await savePageLayout("about", updatedSections)
      toast({
        title: "Saved!",
        description: "About page layout has been updated",
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

      case "text-content":
        return (
          <div className="py-16 px-6 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-theme-primary-dark mb-6">
              {section.content.title}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {section.content.description}
            </p>
          </div>
        )

      case "team-section":
        return (
          <div className="bg-gray-50 py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-theme-primary-dark mb-4 text-center">
                {section.content.title}
              </h2>
              <p className="text-lg text-gray-600 mb-12 text-center">
                {section.content.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center">
                    <div className="bg-gray-300 w-32 h-32 rounded-full mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold mb-1">Team Member {i}</h3>
                    <p className="text-gray-600">Role</p>
                  </div>
                ))}
              </div>
            </div>
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
    { value: "text-content", label: "Text Content" },
    { value: "team-section", label: "Team Section" },
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
        pageName="About Page"
      />
    </div>
  )
}
