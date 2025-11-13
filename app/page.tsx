import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { getSettings } from "@/lib/settings-actions"
import { SETTING_KEYS } from "@/lib/settings-constants"
import { getFeaturedPosts } from "@/lib/db-actions"
import { HomePageClient } from "@/components/home-page-client"

export default async function Home() {
  const settings = await getSettings([
    SETTING_KEYS.HERO_IMAGE,
    SETTING_KEYS.HERO_TITLE,
    SETTING_KEYS.HERO_SUBTITLE,
    SETTING_KEYS.HERO_DESCRIPTION,
  ])
  
  const featuredPosts = await getFeaturedPosts(2)

  return (
    <main className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
      <BlogHeader />
      <HomePageClient
        heroTitle={settings[SETTING_KEYS.HERO_TITLE] || "The Mind's Fruit"}
        heroSubtitle={settings[SETTING_KEYS.HERO_SUBTITLE] || "Ideas That Awaken Your Potential"}
        heroDescription={settings[SETTING_KEYS.HERO_DESCRIPTION] || "Welcome to TRISKIDEAS. I'm Ferdinand Ibu Ogbaji—a medical doctor, artist, and passionate explorer of human potential. Here, we delve into the intersection of medicine, creativity, and personal transformation."}
        heroImage={settings[SETTING_KEYS.HERO_IMAGE] && settings[SETTING_KEYS.HERO_IMAGE].trim() !== '' ? settings[SETTING_KEYS.HERO_IMAGE] : "/IMG-20251113-WA0001.jpg"}
        featuredPosts={featuredPosts}
      />
      <BlogFooter />
    </main>
  )
}
