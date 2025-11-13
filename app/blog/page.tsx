import type { Metadata } from "next"
import { generateSEOMetadata } from "@/lib/seo-utils"
import { BlogClient } from "./blog-client"

export const metadata: Metadata = generateSEOMetadata({
  title: "Blog - Insights on Human Potential & Personal Development",
  description: "Explore thought-provoking articles about human potential, personal development, creativity, and transformation. Written by Dr. Ferdinand Ibu Ogbaji.",
  keywords: [
    "blog",
    "articles",
    "human potential",
    "personal development",
    "self improvement",
    "philosophy",
    "creativity",
    "transformation",
    "wellness",
    "mindfulness",
    "Dr Ferdinand Ibu Ogbaji"
  ],
  url: "/blog",
  type: "blog"
})

export default function BlogPage() {
  return <BlogClient />
}
