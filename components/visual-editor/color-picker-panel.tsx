"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Palette, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updateSettings } from "@/lib/settings-actions"
import { SETTING_KEYS, DEFAULT_COLORS } from "@/lib/settings-constants"

interface ColorPickerPanelProps {
  onColorsChange?: () => void
}

export function ColorPickerPanel({ onColorsChange }: ColorPickerPanelProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [colors, setColors] = useState({
    primary: DEFAULT_COLORS.PRIMARY_COLOR,
    primaryDark: DEFAULT_COLORS.PRIMARY_DARK_COLOR,
    accent: DEFAULT_COLORS.ACCENT_COLOR,
    background: DEFAULT_COLORS.BACKGROUND_COLOR,
  })

  const applyColors = () => {
    if (typeof document !== "undefined") {
      const root = document.documentElement
      root.style.setProperty("--color-primary", colors.primary)
      root.style.setProperty("--color-primary-dark", colors.primaryDark)
      root.style.setProperty("--color-accent", colors.accent)
      root.style.setProperty("--color-background", colors.background)
    }
  }

  const handleColorChange = (key: string, value: string) => {
    const newColors = { ...colors, [key]: value }
    setColors(newColors)
    
    // Apply immediately for live preview
    if (typeof document !== "undefined") {
      const root = document.documentElement
      if (key === "primary") root.style.setProperty("--color-primary", value)
      if (key === "primaryDark") root.style.setProperty("--color-primary-dark", value)
      if (key === "accent") root.style.setProperty("--color-accent", value)
      if (key === "background") root.style.setProperty("--color-background", value)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSettings({
        [SETTING_KEYS.PRIMARY_COLOR]: colors.primary,
        [SETTING_KEYS.PRIMARY_DARK_COLOR]: colors.primaryDark,
        [SETTING_KEYS.ACCENT_COLOR]: colors.accent,
        [SETTING_KEYS.BACKGROUND_COLOR]: colors.background,
      })

      toast({
        title: "Colors Saved!",
        description: "Your color scheme has been updated.",
      })

      if (onColorsChange) onColorsChange()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save colors",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setColors({
      primary: DEFAULT_COLORS.PRIMARY_COLOR,
      primaryDark: DEFAULT_COLORS.PRIMARY_DARK_COLOR,
      accent: DEFAULT_COLORS.ACCENT_COLOR,
      background: DEFAULT_COLORS.BACKGROUND_COLOR,
    })
    applyColors()
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-2xl z-50"
        title="Change Site Colors"
      >
        <Palette size={24} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white shadow-2xl rounded-lg p-4 border-2 border-purple-200 w-80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Palette className="text-purple-600" size={20} />
          <h3 className="font-semibold">Site Colors</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {/* Primary Color */}
        <div>
          <label className="block text-xs font-medium mb-1">Primary Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colors.primary}
              onChange={(e) => handleColorChange("primary", e.target.value)}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <Input
              type="text"
              value={colors.primary}
              onChange={(e) => handleColorChange("primary", e.target.value)}
              className="flex-1 text-sm"
              placeholder="#d97706"
            />
          </div>
        </div>

        {/* Primary Dark */}
        <div>
          <label className="block text-xs font-medium mb-1">Primary Dark</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colors.primaryDark}
              onChange={(e) => handleColorChange("primaryDark", e.target.value)}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <Input
              type="text"
              value={colors.primaryDark}
              onChange={(e) => handleColorChange("primaryDark", e.target.value)}
              className="flex-1 text-sm"
              placeholder="#92400e"
            />
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-xs font-medium mb-1">Accent Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colors.accent}
              onChange={(e) => handleColorChange("accent", e.target.value)}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <Input
              type="text"
              value={colors.accent}
              onChange={(e) => handleColorChange("accent", e.target.value)}
              className="flex-1 text-sm"
              placeholder="#fed7aa"
            />
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-xs font-medium mb-1">Background</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={colors.background}
              onChange={(e) => handleColorChange("background", e.target.value)}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <Input
              type="text"
              value={colors.background}
              onChange={(e) => handleColorChange("background", e.target.value)}
              className="flex-1 text-sm"
              placeholder="#fffbeb"
            />
          </div>
        </div>

        {/* Preview */}
        <div
          className="p-3 rounded border-2"
          style={{
            background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.accent} 100%)`,
          }}
        >
          <p className="text-sm font-semibold mb-2" style={{ color: colors.primaryDark }}>
            Preview
          </p>
          <button
            className="px-3 py-1 rounded text-white text-sm font-medium"
            style={{ backgroundColor: colors.primary }}
          >
            Sample Button
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Check size={14} className="mr-1" />
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button onClick={handleReset} variant="outline" size="sm">
            Reset
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Changes apply instantly. Click Save to keep them.
        </p>
      </div>
    </div>
  )
}
