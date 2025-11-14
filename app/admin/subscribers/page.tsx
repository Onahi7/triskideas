"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search, Trash2 } from "lucide-react"
import { getAllSubscribers, deleteSubscriber } from "@/lib/db-actions"

interface Subscriber {
  id: number
  email: string
  subscribedAt: Date | null
}

export default function SubscribersPage() {
  const router = useRouter()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminAuth")
    if (!isLoggedIn) {
      router.push("/admin/login")
      return
    }
    fetchSubscribers()
  }, [router])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const data = await getAllSubscribers()
      setSubscribers(data)
    } catch (error) {
      console.error("Failed to fetch subscribers:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = subscribers.filter((s) => s.email.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredSubscribers(filtered)
  }, [searchTerm, subscribers])

  const handleDeleteSubscriber = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return
    try {
      await deleteSubscriber(id)
      setSubscribers((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Failed to delete subscriber:", error)
    }
  }

  const exportSubscribers = () => {
    const csv =
      "Email,Subscribed Date\n" +
      subscribers
        .map((s) => `${s.email},${s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString() : "N/A"}`)
        .join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "subscribers.csv"
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Subscribers</h1>
          <p className="text-gray-600 mt-1">Manage your newsletter subscribers</p>
        </div>
        <Button onClick={exportSubscribers} className="bg-amber-700 hover:bg-amber-800 text-white gap-2">
          <Download size={20} />
          Export CSV
        </Button>
      </div>

      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Subscribers: {subscribers.length}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading subscribers...</div>
          ) : filteredSubscribers.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No subscribers yet</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSubscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{subscriber.email}</p>
                    <p className="text-sm text-gray-500">
                      {subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteSubscriber(subscriber.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
