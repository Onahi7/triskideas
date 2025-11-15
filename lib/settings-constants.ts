// Default settings keys
export const SETTING_KEYS = {
  HERO_IMAGE: "hero_image",
  HERO_TITLE: "hero_title",
  HERO_SUBTITLE: "hero_subtitle",
  HERO_DESCRIPTION: "hero_description",
  ABOUT_IMAGE: "about_image",
  ABOUT_TITLE: "about_title",
  ABOUT_CONTENT: "about_content",
  AUTHOR_BIO: "author_bio",
  // Payment Gateway Settings
  PAYMENT_GATEWAY: "payment_gateway", // "paystack" | "opay" | "none"
  PAYSTACK_PUBLIC_KEY: "paystack_public_key",
  PAYSTACK_SECRET_KEY: "paystack_secret_key",
  OPAY_PUBLIC_KEY: "opay_public_key",
  OPAY_SECRET_KEY: "opay_secret_key",
  OPAY_MERCHANT_ID: "opay_merchant_id",
  // Color Theme Settings (Professional 7-Color Palette)
  PRIMARY_COLOR: "primary_color",           // Main brand color (buttons, CTAs)
  PRIMARY_DARK_COLOR: "primary_dark_color", // Darker variant (hover states)
  PRIMARY_LIGHT_COLOR: "primary_light_color", // Lighter variant (backgrounds)
  ACCENT_COLOR: "accent_color",             // Secondary/accent color (highlights)
  BACKGROUND_COLOR: "background_color",     // Page background
  TEXT_PRIMARY_COLOR: "text_primary_color", // Main text color
  TEXT_SECONDARY_COLOR: "text_secondary_color", // Secondary text (descriptions)
}

export const DEFAULT_COLORS = {
  PRIMARY_COLOR: "#d97706",        // Amber-700 - Main brand
  PRIMARY_DARK_COLOR: "#92400e",   // Amber-900 - Hover/active states
  PRIMARY_LIGHT_COLOR: "#fef3c7",  // Amber-100 - Light backgrounds
  ACCENT_COLOR: "#fed7aa",         // Amber-200 - Highlights/badges
  BACKGROUND_COLOR: "#fffbeb",     // Amber-50 - Page background
  TEXT_PRIMARY_COLOR: "#111827",   // Gray-900 - Main text
  TEXT_SECONDARY_COLOR: "#6b7280", // Gray-500 - Secondary text
}

// Professional color palette presets
export const COLOR_PRESETS = {
  AMBER: {
    name: "Warm Amber (Default)",
    colors: DEFAULT_COLORS,
  },
  BLUE: {
    name: "Professional Blue",
    colors: {
      PRIMARY_COLOR: "#2563eb",        // Blue-600
      PRIMARY_DARK_COLOR: "#1e40af",   // Blue-800
      PRIMARY_LIGHT_COLOR: "#dbeafe",  // Blue-100
      ACCENT_COLOR: "#93c5fd",         // Blue-300
      BACKGROUND_COLOR: "#eff6ff",     // Blue-50
      TEXT_PRIMARY_COLOR: "#111827",   // Gray-900
      TEXT_SECONDARY_COLOR: "#6b7280", // Gray-500
    },
  },
  GREEN: {
    name: "Fresh Green",
    colors: {
      PRIMARY_COLOR: "#059669",        // Emerald-600
      PRIMARY_DARK_COLOR: "#047857",   // Emerald-700
      PRIMARY_LIGHT_COLOR: "#d1fae5",  // Emerald-100
      ACCENT_COLOR: "#6ee7b7",         // Emerald-300
      BACKGROUND_COLOR: "#ecfdf5",     // Emerald-50
      TEXT_PRIMARY_COLOR: "#111827",   // Gray-900
      TEXT_SECONDARY_COLOR: "#6b7280", // Gray-500
    },
  },
  PURPLE: {
    name: "Creative Purple",
    colors: {
      PRIMARY_COLOR: "#7c3aed",        // Violet-600
      PRIMARY_DARK_COLOR: "#6d28d9",   // Violet-700
      PRIMARY_LIGHT_COLOR: "#ede9fe",  // Violet-100
      ACCENT_COLOR: "#c4b5fd",         // Violet-300
      BACKGROUND_COLOR: "#f5f3ff",     // Violet-50
      TEXT_PRIMARY_COLOR: "#111827",   // Gray-900
      TEXT_SECONDARY_COLOR: "#6b7280", // Gray-500
    },
  },
  RED: {
    name: "Bold Red",
    colors: {
      PRIMARY_COLOR: "#dc2626",        // Red-600
      PRIMARY_DARK_COLOR: "#b91c1c",   // Red-700
      PRIMARY_LIGHT_COLOR: "#fee2e2",  // Red-100
      ACCENT_COLOR: "#fca5a5",         // Red-300
      BACKGROUND_COLOR: "#fef2f2",     // Red-50
      TEXT_PRIMARY_COLOR: "#111827",   // Gray-900
      TEXT_SECONDARY_COLOR: "#6b7280", // Gray-500
    },
  },
  SLATE: {
    name: "Modern Slate",
    colors: {
      PRIMARY_COLOR: "#475569",        // Slate-600
      PRIMARY_DARK_COLOR: "#334155",   // Slate-700
      PRIMARY_LIGHT_COLOR: "#e2e8f0",  // Slate-200
      ACCENT_COLOR: "#94a3b8",         // Slate-400
      BACKGROUND_COLOR: "#f8fafc",     // Slate-50
      TEXT_PRIMARY_COLOR: "#0f172a",   // Slate-900
      TEXT_SECONDARY_COLOR: "#64748b", // Slate-500
    },
  },
  TEAL: {
    name: "Ocean Teal",
    colors: {
      PRIMARY_COLOR: "#0d9488",        // Teal-600
      PRIMARY_DARK_COLOR: "#0f766e",   // Teal-700
      PRIMARY_LIGHT_COLOR: "#ccfbf1",  // Teal-100
      ACCENT_COLOR: "#5eead4",         // Teal-300
      BACKGROUND_COLOR: "#f0fdfa",     // Teal-50
      TEXT_PRIMARY_COLOR: "#111827",   // Gray-900
      TEXT_SECONDARY_COLOR: "#6b7280", // Gray-500
    },
  },
}
