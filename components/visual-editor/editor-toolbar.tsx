"use client"

import { Button } from "@/components/ui/button"
import { Undo, Redo, Eye, Edit3, Save, X, Plus, Trash2 } from "lucide-react"

interface EditorToolbarProps {
  isEditing: boolean
  canUndo: boolean
  canRedo: boolean
  hasChanges: boolean
  onToggleEdit: () => void
  onUndo: () => void
  onRedo: () => void
  onSave: () => void
  onCancel: () => void
  onAddSection?: () => void
}

export function EditorToolbar({
  isEditing,
  canUndo,
  canRedo,
  hasChanges,
  onToggleEdit,
  onUndo,
  onRedo,
  onSave,
  onCancel,
  onAddSection,
}: EditorToolbarProps) {
  return (
    <div className="fixed top-20 right-4 z-50 bg-white shadow-2xl rounded-lg p-4 border-2 border-gray-200">
      <div className="flex flex-col gap-2">
        {/* Edit Mode Toggle */}
        <Button
          onClick={onToggleEdit}
          variant={isEditing ? "default" : "outline"}
          className="w-full justify-start gap-2"
        >
          {isEditing ? (
            <>
              <Eye size={16} />
              Preview
            </>
          ) : (
            <>
              <Edit3 size={16} />
              Edit Mode
            </>
          )}
        </Button>

        {isEditing && (
          <>
            <div className="border-t border-gray-200 my-2" />

            {/* Undo/Redo */}
            <div className="flex gap-2">
              <Button
                onClick={onUndo}
                disabled={!canUndo}
                variant="outline"
                size="sm"
                className="flex-1"
                title="Undo (Ctrl+Z)"
              >
                <Undo size={16} />
              </Button>
              <Button
                onClick={onRedo}
                disabled={!canRedo}
                variant="outline"
                size="sm"
                className="flex-1"
                title="Redo (Ctrl+Y)"
              >
                <Redo size={16} />
              </Button>
            </div>

            {/* Add Section */}
            {onAddSection && (
              <Button onClick={onAddSection} variant="outline" className="w-full justify-start gap-2" size="sm">
                <Plus size={16} />
                Add Section
              </Button>
            )}

            <div className="border-t border-gray-200 my-2" />

            {/* Save/Cancel */}
            <Button
              onClick={onSave}
              disabled={!hasChanges}
              className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700"
            >
              <Save size={16} />
              Save Changes
            </Button>

            <Button onClick={onCancel} variant="outline" className="w-full justify-start gap-2">
              <X size={16} />
              Cancel
            </Button>

            {hasChanges && (
              <p className="text-xs text-orange-600 text-center mt-2">You have unsaved changes</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
