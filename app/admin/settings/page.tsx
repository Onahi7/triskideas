"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getAllSettings, updateSettings } from "@/lib/settings-actions"
import { SETTING_KEYS } from "@/lib/settings-constants"
import { ImageUploadModal } from "@/components/image-upload-modal"
import { Save, Settings } from "lucide-react"

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
  })

  useEffect(() => {
    loadSettings()
  }, [])

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
