"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export function NotFoundClient() {
  return (
    <main className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-8xl font-bold text-amber-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600 text-lg">Sorry, the page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className="flex flex-col gap-4">
          <Link href="/">
            <Button className="w-full bg-amber-700 hover:bg-amber-800 text-white gap-2 py-6">
              <Home size={20} />
              Back to Home
            </Button>
          </Link>
          <Link href="/blog">
            <Button variant="outline" className="w-full gap-2 py-6 bg-transparent">
              <ArrowLeft size={20} />
              Browse Articles
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}