"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Eye, Users, Calendar } from "lucide-react"

interface AdminStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  totalEvents: number
  totalSubscribers: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalEvents: 0,
    totalSubscribers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminAuth")
    if (!isLoggedIn) {
      router.push("/admin/login")
    } else {
      const posts = JSON.parse(localStorage.getItem("blog_posts") || "[]")
      const totalViews = posts.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0)
      setStats({
        totalPosts: posts.length,
        publishedPosts: posts.filter((p: any) => p.published).length,
        draftPosts: posts.filter((p: any) => !p.published).length,
        totalViews,
        totalEvents: 0, // TODO: fetch from database
        totalSubscribers: 0, // TODO: fetch from database
      })
      setLoading(false)
    }
  }, [router])

  const statCards = [
    { title: "Total Posts", value: stats.totalPosts, icon: FileText, color: "text-amber-700" },
    { title: "Published", value: stats.publishedPosts, icon: FileText, color: "text-green-600" },
    { title: "Drafts", value: stats.draftPosts, icon: FileText, color: "text-yellow-600" },
    { title: "Total Views", value: stats.totalViews, icon: Eye, color: "text-blue-600" },
    { title: "Events", value: stats.totalEvents, icon: Calendar, color: "text-purple-600" },
    { title: "Subscribers", value: stats.totalSubscribers, icon: Users, color: "text-pink-600" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your blog and events overview.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((card) => {
              const Icon = card.icon
              return (
                <Card key={card.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Use the sidebar navigation to manage all aspects of your blog and events platform.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Create blog posts with rich TipTap editor</li>
                <li>✓ Upload images with Cloudinary integration</li>
                <li>✓ Manage free and paid events</li>
                <li>✓ Track event registrations</li>
                <li>✓ Monitor newsletter subscribers</li>
                <li>✓ Automated email notifications for new posts and events</li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
