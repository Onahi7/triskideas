"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"
import { useState } from "react"
import { themeClasses } from "@/hooks/use-theme-colors"

export function BlogHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-theme-accent sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="flex flex-col items-center hover:opacity-80 transition">
          <Image
            src="/Gemini_Generated_Image_koz312koz312koz3.png"
            alt="TRISKIDEAS Logo"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
          <p className={`text-sm ${themeClasses.textPrimary} mt-1`}>The Mind's Fruit</p>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className={`${themeClasses.textPrimaryDark} ${themeClasses.hoverTextPrimary} transition font-medium`}>
            Home
          </Link>
          <Link href="/blog" className={`${themeClasses.textPrimaryDark} ${themeClasses.hoverTextPrimary} transition font-medium`}>
            Articles
          </Link>
          <Link href="/series" className={`${themeClasses.textPrimaryDark} ${themeClasses.hoverTextPrimary} transition font-medium`}>
            Series
          </Link>
          <Link href="/events" className={`${themeClasses.textPrimaryDark} ${themeClasses.hoverTextPrimary} transition font-medium`}>
            Events
          </Link>
          <Link href="/about" className={`${themeClasses.textPrimaryDark} ${themeClasses.hoverTextPrimary} transition font-medium`}>
            About
          </Link>
          <Link href="/contact" className={`${themeClasses.textPrimaryDark} ${themeClasses.hoverTextPrimary} transition font-medium`}>
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          <Menu size={24} className={themeClasses.textPrimaryDark} />
        </button>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        animate={{ height: mobileMenuOpen ? "auto" : 0 }}
        className={`md:hidden overflow-hidden ${themeClasses.bgBackground} border-t border-theme-accent`}
      >
        <nav className="flex flex-col gap-4 p-4">
          <Link
            href="/"
            className={`${themeClasses.textPrimaryDark} ${themeClasses.hoverTextPrimary} transition font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/blog"
            className={`${themeClasses.textPrimaryDark} ${themeClasses.hoverTextPrimary} transition font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Articles
          </Link>
          <Link
            href="/series"
            className={`${themeClasses.textPrimaryDark} ${themeClasses.hoverTextPrimary} transition font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Series
          </Link>
          <Link
            href="/events"
            className={`${themeClasses.textPrimaryDark} ${themeClasses.hoverTextPrimary} transition font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Events
          </Link>
          <Link
            href="/about"
            className={`${themeClasses.textPrimaryDark} ${themeClasses.hoverTextPrimary} transition font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`${themeClasses.textPrimaryDark} ${themeClasses.hoverTextPrimary} transition font-medium`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
        </nav>
      </motion.div>
    </header>
  )
}
