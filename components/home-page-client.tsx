"use client"

import { motion } from "framer-motion"
import { ClientHome } from "@/components/client-home"

interface Post {
  id: number
  title: string
  excerpt: string
  imageUrl: string | null
  slug: string
  publishedAt: Date | null
}

interface Series {
  id: number
  title: string
  description: string
  imageUrl: string | null
  slug: string
  publishedAt: Date | null
  episodeCount?: number
}

interface Event {
  id: number
  title: string
  description: string
  imageUrl: string | null
  slug: string
  startDate: Date
  eventType: string
  location: string | null
  published: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
}

export function HomePageClient({ 
  heroTitle, 
  heroSubtitle, 
  heroDescription, 
  heroImage, 
  featuredPosts,
  seriesList,
  eventsList
}: { 
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  featuredPosts: Post[];
  seriesList: Series[];
  eventsList: Event[];
}) {
  return (
    <>
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto px-4 py-20 md:py-28"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <ClientHome.HeroContent
            title={heroTitle}
            subtitle={heroSubtitle}
            description={heroDescription}
          />

          <ClientHome.HeroImage
            imageUrl={heroImage}
          />
        </div>
      </motion.section>

      {/* Featured Articles Section */}
      <ClientHome.FeaturedPosts posts={featuredPosts} />

      {/* Series Section */}
      <ClientHome.SeriesSection seriesList={seriesList} />

      {/* Events Section */}
      <ClientHome.EventsSection eventsList={eventsList} />

      {/* CTA Section */}
      <ClientHome.CTASection />
    </>
  )
}
