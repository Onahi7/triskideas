"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { themeClasses } from "@/hooks/use-theme-colors"

export function BlogHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  const getNavLinkClass = (path: string) => {
    return isActive(path)
      ? `${themeClasses.textPrimary} font-semibold border-b-2 border-theme-primary pb-1`
      : `${themeClasses.textPrimaryDark} ${themeClasses.hoverTextPrimary} transition font-medium`
  }

  const getMobileNavLinkClass = (path: string) => {
    return isActive(path)
      ? `${themeClasses.textPrimary} font-semibold bg-theme-primary-light px-3 py-2 rounded-lg`
      : `${themeClasses.textPrimaryDark} ${themeClasses.hoverTextPrimary} transition font-medium px-3 py-2`
  }

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
          <Link href="/" className={getNavLinkClass("/")}>
            Home
          </Link>
          <Link href="/blog" className={getNavLinkClass("/blog")}>
            Articles
          </Link>
          <Link href="/series" className={getNavLinkClass("/series")}>
            Series
          </Link>
          <Link href="/events" className={getNavLinkClass("/events")}>
            Events
          </Link>
          <Link href="/about" className={getNavLinkClass("/about")}>
            About
          </Link>
          <Link href="/contact" className={getNavLinkClass("/contact")}>
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
        <nav className="flex flex-col gap-2 p-4">
          <Link
            href="/"
            className={getMobileNavLinkClass("/")}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/blog"
            className={getMobileNavLinkClass("/blog")}
            onClick={() => setMobileMenuOpen(false)}
          >
            Articles
          </Link>
          <Link
            href="/series"
            className={getMobileNavLinkClass("/series")}
            onClick={() => setMobileMenuOpen(false)}
          >
            Series
          </Link>
          <Link
            href="/events"
            className={getMobileNavLinkClass("/events")}
            onClick={() => setMobileMenuOpen(false)}
          >
            Events
          </Link>
          <Link
            href="/about"
            className={getMobileNavLinkClass("/about")}
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={getMobileNavLinkClass("/contact")}
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
        </nav>
      </motion.div>
    </header>
  )
}
