"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Edit3, Copy, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface PageLayout {
  id: number
  pageName: string
  sections: string
  updatedAt: Date | null
}

export default function PageEditorDashboard() {
  const { toast } = useToast()
  const router = useRouter()
  const [layouts, setLayouts] = useState<PageLayout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLayouts()
  }, [])

  const loadLayouts = async () => {
    try {
      // This would fetch from your API
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load page layouts",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const pages = [
    { 
      name: "Homepage", 
      slug: "page-editor/homepage",
      description: "Edit homepage hero, featured posts, and call-to-action sections",
      editIn: "Page Editor",
      icon: "🏠"
    },
    { 
      name: "About Page", 
      slug: "page-editor/about",
      description: "Edit about page hero, mission, and team sections",
      editIn: "Page Editor",
      icon: "👤"
    },
    { 
      name: "Blog Page", 
      slug: "page-editor/blog",
      description: "Edit blog listing page header and layout sections",
      editIn: "Page Editor",
      icon: "📝"
    },
    { 
      name: "Contact Page", 
      slug: "page-editor/contact",
      description: "Edit contact page header and form sections",
      editIn: "Page Editor",
      icon: "📧"
    },
    { 
      name: "Events Page", 
      slug: "page-editor/events",
      description: "Edit events listing page header and sections",
      editIn: "Page Editor",
      icon: "📅"
    },
    { 
      name: "Site Settings", 
      slug: "settings",
      description: "Edit site colors, SEO, and global settings",
      editIn: "Settings",
      icon: "⚙️"
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Visual Page Editor</h1>
          <p className="text-gray-600 mt-1">Edit your website pages with live preview</p>
        </div>
      </div>

      {/* Features Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">✨ Page Editor Status:</h3>
          <ul className="space-y-1 text-blue-800 text-sm mb-4">
            <li>✅ <strong>Edit Mode</strong> - Click pencil icon to edit sections</li>
            <li>✅ <strong>Undo/Redo</strong> - Use Ctrl+Z / Ctrl+Y or toolbar buttons</li>
            <li>✅ <strong>Reorder Sections</strong> - Move sections up and down</li>
            <li>✅ <strong>Add/Delete</strong> - Add new sections or remove existing ones</li>
            <li>✅ <strong>Live Preview</strong> - See changes instantly before saving</li>
          </ul>
          <div className="bg-yellow-100 border border-yellow-300 rounded p-3 text-sm text-yellow-900">
            <strong>⚠️ Note:</strong> Homepage, About, Blog, Contact, and Events pages have dedicated editors below.
            The actual pages will continue using Settings content until you save editor layouts.
          </div>
        </CardContent>
      </Card>

      {/* Pages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <Card key={page.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{page.icon}</span>
                <div>
                  <CardTitle className="text-lg">{page.name}</CardTitle>
                  <p className="text-xs text-gray-500 mt-1">Edit in: {page.editIn}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{page.description}</p>
            </CardHeader>
            <CardContent>
              <Link href={`/admin/${page.slug}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                  <Edit3 size={16} />
                  Open {page.editIn}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Guide */}
      <Card>
        <CardHeader>
          <CardTitle>📚 How to Use the Page Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-semibold text-lg mb-1">1. Choose a Page</h4>
              <p className="text-sm text-gray-600">
                Click on any page card above to open its editor
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-semibold text-lg mb-1">2. Enter Edit Mode</h4>
              <p className="text-sm text-gray-600">
                Click the floating pencil icon (bottom-right) or "Edit Mode" button in toolbar
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h4 className="font-semibold text-lg mb-1">3. Edit Sections</h4>
              <p className="text-sm text-gray-600">
                Hover over any section → Click ✏️ Edit icon → Change text/buttons → Save
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h4 className="font-semibold text-lg mb-1">4. Manage Layout</h4>
              <p className="text-sm text-gray-600">
                Use ⬆️⬇️ buttons to reorder sections, ➕ to add new ones, 🗑️ to delete
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h4 className="font-semibold text-lg mb-1">5. Save Changes</h4>
              <p className="text-sm text-gray-600">
                Click "💾 Save Changes" in toolbar when ready. Use Undo (Ctrl+Z) if needed.
              </p>
            </div>
          </div>

          <div className="bg-gray-100 rounded p-4 mt-6">
            <h4 className="font-semibold mb-2">💡 Pro Tips:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Preview your changes before saving (Exit Edit Mode)</li>
              <li>• Use keyboard shortcuts: Ctrl+Z (Undo), Ctrl+Y (Redo)</li>
              <li>• Changes are saved to database and persist across sessions</li>
              <li>• Each page editor is independent - edit one at a time</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
