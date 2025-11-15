"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getAllSettings, updateSettings } from "@/lib/settings-actions"
import { SETTING_KEYS, DEFAULT_COLORS, COLOR_PRESETS } from "@/lib/settings-constants"
import { ImageUploadModal } from "@/components/image-upload-modal"
import { Save, Settings, Palette } from "lucide-react"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    [SETTING_KEYS.HERO_IMAGE]: "",
    [SETTING_KEYS.HERO_TITLE]: "The Mind's Fruit",
    [SETTING_KEYS.HERO_SUBTITLE]: "Ideas That Awaken Your Potential",
    [SETTING_KEYS.HERO_DESCRIPTION]: "Welcome to TRISKIDEAS. I'm Ferdinand Ibu Ogbaji—a medical doctor, artist, and passionate explorer of human potential. Here, we delve into the intersection of medicine, creativity, and personal transformation.",
    [SETTING_KEYS.ABOUT_IMAGE]: "",
    [SETTING_KEYS.ABOUT_TITLE]: "About Dr. Ferdinand Ibu Ogbaji",
    [SETTING_KEYS.ABOUT_CONTENT]: "",
    [SETTING_KEYS.AUTHOR_BIO]: "Dr. Ferdinand Ibu Ogbaji is a passionate medical doctor, artist, and thinker based in Jos, Nigeria. He is dedicated to helping people unlock their God-given potential and make positive contributions to society. Married to Florence, Ferdinand combines his medical expertise with artistic creativity to explore transformative ideas.",
    [SETTING_KEYS.PAYMENT_GATEWAY]: "none",
    [SETTING_KEYS.PAYSTACK_PUBLIC_KEY]: "",
    [SETTING_KEYS.PAYSTACK_SECRET_KEY]: "",
    [SETTING_KEYS.OPAY_PUBLIC_KEY]: "",
    [SETTING_KEYS.OPAY_SECRET_KEY]: "",
    [SETTING_KEYS.OPAY_MERCHANT_ID]: "",
    [SETTING_KEYS.PRIMARY_COLOR]: DEFAULT_COLORS.PRIMARY_COLOR,
    [SETTING_KEYS.PRIMARY_DARK_COLOR]: DEFAULT_COLORS.PRIMARY_DARK_COLOR,
    [SETTING_KEYS.PRIMARY_LIGHT_COLOR]: DEFAULT_COLORS.PRIMARY_LIGHT_COLOR,
    [SETTING_KEYS.ACCENT_COLOR]: DEFAULT_COLORS.ACCENT_COLOR,
    [SETTING_KEYS.BACKGROUND_COLOR]: DEFAULT_COLORS.BACKGROUND_COLOR,
    [SETTING_KEYS.TEXT_PRIMARY_COLOR]: DEFAULT_COLORS.TEXT_PRIMARY_COLOR,
    [SETTING_KEYS.TEXT_SECONDARY_COLOR]: DEFAULT_COLORS.TEXT_SECONDARY_COLOR,
  })

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    // Apply color theme when settings load
    applyColorTheme()
  }, [settings])

  const loadSettings = async () => {
    try {
      const data = await getAllSettings()
      const settingsMap: Record<string, string> = {}
      
      data.forEach(setting => {
        if (setting.value) {
          settingsMap[setting.key] = setting.value
        }
      })
      
      setSettings(prev => ({ ...prev, ...settingsMap }))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateSettings(settings)
      
      // Apply color theme immediately
      applyColorTheme()
      
      toast({
        title: "Success",
        description: "Settings saved successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const applyColorTheme = () => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      root.style.setProperty('--color-primary', settings[SETTING_KEYS.PRIMARY_COLOR])
      root.style.setProperty('--color-primary-dark', settings[SETTING_KEYS.PRIMARY_DARK_COLOR])
      root.style.setProperty('--color-primary-light', settings[SETTING_KEYS.PRIMARY_LIGHT_COLOR])
      root.style.setProperty('--color-accent', settings[SETTING_KEYS.ACCENT_COLOR])
      root.style.setProperty('--color-background', settings[SETTING_KEYS.BACKGROUND_COLOR])
      root.style.setProperty('--color-text-primary', settings[SETTING_KEYS.TEXT_PRIMARY_COLOR])
      root.style.setProperty('--color-text-secondary', settings[SETTING_KEYS.TEXT_SECONDARY_COLOR])
    }
  }

  const applyPreset = (presetKey: keyof typeof COLOR_PRESETS) => {
    const preset = COLOR_PRESETS[presetKey]
    setSettings(prev => ({
      ...prev,
      [SETTING_KEYS.PRIMARY_COLOR]: preset.colors.PRIMARY_COLOR,
      [SETTING_KEYS.PRIMARY_DARK_COLOR]: preset.colors.PRIMARY_DARK_COLOR,
      [SETTING_KEYS.PRIMARY_LIGHT_COLOR]: preset.colors.PRIMARY_LIGHT_COLOR,
      [SETTING_KEYS.ACCENT_COLOR]: preset.colors.ACCENT_COLOR,
      [SETTING_KEYS.BACKGROUND_COLOR]: preset.colors.BACKGROUND_COLOR,
      [SETTING_KEYS.TEXT_PRIMARY_COLOR]: preset.colors.TEXT_PRIMARY_COLOR,
      [SETTING_KEYS.TEXT_SECONDARY_COLOR]: preset.colors.TEXT_SECONDARY_COLOR,
    }))
    toast({
      title: "Preset Applied",
      description: `${preset.name} color scheme applied. Click Save to keep changes.`,
    })
  }

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="text-amber-700" size={32} />
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-600 mt-1">Customize your homepage and about page</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section (Homepage)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Hero Image</label>
              <ImageUploadModal
                onUploadSuccess={(url) => updateSetting(SETTING_KEYS.HERO_IMAGE, url)}
                currentImage={settings[SETTING_KEYS.HERO_IMAGE]}
              />
              {settings[SETTING_KEYS.HERO_IMAGE] && (
                <p className="text-sm text-green-600 mt-2">✓ Image uploaded</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 500x500px portrait photo
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Title</label>
              <Input
                value={settings[SETTING_KEYS.HERO_TITLE]}
                onChange={(e) => updateSetting(SETTING_KEYS.HERO_TITLE, e.target.value)}
                placeholder="The Mind's Fruit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Subtitle</label>
              <Input
                value={settings[SETTING_KEYS.HERO_SUBTITLE]}
                onChange={(e) => updateSetting(SETTING_KEYS.HERO_SUBTITLE, e.target.value)}
                placeholder="Ideas That Awaken Your Potential"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
              <Textarea
                value={settings[SETTING_KEYS.HERO_DESCRIPTION]}
                onChange={(e) => updateSetting(SETTING_KEYS.HERO_DESCRIPTION, e.target.value)}
                placeholder="Welcome message..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* About Section Settings */}
        <Card>
          <CardHeader>
            <CardTitle>About Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">About Page Image</label>
              <ImageUploadModal
                onUploadSuccess={(url) => updateSetting(SETTING_KEYS.ABOUT_IMAGE, url)}
                currentImage={settings[SETTING_KEYS.ABOUT_IMAGE]}
              />
              {settings[SETTING_KEYS.ABOUT_IMAGE] && (
                <p className="text-sm text-green-600 mt-2">✓ Image uploaded</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">About Page Title</label>
              <Input
                value={settings[SETTING_KEYS.ABOUT_TITLE]}
                onChange={(e) => updateSetting(SETTING_KEYS.ABOUT_TITLE, e.target.value)}
                placeholder="About Dr. Ferdinand Ibu Ogbaji"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">About Page Content</label>
              <Textarea
                value={settings[SETTING_KEYS.ABOUT_CONTENT]}
                onChange={(e) => updateSetting(SETTING_KEYS.ABOUT_CONTENT, e.target.value)}
                placeholder="Tell your story..."
                rows={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Author Bio (Footer)</label>
              <Textarea
                value={settings[SETTING_KEYS.AUTHOR_BIO]}
                onChange={(e) => updateSetting(SETTING_KEYS.AUTHOR_BIO, e.target.value)}
                placeholder="Short bio for blog posts..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Color Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="text-amber-700" size={24} />
              Professional Color Theme (7 Colors)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-gray-600 mb-4">
              Choose from professional presets or customize your own 7-color palette. Changes apply instantly across all pages.
            </p>

            {/* Color Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Quick Presets</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(COLOR_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyPreset(key as keyof typeof COLOR_PRESETS)}
                    className="p-3 border-2 border-gray-200 rounded-lg hover:border-gray-400 transition group"
                  >
                    <div className="flex gap-1 mb-2">
                      <div 
                        className="w-6 h-6 rounded" 
                        style={{ backgroundColor: preset.colors.PRIMARY_COLOR }}
                      />
                      <div 
                        className="w-6 h-6 rounded" 
                        style={{ backgroundColor: preset.colors.PRIMARY_DARK_COLOR }}
                      />
                      <div 
                        className="w-6 h-6 rounded" 
                        style={{ backgroundColor: preset.colors.ACCENT_COLOR }}
                      />
                    </div>
                    <p className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
                      {preset.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Custom Color Palette</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primary Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Primary Color</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={settings[SETTING_KEYS.PRIMARY_COLOR]}
                      onChange={(e) => updateSetting(SETTING_KEYS.PRIMARY_COLOR, e.target.value)}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={settings[SETTING_KEYS.PRIMARY_COLOR]}
                      onChange={(e) => updateSetting(SETTING_KEYS.PRIMARY_COLOR, e.target.value)}
                      placeholder="#d97706"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Main brand color (buttons, CTAs)</p>
                </div>

                {/* Primary Dark */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Primary Dark</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={settings[SETTING_KEYS.PRIMARY_DARK_COLOR]}
                      onChange={(e) => updateSetting(SETTING_KEYS.PRIMARY_DARK_COLOR, e.target.value)}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={settings[SETTING_KEYS.PRIMARY_DARK_COLOR]}
                      onChange={(e) => updateSetting(SETTING_KEYS.PRIMARY_DARK_COLOR, e.target.value)}
                      placeholder="#92400e"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Hover states, active elements</p>
                </div>

                {/* Primary Light */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Primary Light</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={settings[SETTING_KEYS.PRIMARY_LIGHT_COLOR]}
                      onChange={(e) => updateSetting(SETTING_KEYS.PRIMARY_LIGHT_COLOR, e.target.value)}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={settings[SETTING_KEYS.PRIMARY_LIGHT_COLOR]}
                      onChange={(e) => updateSetting(SETTING_KEYS.PRIMARY_LIGHT_COLOR, e.target.value)}
                      placeholder="#fef3c7"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Light backgrounds, subtle highlights</p>
                </div>

                {/* Accent */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Accent Color</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={settings[SETTING_KEYS.ACCENT_COLOR]}
                      onChange={(e) => updateSetting(SETTING_KEYS.ACCENT_COLOR, e.target.value)}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={settings[SETTING_KEYS.ACCENT_COLOR]}
                      onChange={(e) => updateSetting(SETTING_KEYS.ACCENT_COLOR, e.target.value)}
                      placeholder="#fed7aa"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Secondary highlights, badges</p>
                </div>

                {/* Background */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Background Color</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={settings[SETTING_KEYS.BACKGROUND_COLOR]}
                      onChange={(e) => updateSetting(SETTING_KEYS.BACKGROUND_COLOR, e.target.value)}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={settings[SETTING_KEYS.BACKGROUND_COLOR]}
                      onChange={(e) => updateSetting(SETTING_KEYS.BACKGROUND_COLOR, e.target.value)}
                      placeholder="#fffbeb"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Page background, section fills</p>
                </div>

                {/* Text Primary */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Text Primary</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={settings[SETTING_KEYS.TEXT_PRIMARY_COLOR]}
                      onChange={(e) => updateSetting(SETTING_KEYS.TEXT_PRIMARY_COLOR, e.target.value)}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={settings[SETTING_KEYS.TEXT_PRIMARY_COLOR]}
                      onChange={(e) => updateSetting(SETTING_KEYS.TEXT_PRIMARY_COLOR, e.target.value)}
                      placeholder="#111827"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Main text, headings</p>
                </div>

                {/* Text Secondary */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Text Secondary</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="color"
                      value={settings[SETTING_KEYS.TEXT_SECONDARY_COLOR]}
                      onChange={(e) => updateSetting(SETTING_KEYS.TEXT_SECONDARY_COLOR, e.target.value)}
                      className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={settings[SETTING_KEYS.TEXT_SECONDARY_COLOR]}
                      onChange={(e) => updateSetting(SETTING_KEYS.TEXT_SECONDARY_COLOR, e.target.value)}
                      placeholder="#6b7280"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Descriptions, captions, meta text</p>
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div className="p-6 rounded-lg border" 
                 style={{ 
                   background: `linear-gradient(135deg, ${settings[SETTING_KEYS.BACKGROUND_COLOR]} 0%, ${settings[SETTING_KEYS.PRIMARY_LIGHT_COLOR]} 100%)`
                 }}>
              <h3 className="text-2xl font-bold mb-2" style={{ color: settings[SETTING_KEYS.TEXT_PRIMARY_COLOR] }}>
                Color Preview
              </h3>
              <p className="mb-4" style={{ color: settings[SETTING_KEYS.TEXT_SECONDARY_COLOR] }}>
                This is how your professional color palette will look on the website.
              </p>
              <div className="flex gap-3 flex-wrap">
                <button 
                  className="px-6 py-2 rounded text-white font-medium"
                  style={{ backgroundColor: settings[SETTING_KEYS.PRIMARY_COLOR] }}
                >
                  Primary Button
                </button>
                <button 
                  className="px-6 py-2 rounded text-white font-medium"
                  style={{ backgroundColor: settings[SETTING_KEYS.PRIMARY_DARK_COLOR] }}
                >
                  Dark Button
                </button>
                <span 
                  className="px-4 py-2 rounded font-medium"
                  style={{ 
                    backgroundColor: settings[SETTING_KEYS.ACCENT_COLOR],
                    color: settings[SETTING_KEYS.PRIMARY_DARK_COLOR]
                  }}
                >
                  Accent Badge
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  updateSetting(SETTING_KEYS.PRIMARY_COLOR, DEFAULT_COLORS.PRIMARY_COLOR)
                  updateSetting(SETTING_KEYS.PRIMARY_DARK_COLOR, DEFAULT_COLORS.PRIMARY_DARK_COLOR)
                  updateSetting(SETTING_KEYS.ACCENT_COLOR, DEFAULT_COLORS.ACCENT_COLOR)
                  updateSetting(SETTING_KEYS.BACKGROUND_COLOR, DEFAULT_COLORS.BACKGROUND_COLOR)
                }}
              >
                Reset to Default Colors
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Gateway Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Gateway Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Payment Gateway</label>
              <select
                value={settings[SETTING_KEYS.PAYMENT_GATEWAY]}
                onChange={(e) => updateSetting(SETTING_KEYS.PAYMENT_GATEWAY, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="none">None (Free events only)</option>
                <option value="paystack">Paystack</option>
                <option value="opay">OPay</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Choose a payment gateway for paid events
              </p>
            </div>

            {settings[SETTING_KEYS.PAYMENT_GATEWAY] === "paystack" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Paystack Public Key</label>
                  <Input
                    type="text"
                    value={settings[SETTING_KEYS.PAYSTACK_PUBLIC_KEY]}
                    onChange={(e) => updateSetting(SETTING_KEYS.PAYSTACK_PUBLIC_KEY, e.target.value)}
                    placeholder="pk_test_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Paystack Secret Key</label>
                  <Input
                    type="password"
                    value={settings[SETTING_KEYS.PAYSTACK_SECRET_KEY]}
                    onChange={(e) => updateSetting(SETTING_KEYS.PAYSTACK_SECRET_KEY, e.target.value)}
                    placeholder="sk_test_..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get your keys from{" "}
                    <a
                      href="https://dashboard.paystack.com/#/settings/developers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-700 underline"
                    >
                      Paystack Dashboard
                    </a>
                  </p>
                </div>
              </>
            )}

            {settings[SETTING_KEYS.PAYMENT_GATEWAY] === "opay" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">OPay Merchant ID</label>
                  <Input
                    type="text"
                    value={settings[SETTING_KEYS.OPAY_MERCHANT_ID]}
                    onChange={(e) => updateSetting(SETTING_KEYS.OPAY_MERCHANT_ID, e.target.value)}
                    placeholder="256612345678901"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">OPay Public Key</label>
                  <Input
                    type="text"
                    value={settings[SETTING_KEYS.OPAY_PUBLIC_KEY]}
                    onChange={(e) => updateSetting(SETTING_KEYS.OPAY_PUBLIC_KEY, e.target.value)}
                    placeholder="OPAYPUB..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">OPay Secret Key</label>
                  <Input
                    type="password"
                    value={settings[SETTING_KEYS.OPAY_SECRET_KEY]}
                    onChange={(e) => updateSetting(SETTING_KEYS.OPAY_SECRET_KEY, e.target.value)}
                    placeholder="OPAYPRV..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get your credentials from your OPay merchant dashboard
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-amber-700 hover:bg-amber-800 text-white"
            disabled={saving}
          >
            <Save size={16} className="mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={loadSettings}
            disabled={saving}
          >
            Reset Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
