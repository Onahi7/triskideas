"use client"

import { useEffect, useState } from "react"

export function useThemeColors() {
  const [colors, setColors] = useState({
    primary: "#d97706",
    primaryDark: "#92400e",
    accent: "#fed7aa",
    background: "#fffbeb",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = getComputedStyle(document.documentElement)
      setColors({
        primary: root.getPropertyValue("--color-primary").trim() || "#d97706",
        primaryDark: root.getPropertyValue("--color-primary-dark").trim() || "#92400e",
        accent: root.getPropertyValue("--color-accent").trim() || "#fed7aa",
        background: root.getPropertyValue("--color-background").trim() || "#fffbeb",
      })
    }
  }, [])

  return colors
}

// Utility function to get theme color classes
export const themeClasses = {
  // Backgrounds
  bgPrimary: "bg-theme-primary",
  bgPrimaryDark: "bg-theme-primary-dark",
  bgAccent: "bg-theme-accent",
  bgBackground: "bg-theme-background",
  
  // Text
  textPrimary: "text-theme-primary",
  textPrimaryDark: "text-theme-primary-dark",
  textAccent: "text-theme-accent",
  
  // Borders
  borderPrimary: "border-theme-primary",
  borderAccent: "border-theme-accent",
  
  // Hover states
  hoverBgPrimaryDark: "hover:bg-theme-primary-dark",
  hoverTextPrimary: "hover:text-theme-primary",
  hoverTextPrimaryDark: "hover:text-theme-primary-dark",
  
  // Combined classes for common patterns
  button: "bg-theme-primary hover:bg-theme-primary-dark text-white",
  buttonOutline: "border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white",
  link: "text-theme-primary hover:text-theme-primary-dark",
  heading: "text-theme-primary-dark",
  badge: "bg-theme-primary text-white",
}
