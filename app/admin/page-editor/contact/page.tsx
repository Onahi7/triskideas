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

export default function ContactPageEditor() {
  const { toast } = useToast()
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPageLayout()
  }, [])

  const loadPageLayout = async () => {
    try {
      const layout = await getPageLayout("contact")
      if (layout?.sections) {
        setSections(layout.sections as Section[])
      } else {
        setSections([
          {
            id: "hero",
            type: "hero",
            content: {
              title: "Get In Touch",
              subtitle: "We'd Love to Hear From You",
              description: "Have questions or feedback? Reach out to us anytime.",
            },
          },
          {
            id: "contact-form",
            type: "contact-form",
            content: {
              title: "Send Us a Message",
              description: "Fill out the form below and we'll get back to you soon.",
            },
          },
          {
            id: "contact-info",
            type: "contact-info",
            content: {
              title: "Contact Information",
              description: "You can also reach us through these channels:",
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
      await savePageLayout("contact", updatedSections)
      toast({
        title: "Saved!",
        description: "Contact page layout has been updated",
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

      case "contact-form":
        return (
          <div className="py-16 px-6 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-theme-primary-dark mb-4 text-center">
              {section.content.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              {section.content.description}
            </p>
            <div className="space-y-4 border border-gray-300 rounded-lg p-8">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <div className="border border-gray-300 rounded px-4 py-2 bg-gray-50">
                  Your name...
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="border border-gray-300 rounded px-4 py-2 bg-gray-50">
                  your@email.com
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <div className="border border-gray-300 rounded px-4 py-3 bg-gray-50 h-32">
                  Your message...
                </div>
              </div>
              <button className="w-full bg-theme-primary text-white py-3 rounded-lg font-semibold">
                Send Message
              </button>
            </div>
          </div>
        )

      case "contact-info":
        return (
          <div className="bg-gray-50 py-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-theme-primary-dark mb-4">
                {section.content.title}
              </h2>
              <p className="text-lg text-gray-600 mb-12">
                {section.content.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-theme-primary text-4xl mb-2">📧</div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-600">info@triskideas.com</p>
                </div>
                <div>
                  <div className="text-theme-primary text-4xl mb-2">📱</div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-gray-600">+123 456 7890</p>
                </div>
                <div>
                  <div className="text-theme-primary text-4xl mb-2">📍</div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-gray-600">Your City, Country</p>
                </div>
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
    { value: "contact-form", label: "Contact Form" },
    { value: "contact-info", label: "Contact Info" },
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
        pageName="Contact Page"
      />
    </div>
  )
}
