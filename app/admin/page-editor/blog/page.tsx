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

export default function BlogPageEditor() {
  const { toast } = useToast()
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPageLayout()
  }, [])

  const loadPageLayout = async () => {
    try {
      const layout = await getPageLayout("blog")
      if (layout?.sections) {
        setSections(layout.sections as Section[])
      } else {
        setSections([
          {
            id: "hero",
            type: "hero",
            content: {
              title: "Our Blog",
              subtitle: "Insights, Stories & Ideas",
              description: "Explore our collection of articles and thought-provoking content.",
            },
          },
          {
            id: "blog-grid",
            type: "blog-grid",
            content: {
              title: "Latest Posts",
              description: "Check out our most recent articles",
            },
          },
          {
            id: "categories",
            type: "categories-section",
            content: {
              title: "Browse by Category",
              description: "Find content that interests you",
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
      await savePageLayout("blog", updatedSections)
      toast({
        title: "Saved!",
        description: "Blog page layout has been updated",
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

      case "blog-grid":
        return (
          <div className="py-16 px-6 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-theme-primary-dark mb-4 text-center">
              {section.content.title}
            </h2>
            <p className="text-lg text-gray-600 mb-12 text-center">
              {section.content.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border border-theme-accent rounded-lg overflow-hidden hover:shadow-lg transition">
                  <div className="bg-gray-200 h-48"></div>
                  <div className="p-6">
                    <span className="text-xs text-theme-primary font-semibold">CATEGORY</span>
                    <h3 className="text-xl font-semibold mt-2 mb-3">Blog Post Title {i}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      This is a preview of your blog posts grid layout...
                    </p>
                    <div className="text-sm text-gray-500">Jan {i}, 2025</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "categories-section":
        return (
          <div className="bg-gray-50 py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-theme-primary-dark mb-4 text-center">
                {section.content.title}
              </h2>
              <p className="text-lg text-gray-600 mb-12 text-center">
                {section.content.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Technology", "Design", "Business", "Lifestyle"].map((cat) => (
                  <div
                    key={cat}
                    className="bg-white border-2 border-theme-accent rounded-lg p-6 text-center hover:bg-theme-accent transition cursor-pointer"
                  >
                    <h3 className="font-semibold text-lg">{cat}</h3>
                    <p className="text-sm text-gray-500 mt-1">12 posts</p>
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
    { value: "blog-grid", label: "Blog Grid" },
    { value: "categories-section", label: "Categories Section" },
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
        pageName="Blog Page"
      />
    </div>
  )
}
