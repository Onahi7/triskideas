"use client"

import { useEffect } from "react"
import { getAllSettings } from "@/lib/settings-actions"
import { SETTING_KEYS, DEFAULT_COLORS } from "@/lib/settings-constants"

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const loadAndApplyTheme = async () => {
      try {
        const settings = await getAllSettings()
        const colorSettings: Record<string, string> = {}

        settings.forEach((setting) => {
          if (setting.value && Object.values(SETTING_KEYS).includes(setting.key)) {
            colorSettings[setting.key] = setting.value
          }
        })

        // Apply color theme to CSS variables (7-color professional palette)
        if (typeof document !== "undefined") {
          const root = document.documentElement

          root.style.setProperty(
            "--color-primary",
            colorSettings[SETTING_KEYS.PRIMARY_COLOR] || DEFAULT_COLORS.PRIMARY_COLOR
          )
          root.style.setProperty(
            "--color-primary-dark",
            colorSettings[SETTING_KEYS.PRIMARY_DARK_COLOR] || DEFAULT_COLORS.PRIMARY_DARK_COLOR
          )
          root.style.setProperty(
            "--color-primary-light",
            colorSettings[SETTING_KEYS.PRIMARY_LIGHT_COLOR] || DEFAULT_COLORS.PRIMARY_LIGHT_COLOR
          )
          root.style.setProperty(
            "--color-accent",
            colorSettings[SETTING_KEYS.ACCENT_COLOR] || DEFAULT_COLORS.ACCENT_COLOR
          )
          root.style.setProperty(
            "--color-background",
            colorSettings[SETTING_KEYS.BACKGROUND_COLOR] || DEFAULT_COLORS.BACKGROUND_COLOR
          )
          root.style.setProperty(
            "--color-text-primary",
            colorSettings[SETTING_KEYS.TEXT_PRIMARY_COLOR] || DEFAULT_COLORS.TEXT_PRIMARY_COLOR
          )
          root.style.setProperty(
            "--color-text-secondary",
            colorSettings[SETTING_KEYS.TEXT_SECONDARY_COLOR] || DEFAULT_COLORS.TEXT_SECONDARY_COLOR
          )
        }
      } catch (error) {
        console.error("Failed to load color theme:", error)
      }
    }

    loadAndApplyTheme()
  }, [])

  return <>{children}</>
}
