"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EditorToolbar } from "@/components/visual-editor/editor-toolbar"
import { EditableSection } from "@/components/visual-editor/editable-section"
import { useUndoRedo } from "@/hooks/use-undo-redo"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PageSection {
  id: string
  type: string
  content: any
  order: number
}

interface VisualPageEditorProps {
  sections: any[]
  onSave: (sections: any[]) => Promise<void>
  renderSection: (section: any) => React.ReactNode
  availableSectionTypes: Array<{ value: string; label: string }>
  pageName: string
}

export function VisualPageEditor({
  sections: initialSections = [],
  onSave,
  renderSection,
  availableSectionTypes,
  pageName,
}: VisualPageEditorProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showAddSection, setShowAddSection] = useState(false)
  const [newSectionType, setNewSectionType] = useState(availableSectionTypes[0]?.value || "custom")

  const {
    state: sections,
    set: setSections,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  } = useUndoRedo<any[]>(initialSections)

  const [originalSections, setOriginalSections] = useState(initialSections)
  const hasChanges = JSON.stringify(sections) !== JSON.stringify(originalSections)

  const handleToggleEdit = () => {
    if (isEditing && hasChanges) {
      const confirm = window.confirm("You have unsaved changes. Are you sure you want to exit edit mode?")
      if (!confirm) return
    }
    setIsEditing(!isEditing)
  }

  const handleUpdateSection = (id: string, content: any) => {
    const updated = sections.map((section) =>
      section.id === id ? { ...section, content } : section
    )
    setSections(updated)
  }

  const handleDeleteSection = (id: string) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      const updated = sections.filter((section) => section.id !== id)
      setSections(updated)
    }
  }

  const handleMoveUp = (id: string) => {
    const index = sections.findIndex((s) => s.id === id)
    if (index > 0) {
      const newSections = [...sections]
      ;[newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]]
      setSections(newSections)
    }
  }

  const handleMoveDown = (id: string) => {
    const index = sections.findIndex((s) => s.id === id)
    if (index < sections.length - 1) {
      const newSections = [...sections]
      ;[newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]]
      setSections(newSections)
    }
  }

  const handleAddSection = () => {
    setShowAddSection(true)
  }

  const handleCreateSection = () => {
    const newSection = {
      id: `section_${Date.now()}`,
      type: newSectionType,
      content: getDefaultContent(newSectionType),
    }
    setSections([...sections, newSection])
    setShowAddSection(false)
    setNewSectionType(availableSectionTypes[0]?.value || "custom")
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(sections)
      setOriginalSections(sections)
      reset(sections)
      toast({
        title: "Success",
        description: "Changes saved successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      const confirm = window.confirm("Discard all changes?")
      if (!confirm) return
    }
    reset(originalSections)
    setIsEditing(false)
  }

  const getDefaultContent = (type: string) => {
    switch (type) {
      case "hero":
        return {
          title: "New Hero Section",
          subtitle: "Subtitle here",
          description: "Description text...",
          buttonText: "Learn More",
          buttonLink: "/",
        }
      case "text-content":
        return {
          title: "New Section",
          description: "Add your content here...",
        }
      case "cta-section":
      case "newsletter-cta":
        return {
          title: "Call to Action",
          description: "Get started today",
          buttonText: "Get Started",
        }
      case "featured-posts":
      case "blog-grid":
      case "events-grid":
        return {
          title: "Featured Content",
          description: "Check out our latest updates",
        }
      case "custom":
        return {
          title: "Custom Section",
          description: "Add your custom content here",
        }
      default:
        return {
          title: "New Section",
          description: "Content goes here...",
        }
    }
  }

  return (
    <div className="relative">
      {/* Editor Toolbar */}
      {isEditing && (
        <EditorToolbar
          isEditing={isEditing}
          canUndo={canUndo}
          canRedo={canRedo}
          hasChanges={hasChanges}
          onToggleEdit={handleToggleEdit}
          onUndo={undo}
          onRedo={redo}
          onSave={handleSave}
          onCancel={handleCancel}
          onAddSection={handleAddSection}
        />
      )}

      {/* Edit Mode Indicator */}
      {isEditing && (
        <div className="fixed top-20 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          ✏️ Edit Mode Active
        </div>
      )}

      {/* Sections */}
      <div className="space-y-8">
        {sections && sections.length > 0 ? (
          sections.map((section, index) => (
            <EditableSection
              key={section.id}
              id={section.id}
              type={section.type}
              content={section.content}
              isEditing={isEditing}
              onUpdate={handleUpdateSection}
              onDelete={handleDeleteSection}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              canMoveUp={index > 0}
              canMoveDown={index < sections.length - 1}
            >
              {renderSection(section)}
            </EditableSection>
          ))
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl mb-4">No sections yet</p>
            {isEditing && (
              <Button onClick={handleAddSection}>Add Your First Section</Button>
            )}
          </div>
        )}
      </div>

      {/* Add Section Modal */}
      {showAddSection && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Add New Section</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Type</label>
                <Select value={newSectionType} onValueChange={setNewSectionType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSectionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleCreateSection} className="flex-1">
                  Add Section
                </Button>
                <Button onClick={() => setShowAddSection(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Mode Toggle Button (Always Visible) */}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl z-50"
          title="Enter Edit Mode"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
