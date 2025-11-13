import Image from "next/image"
import Link from "next/link"
import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { Button } from "@/components/ui/button"
import { getSettings } from "@/lib/settings-actions"
import { SETTING_KEYS } from "@/lib/settings-constants"
import { ClientAbout } from "@/components/client-about"

export default async function AboutPage() {
  const settings = await getSettings([
    SETTING_KEYS.ABOUT_IMAGE,
    SETTING_KEYS.ABOUT_TITLE,
    SETTING_KEYS.ABOUT_CONTENT,
  ])

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <BlogHeader />

      <section className="max-w-5xl mx-auto px-4 py-20">
        <ClientAbout
          title={settings[SETTING_KEYS.ABOUT_TITLE] || "Dr. Ferdinand Ibu Ogbaji"}
          content={settings[SETTING_KEYS.ABOUT_CONTENT] || "Hello! I'm Ferdinand, and I'm passionate about helping people reach their full potential by unleashing their God-given abilities to make a positive change in our world.\n\nBy profession, I'm a medical doctor. As a pursuit, I'm an artist. I love music, art, reading, travelling, thinking, and exploring new things. These diverse interests have shaped my perspective on human potential and creativity.\n\nI'm married to Florence and we reside in Jos, Nigeria, where I continue to practice medicine, create art, and explore the intersection of healing, creativity, and personal transformation."}
          imageUrl={settings[SETTING_KEYS.ABOUT_IMAGE] && settings[SETTING_KEYS.ABOUT_IMAGE].trim() !== '' ? settings[SETTING_KEYS.ABOUT_IMAGE] : "/IMG-20251113-WA0001.jpg"}
        />
      </section>

      <BlogFooter />
    </main>
  )
}
