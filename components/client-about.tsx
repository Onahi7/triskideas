"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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

interface ClientAboutProps {
  title: string
  content: string
  imageUrl: string
}

export function ClientAbout({ title, content, imageUrl }: ClientAboutProps) {
  const contentParagraphs = content.split("\n\n").filter(Boolean)

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20"
      >
        <motion.div variants={itemVariants} className="space-y-6">
          <div>
            <h1 className="text-5xl font-bold text-amber-900 mb-6">{title}</h1>
            <p className="text-xl text-amber-700 mb-6 font-semibold">
              Medical Doctor | Artist | Thinker | Life Enthusiast
            </p>
          </div>
          {contentParagraphs.length > 0 ? (
            contentParagraphs.map((paragraph, idx) => (
              <p key={idx} className="text-lg text-gray-700 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))
          ) : (
            <>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Hello! I'm Ferdinand, and I'm passionate about helping people reach their full potential by unleashing
                their God-given abilities to make a positive change in our world.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                By profession, I'm a medical doctor. As a pursuit, I'm an artist. I love music, art, reading,
                travelling, thinking, and exploring new things. These diverse interests have shaped my perspective on
                human potential and creativity.
              </p>
              <p className="text-gray-700 leading-relaxed">
                I'm married to Florence and we reside in Jos, Nigeria, where I continue to practice medicine, create
                art, and explore the intersection of healing, creativity, and personal transformation.
              </p>
            </>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="w-full max-w-sm aspect-square bg-gradient-to-br from-amber-200 to-yellow-200 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
            <Image src={imageUrl} alt={title} width={500} height={500} className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
      >
        {[
          { icon: "⚕️", title: "Medical Practice", desc: "Dedicated to healing and improving patient outcomes" },
          { icon: "🎨", title: "Artistic Expression", desc: "Creating art as a form of expression and exploration" },
          { icon: "🌟", title: "Human Potential", desc: "Helping others discover and unlock their unique abilities" },
        ].map((item, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <div className="bg-white rounded-xl p-8 shadow-lg border border-amber-100 h-full hover:shadow-xl transition">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold text-amber-900 mb-3">{item.title}</h3>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
        className="bg-white rounded-xl p-12 shadow-lg border border-amber-100 mb-12"
      >
        <h2 className="text-3xl font-bold text-amber-900 mb-6">My Interests</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {["Music", "Art", "Reading", "Travelling", "Thinking", "Exploring"].map((interest) => (
            <div key={interest} className="flex items-center gap-3">
              <span className="text-2xl text-amber-700">•</span>
              <span className="text-lg text-gray-700">{interest}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
        className="text-center py-12"
      >
        <Link href="/blog">
          <Button className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-6 text-lg">Read My Articles</Button>
        </Link>
      </motion.div>
    </>
  )
}
