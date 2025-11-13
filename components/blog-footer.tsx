"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export function BlogFooter() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const { toast } = useToast()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSubscribed(true)
        setEmail("")
        toast({
          title: "Success",
          description: "You've been subscribed to our newsletter!",
        })
        setTimeout(() => setSubscribed(false), 3000)
      } else {
        toast({
          title: "Error",
          description: "Failed to subscribe. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-amber-900 text-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
        >
          <div>
            <h3 className="font-bold mb-4 text-xl">TRISKIDEAS</h3>
            <p className="text-amber-100 text-sm leading-relaxed">
              Exploring ideas that unlock human potential and inspire positive change in our world.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Dr. Ferdinand</h3>
            <p className="text-amber-100 text-sm leading-relaxed">
              Medical Doctor | Artist | Thinker
              <br />
              Based in Jos, Nigeria
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="text-amber-100 text-sm space-y-2">
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Newsletter</h3>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-amber-800 border-amber-700 text-white placeholder:text-amber-300"
                required
                disabled={loading}
              />
              <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-600" disabled={loading}>
                {subscribed ? "Subscribed!" : loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <p className="text-xs text-amber-200 mt-2">Get notified about new articles and events</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border-t border-amber-800 pt-8 text-center text-amber-200 text-sm"
        >
          <p>&copy; 2025 TRISKIDEAS - The Mind's Fruit. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}
