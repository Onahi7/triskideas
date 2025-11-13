"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2, Edit2, Plus, Search, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getAllEvents, deleteEvent, type Event } from "@/lib/db-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ManageEventsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<number | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const data = await getAllEvents()
      setEvents(data)
      setFilteredEvents(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = events
    if (searchTerm) {
      filtered = filtered.filter((e) => e.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (filterStatus === "published") {
      filtered = filtered.filter((e) => e.published)
    } else if (filterStatus === "draft") {
      filtered = filtered.filter((e) => !e.published)
    }
    setFilteredEvents(filtered)
  }, [searchTerm, filterStatus, events])

  const handleDelete = (id: number) => {
    setEventToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (eventToDelete) {
      try {
        await deleteEvent(eventToDelete)
        toast({
          title: "Event deleted",
          description: "The event has been successfully deleted",
        })
        loadEvents()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete event",
          variant: "destructive",
        })
      }
      setDeleteDialogOpen(false)
      setEventToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Manage Events</h1>
          <p className="text-gray-600 mt-1">Create and manage your events</p>
        </div>
        <Link href="/admin/events/new">
          <Button className="bg-amber-700 hover:bg-amber-800 text-white gap-2">
            <Plus size={20} />
            New Event
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
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
            {["all", "published", "draft"].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                onClick={() => setFilterStatus(status)}
                className={filterStatus === status ? "bg-amber-700" : ""}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600 py-8">No events yet. Create your first event to get started!</p>
            <div className="flex justify-center">
              <Link href="/admin/events/new">
                <Button className="bg-amber-700 hover:bg-amber-800">Create First Event</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Calendar size={16} className="text-gray-400" />
                      <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                      {event.eventType === "paid" && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                          Paid - {event.price}
                        </span>
                      )}
                      {event.eventType === "free" && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">Free</span>
                      )}
                      {event.featured && (
                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded font-medium">
                          Featured
                        </span>
                      )}
                      {event.published ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">
                          Published
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-medium">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{new Date(event.startDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/events/edit/${event.id}`}>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Edit2 size={16} />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm" className="gap-2" onClick={() => handleDelete(event.id)}>
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
