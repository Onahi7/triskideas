"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"
import { useState } from "react"

export function BlogHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-amber-100 sticky top-0 z-30 shadow-sm">
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
          <p className="text-sm text-amber-700 mt-1">The Mind's Fruit</p>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-amber-900 hover:text-amber-700 transition font-medium">
            Home
          </Link>
          <Link href="/blog" className="text-amber-900 hover:text-amber-700 transition font-medium">
            Articles
          </Link>
          <Link href="/series" className="text-amber-900 hover:text-amber-700 transition font-medium">
            Series
          </Link>
          <Link href="/events" className="text-amber-900 hover:text-amber-700 transition font-medium">
            Events
          </Link>
          <Link href="/about" className="text-amber-900 hover:text-amber-700 transition font-medium">
            About
          </Link>
          <Link href="/contact" className="text-amber-900 hover:text-amber-700 transition font-medium">
            Contact
          </Link>
          <Link href="/admin">
            <Button className="bg-amber-700 hover:bg-amber-800 text-white">Admin</Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          <Menu size={24} className="text-amber-900" />
        </button>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        animate={{ height: mobileMenuOpen ? "auto" : 0 }}
        className="md:hidden overflow-hidden bg-amber-50 border-t border-amber-100"
      >
        <nav className="flex flex-col gap-4 p-4">
          <Link
            href="/"
            className="text-amber-900 hover:text-amber-700 transition font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="text-amber-900 hover:text-amber-700 transition font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Articles
          </Link>
          <Link
            href="/series"
            className="text-amber-900 hover:text-amber-700 transition font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Series
          </Link>
          <Link
            href="/events"
            className="text-amber-900 hover:text-amber-700 transition font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Events
          </Link>
          <Link
            href="/about"
            className="text-amber-900 hover:text-amber-700 transition font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-amber-900 hover:text-amber-700 transition font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full bg-amber-700 hover:bg-amber-800 text-white">Admin</Button>
          </Link>
        </nav>
      </motion.div>
    </header>
  )
}
