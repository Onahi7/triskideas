"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { getEventBySlug, type Event } from "@/lib/db-actions"

export default function EventDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [showRegistration, setShowRegistration] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [registrationData, setRegistrationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventBySlug(params.slug as string)
        setEvent(eventData)
      } catch (error) {
        console.error("Failed to fetch event:", error)
      } finally {
        setDataLoading(false)
      }
    }
    fetchEvent()
  }, [params.slug])

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!registrationData.firstName || !registrationData.lastName || !registrationData.email) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        })
        return
      }

      if (!event) return

      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
          eventSlug: params.slug,
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          email: registrationData.email,
          paymentStatus: event.eventType === "free" ? "completed" : "pending",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Registration failed")
      }

      toast({
        title: "Success",
        description: "Registration successful! Check your email for confirmation.",
      })
      setShowRegistration(false)
      setRegistrationData({ firstName: "", lastName: "", email: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (dataLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center text-gray-600 py-12">Loading event...</div>
        </div>
      </main>
    )
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/events" className="flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-8">
            <ArrowLeft size={20} />
            Back to Events
          </Link>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600 py-12">Event not found</p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/events" className="flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-8">
          <ArrowLeft size={20} />
          Back to Events
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {event.imageUrl && (
            <div className="h-96 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg overflow-hidden mb-8">
              <img
                src={event.imageUrl || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h1 className="text-5xl font-bold text-gray-900 mb-4">{event.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-amber-700" />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-bold text-gray-900">{new Date(event.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-amber-700" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-bold text-gray-900">{event.location || "Online"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  {event.eventType === "paid" ? (
                    <>
                      <DollarSign size={20} className="text-amber-700" />
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-bold text-gray-900">${event.price}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Users size={20} className="text-green-700" />
                      <div>
                        <p className="text-sm text-gray-600">Attendance</p>
                        <p className="font-bold text-gray-900">Free</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: event.richContent || event.description }} />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              onClick={() => setShowRegistration(true)}
              className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-6 text-lg"
            >
              Register Now
            </Button>
          </div>
        </motion.div>

        {showRegistration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowRegistration(false)}
          >
            <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle>Register for Event</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegistration} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">First Name *</label>
                    <Input
                      required
                      value={registrationData.firstName}
                      onChange={(e) => setRegistrationData({ ...registrationData, firstName: e.target.value })}
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Last Name *</label>
                    <Input
                      required
                      value={registrationData.lastName}
                      onChange={(e) => setRegistrationData({ ...registrationData, lastName: e.target.value })}
                      placeholder="Last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Email *</label>
                    <Input
                      required
                      type="email"
                      value={registrationData.email}
                      onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                      placeholder="Email address"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-amber-700 hover:bg-amber-800 text-white"
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {loading ? "Registering..." : "Complete Registration"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowRegistration(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  )
}
