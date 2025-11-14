"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

interface Post {
  id: number
  title: string
  excerpt: string
  imageUrl: string | null
  slug: string
  publishedAt: Date | null
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

function HeroContent({ title, subtitle, description }: { title: string; subtitle: string; description: string }) {
  return (
    <motion.div variants={itemVariants} className="space-y-8">
      <div>
        <motion.h2
          className="text-5xl md:text-6xl font-bold text-amber-900 mb-4 text-balance leading-tight"
          variants={itemVariants}
        >
          {title}
        </motion.h2>
        <motion.p className="text-xl text-amber-700 mb-2 font-semibold" variants={itemVariants}>
          {subtitle}
        </motion.p>
      </div>

      <motion.p className="text-lg text-gray-700 leading-relaxed text-balance" variants={itemVariants}>
        {description}
      </motion.p>

      <motion.p className="text-gray-600 leading-relaxed" variants={itemVariants}>
        I believe everyone possesses God-given abilities waiting to be unleashed. Through these articles, I share
        insights about unlocking your potential, making meaningful contributions, and living a life of purpose.
      </motion.p>

      <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
        <Link href="/blog">
          <Button className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Read Articles
          </Button>
        </Link>
        <Link href="/about">
          <Button
            variant="outline"
            className="border-2 border-amber-700 text-amber-700 hover:bg-amber-50 px-8 py-6 text-lg rounded-lg bg-transparent"
          >
            Learn More
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  )
}

function HeroImage({ imageUrl }: { imageUrl: string }) {
  const imageRef = useRef<HTMLDivElement>(null)
  
  // Track scroll position relative to the hero section
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start start", "end start"]
  })
  
  // Transform scroll progress to animation values
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]) // Parallax movement
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -8]) // Subtle rotation
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]) // Slight scale down
  
  return (
    <motion.div 
      ref={imageRef}
      variants={itemVariants} 
      className="flex justify-center"
    >
      <motion.div 
        style={{ y, rotate, scale }}
        className="w-full max-w-sm aspect-square bg-linear-to-br from-amber-200 to-yellow-200 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500"
      >
        <Image
          src={imageUrl}
          alt="Dr. Ferdinand Ibu Ogbaji"
          width={500}
          height={500}
          className="w-full h-full object-cover"
          priority
        />
      </motion.div>
    </motion.div>
  )
}

function FeaturedPosts({ posts }: { posts: Post[] }) {
  const featured = posts.slice(0, 3)

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="max-w-6xl mx-auto px-4 py-20"
    >
      <motion.div variants={itemVariants} className="mb-12">
        <h3 className="text-4xl font-bold text-amber-900 mb-4 text-center">Featured Insights</h3>
        <p className="text-center text-gray-600 text-lg">Explore the most impactful articles</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.length > 0 ? (
          featured.map((post, index) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              className={index === 2 ? "hidden lg:block" : "block"}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="group cursor-pointer h-full">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                    <div className="relative w-full overflow-hidden bg-gray-200">
                      <div className="relative aspect-4/3">
                        <Image
                          src={post.imageUrl || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <div className="p-8 flex flex-col grow">
                      <h4 className="text-xl font-bold text-amber-900 mb-3 group-hover:text-amber-700 transition line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-gray-600 mb-4 leading-relaxed grow line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-amber-100 mt-auto">
                        <span className="text-sm text-amber-700 font-medium">
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : ""}
                        </span>
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
          <motion.div variants={itemVariants} className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">Featured articles coming soon!</p>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

function CTASection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="max-w-6xl mx-auto px-4 py-20"
    >
      <motion.div
        variants={itemVariants}
        className="bg-linear-to-r from-amber-700 to-amber-800 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
      >
        <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore?</h3>
        <p className="text-lg mb-8 text-amber-50 text-balance">
          Discover insights on unlocking potential and making positive change
        </p>
        <Link href="/blog">
          <Button className="bg-white text-amber-700 hover:bg-amber-50 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
            Explore All Articles
          </Button>
        </Link>
      </motion.div>
    </motion.section>
  )
}

function HomePage({ 
  heroTitle, 
  heroSubtitle, 
  heroDescription, 
  heroImage, 
  featuredPosts 
}: { 
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  featuredPosts: Post[];
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
          <HeroContent
            title={heroTitle}
            subtitle={heroSubtitle}
            description={heroDescription}
          />

          <HeroImage
            imageUrl={heroImage}
          />
        </div>
      </motion.section>

      {/* Featured Articles Section */}
      <FeaturedPosts posts={featuredPosts} />

      {/* CTA Section */}
      <CTASection />
    </>
  )
}

export const ClientHome = {
  HomePage,
  HeroContent,
  HeroImage,
  FeaturedPosts,
  CTASection,
  containerVariants,
  itemVariants,
}
