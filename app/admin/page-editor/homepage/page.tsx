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

export default function HomepageEditor() {
  const { toast } = useToast()
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPageLayout()
  }, [])

  const loadPageLayout = async () => {
    try {
      const layout = await getPageLayout("homepage")
      if (layout?.sections) {
        setSections(layout.sections as Section[])
      } else {
        // Default homepage sections
        setSections([
          {
            id: "hero",
            type: "hero",
            content: {
              title: "Welcome to TRISKIDEAS",
              subtitle: "Empowering Minds, Inspiring Ideas",
              description: "Discover insightful articles, innovative concepts, and transformative ideas.",
              buttonText: "Explore Our Blog",
              buttonLink: "/blog",
            },
          },
          {
            id: "featured",
            type: "featured-posts",
            content: {
              title: "Featured Articles",
              description: "Check out our most popular and recent posts",
            },
          },
          {
            id: "about",
            type: "about-section",
            content: {
              title: "About TRISKIDEAS",
              description: "We share ideas that matter, stories that inspire, and knowledge that transforms.",
            },
          },
          {
            id: "newsletter",
            type: "newsletter-cta",
            content: {
              title: "Stay Connected",
              description: "Subscribe to our newsletter for the latest updates",
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
      await savePageLayout("homepage", updatedSections)
      toast({
        title: "Saved!",
        description: "Homepage layout has been updated",
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
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              {section.content.description}
            </p>
            {section.content.buttonText && (
              <a
                href={section.content.buttonLink}
                className="inline-block bg-theme-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-theme-primary-dark transition"
              >
                {section.content.buttonText}
              </a>
            )}
          </div>
        )

      case "featured-posts":
        return (
          <div className="py-16 px-6 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-theme-primary-dark mb-4 text-center">
              {section.content.title}
            </h2>
            <p className="text-lg text-gray-600 mb-12 text-center">
              {section.content.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-theme-accent rounded-lg p-6 hover:shadow-lg transition">
                  <div className="bg-gray-200 h-48 rounded mb-4"></div>
                  <h3 className="text-xl font-semibold mb-2">Featured Post {i}</h3>
                  <p className="text-gray-600">This is a preview of your featured posts...</p>
                </div>
              ))}
            </div>
          </div>
        )

      case "about-section":
        return (
          <div className="bg-gray-50 py-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-theme-primary-dark mb-6">
                {section.content.title}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {section.content.description}
              </p>
            </div>
          </div>
        )

      case "newsletter-cta":
        return (
          <div className="bg-gradient-to-r from-theme-primary to-theme-primary-dark py-16 px-6 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">{section.content.title}</h2>
            <p className="text-lg mb-8">{section.content.description}</p>
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
    { value: "featured-posts", label: "Featured Posts" },
    { value: "about-section", label: "About Section" },
    { value: "newsletter-cta", label: "Newsletter CTA" },
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
        pageName="Homepage"
      />
    </div>
  )
}
