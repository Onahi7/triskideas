"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import { getPublishedPosts, type Post } from "@/lib/db-actions"

export function BlogClient() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [categories, setCategories] = useState<string[]>(["All"])

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const data = await getPublishedPosts()
      setPosts(data)
      setFilteredPosts(data)

      const uniqueCategories = ["All", ...new Set(data.map((p) => p.category || "Uncategorized"))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Failed to load posts", error)
    }
  }

  useEffect(() => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => (p.category || "Uncategorized") === selectedCategory)
    }

    setFilteredPosts(filtered)
  }, [searchTerm, selectedCategory, posts])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50">
      <BlogHeader />

      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mb-12">
          <h1 className="text-5xl font-bold text-amber-900 mb-4">All Articles</h1>
          <p className="text-xl text-amber-700">
            Exploring ideas about human potential, creativity, and transformation
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-2"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-amber-700" : ""}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <motion.div key={post.id} variants={itemVariants}>
                <Link href={`/blog/${post.slug}`}>
                  <div className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                      {post.imageUrl && (
                        <div className="md:col-span-1 relative h-48 md:h-auto overflow-hidden bg-gray-200">
                          <Image
                            src={post.imageUrl || "/placeholder.svg"}
                            alt={post.title}
                            width={250}
                            height={250}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            unoptimized
                          />
                        </div>
                      )}
                      <div
                        className={`${post.imageUrl ? "md:col-span-3" : "md:col-span-4"} p-8 flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            {post.featured && (
                              <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                                Featured
                              </span>
                            )}
                            {post.category && (
                              <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                                {post.category}
                              </span>
                            )}
                          </div>
                          <h3 className="text-2xl font-bold text-amber-900 mb-3 group-hover:text-amber-700 transition line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed line-clamp-3">{post.excerpt}</p>
                        </div>
                        <div className="flex items-center justify-between pt-6 mt-6 border-t border-amber-100">
                          <div className="flex flex-col">
                            <span className="text-sm text-amber-700 font-medium">
                              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                            <span className="text-xs text-gray-500">by {post.author}</span>
                          </div>
                          <span className="text-amber-700 font-semibold group-hover:translate-x-2 transition-transform">
                            Read →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants} className="text-center py-20">
              <p className="text-gray-500 text-lg">No articles match your search. Try different keywords!</p>
            </motion.div>
          )}
        </motion.div>
      </section>

      <BlogFooter />
    </main>
  )
}