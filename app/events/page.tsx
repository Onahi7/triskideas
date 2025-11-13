"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, DollarSign, Search } from "lucide-react"
import { getPublishedEvents, type Event } from "@/lib/db-actions"
import { BlogHeader } from "@/components/blog-header"
import { BlogFooter } from "@/components/blog-footer"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const data = await getPublishedEvents()
      setEvents(data)
      setFilteredEvents(data)
    } catch (error) {
      console.error("Failed to load events", error)
    }
  }

  useEffect(() => {
    let filtered = events
    if (searchTerm) {
      filtered = filtered.filter((e) => e.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (filterType !== "all") {
      filtered = filtered.filter((e) => e.eventType === filterType)
    }
    setFilteredEvents(filtered)
  }, [searchTerm, filterType, events])

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <BlogHeader />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Events & Workshops</h1>
          <p className="text-xl text-gray-600 mb-8">Join Dr. Ferdinand for insightful events and workshops</p>
        </motion.div>

        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["all", "free", "paid"].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                onClick={() => setFilterType(type)}
                className={filterType === type ? "bg-amber-700" : ""}
              >
                {type === "all" ? "All" : type === "free" ? "Free" : "Paid"}
              </Button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600 py-12">No events available at the moment. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <Link href={`/events/${event.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer overflow-hidden">
                    {event.imageUrl && (
                      <div className="h-48 bg-gradient-to-br from-amber-100 to-yellow-100 relative overflow-hidden">
                        <img
                          src={event.imageUrl || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="pt-6">
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {event.eventType === "paid" ? (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium flex items-center gap-1">
                            <DollarSign size={12} />${event.price}
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">
                            Free
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          {new Date(event.startDate).toLocaleDateString()}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <BlogFooter />
    </main>
  )
}
