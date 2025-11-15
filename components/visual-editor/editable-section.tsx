"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit3, Check, X, Trash2, MoveUp, MoveDown, GripVertical } from "lucide-react"

interface EditableSectionProps {
  id: string
  type: string
  content: any
  isEditing: boolean
  onUpdate: (id: string, content: any) => void
  onDelete: (id: string) => void
  onMoveUp?: (id: string) => void
  onMoveDown?: (id: string) => void
  canMoveUp?: boolean
  canMoveDown?: boolean
  children: React.ReactNode
}

export function EditableSection({
  id,
  type,
  content,
  isEditing,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  children,
}: EditableSectionProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editedContent, setEditedContent] = useState(content)

  const handleSave = () => {
    onUpdate(id, editedContent)
    setIsEditorOpen(false)
  }

  const handleCancel = () => {
    setEditedContent(content)
    setIsEditorOpen(false)
  }

  useEffect(() => {
    setEditedContent(content)
  }, [content])

  return (
    <div
      className={`relative group ${
        isEditing ? "ring-2 ring-blue-400 ring-offset-4 rounded-lg" : ""
      }`}
    >
      {/* Edit Controls Overlay */}
      {isEditing && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-white shadow-lg rounded-full px-3 py-1 border border-gray-300">
          <button
            onClick={() => setIsEditorOpen(true)}
            className="p-1 hover:bg-blue-100 rounded"
            title="Edit Section"
          >
            <Edit3 size={16} className="text-blue-600" />
          </button>

          {onMoveUp && (
            <button
              onClick={() => onMoveUp(id)}
              disabled={!canMoveUp}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
              title="Move Up"
            >
              <MoveUp size={16} />
            </button>
          )}

          {onMoveDown && (
            <button
              onClick={() => onMoveDown(id)}
              disabled={!canMoveDown}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
              title="Move Down"
            >
              <MoveDown size={16} />
            </button>
          )}

          <button
            onClick={() => onDelete(id)}
            className="p-1 hover:bg-red-100 rounded"
            title="Delete Section"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>

          <GripVertical size={16} className="text-gray-400 cursor-move" />
        </div>
      )}

      {/* Original Content */}
      {!isEditorOpen && children}

      {/* Inline Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Section</h3>
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Check size={16} className="mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} size="sm" variant="outline">
                  <X size={16} className="mr-2" />
                  Cancel
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Dynamic form fields based on content properties */}
              {editedContent.title !== undefined && (
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={editedContent.title || ""}
                    onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
                  />
                </div>
              )}

              {editedContent.subtitle !== undefined && (
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <Input
                    value={editedContent.subtitle || ""}
                    onChange={(e) => setEditedContent({ ...editedContent, subtitle: e.target.value })}
                  />
                </div>
              )}

              {editedContent.heading !== undefined && (
                <div>
                  <label className="block text-sm font-medium mb-2">Heading</label>
                  <Input
                    value={editedContent.heading || ""}
                    onChange={(e) => setEditedContent({ ...editedContent, heading: e.target.value })}
                  />
                </div>
              )}

              {editedContent.description !== undefined && (
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={editedContent.description || ""}
                    onChange={(e) => setEditedContent({ ...editedContent, description: e.target.value })}
                    rows={4}
                  />
                </div>
              )}

              {editedContent.text !== undefined && (
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <Textarea
                    value={editedContent.text || ""}
                    onChange={(e) => setEditedContent({ ...editedContent, text: e.target.value })}
                    rows={6}
                  />
                </div>
              )}

              {editedContent.buttonText !== undefined && (
                <div>
                  <label className="block text-sm font-medium mb-2">Button Text</label>
                  <Input
                    value={editedContent.buttonText || ""}
                    onChange={(e) => setEditedContent({ ...editedContent, buttonText: e.target.value })}
                  />
                </div>
              )}

              {editedContent.buttonLink !== undefined && (
                <div>
                  <label className="block text-sm font-medium mb-2">Button Link</label>
                  <Input
                    value={editedContent.buttonLink || ""}
                    onChange={(e) => setEditedContent({ ...editedContent, buttonLink: e.target.value })}
                    placeholder="/blog or https://example.com"
                  />
                </div>
              )}

              {editedContent.imageUrl !== undefined && (
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <Input
                    value={editedContent.imageUrl || ""}
                    onChange={(e) => setEditedContent({ ...editedContent, imageUrl: e.target.value })}
                    placeholder="/uploads/image.jpg"
                  />
                </div>
              )}

              {editedContent.link !== undefined && (
                <div>
                  <label className="block text-sm font-medium mb-2">Link</label>
                  <Input
                    value={editedContent.link || ""}
                    onChange={(e) => setEditedContent({ ...editedContent, link: e.target.value })}
                    placeholder="/page or https://example.com"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
