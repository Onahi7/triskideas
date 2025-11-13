"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAllPosts, getAllEvents, type Post, type Event } from "@/lib/db-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FileText, Calendar, Users, Eye } from "lucide-react"
import { db } from "@/lib/db"
import { subscribers } from "@/lib/schema"
import { count } from "drizzle-orm"

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalEvents: 0,
    totalSubscribers: 0,
    totalViews: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const posts = await getAllPosts()
      const events = await getAllEvents()
      const subsCount = await db.select({ count: count() }).from(subscribers)
      const totalViews = posts.reduce((sum, post) => sum + (post.viewCount || 0), 0)

      setStats({
        totalPosts: posts.length,
        totalEvents: events.length,
        totalSubscribers: subsCount[0]?.count || 0,
        totalViews,
      })
    } catch (error) {
      console.error("Failed to load stats", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your content overview.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading statistics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalPosts}</div>
              <Link href="/admin/posts" className="text-sm text-amber-700 hover:underline mt-2 inline-block">
                Manage posts →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalEvents}</div>
              <Link href="/admin/events" className="text-sm text-amber-700 hover:underline mt-2 inline-block">
                Manage events →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Subscribers</CardTitle>
              <Users className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalSubscribers}</div>
              <Link href="/admin/subscribers" className="text-sm text-amber-700 hover:underline mt-2 inline-block">
                Manage subscribers →
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-2">Across all articles</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/posts/new">
              <Button className="w-full bg-amber-700 hover:bg-amber-800">
                <FileText size={16} className="mr-2" />
                Create New Post
              </Button>
            </Link>
            <Link href="/admin/events/new">
              <Button className="w-full" variant="outline">
                <Calendar size={16} className="mr-2" />
                Create New Event
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Your recent content updates will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
