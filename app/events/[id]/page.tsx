"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { UserNav } from "../../../components/user-nav"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  DollarSign,
  Globe,
  Building,
  QrCode
} from "lucide-react"

interface Event {
  id: string
  title: string
  description?: string
  type: string
  format: string
  price: number
  currency: string
  visibility: string
  maxParticipants?: number
  startAt: string
  endAt?: string
  location?: string
  venue?: string
  status: string
  startup: {
    id: string
    name: string
    startupProfile?: {
      profileImageUrl?: string
    }
  }
  _count?: {
    registrations: number
    attendances: number
  }
}

interface RegistrationStatus {
  isRegistered: boolean
  status: string | null
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvent()
    fetchRegistrationStatus()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      if (response.ok) {
        const eventData = await response.json()
        setEvent(eventData)
      } else {
        setError("Event not found")
      }
    } catch (err) {
      setError("Failed to load event")
    } finally {
      setLoading(false)
    }
  }

  const fetchRegistrationStatus = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/register`)
      if (response.ok) {
        const status = await response.json()
        setRegistrationStatus(status)
      }
    } catch (err) {
      console.error("Failed to fetch registration status:", err)
    }
  }

  const handleRegister = async () => {
    setRegistering(true)
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      })

      if (response.ok) {
        await fetchRegistrationStatus() // Refresh status
      } else {
        const data = await response.json()
        setError(data.error || "Failed to register")
      }
    } catch (err) {
      setError("Failed to register for event")
    } finally {
      setRegistering(false)
    }
  }

  const handleUnregister = async () => {
    setRegistering(true)
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchRegistrationStatus() // Refresh status
      } else {
        const data = await response.json()
        setError(data.error || "Failed to unregister")
      }
    } catch (err) {
      setError("Failed to unregister from event")
    } finally {
      setRegistering(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
      case "ONGOING":
        return <Badge className="bg-green-100 text-green-800">Ongoing</Badge>
      case "COMPLETED":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "ONLINE":
        return <Globe className="w-4 h-4" />
      case "IN_PERSON":
        return <Building className="w-4 h-4" />
      case "HYBRID":
        return <Users className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/events" className="text-gray-600 hover:text-gray-900 font-medium">
              ← Back to Events
            </Link>
            <UserNav />
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/events">
              <Button>Back to Events</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.startAt)
  const isUpcoming = eventDate > new Date()
  const isFree = event.price === 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/events" className="text-gray-600 hover:text-gray-900 font-medium flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
          <UserNav />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Event Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {getStatusBadge(event.status)}
                <Badge variant="outline" className="flex items-center gap-1">
                  {getFormatIcon(event.format)}
                  {event.format.replace("_", " ")}
                </Badge>
                {event.type !== "GENERAL" && (
                  <Badge variant="outline">{event.type}</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <Link href={`/organizations/${event.startup.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                {event.startup.name}
              </Link>
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{eventDate.toLocaleDateString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium">{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-sm text-gray-600">Attendees</p>
                <p className="font-medium">{event._count?.registrations || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                <p className="text-sm text-gray-600">Price</p>
                <p className="font-medium">
                  {isFree ? "Free" : `${event.currency} ${event.price}`}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Location */}
          {(event.location || event.venue) && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {event.venue || "Location"}
                    </p>
                    {event.location && (
                      <p className="text-gray-600">{event.location}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {event.description && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Registration Section */}
          {isUpcoming && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Registration</h3>
                    {registrationStatus?.isRegistered ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>You are registered for this event</span>
                      </div>
                    ) : (
                      <p className="text-gray-600">Join this event to participate</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {registrationStatus?.isRegistered ? (
                      <>
                        <Link href="/scan">
                          <Button variant="outline">
                            <QrCode className="w-4 h-4 mr-2" />
                            Scan QR
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          onClick={handleUnregister}
                          disabled={registering}
                        >
                          {registering ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-2" />
                          )}
                          Unregister
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleRegister}
                        disabled={registering}
                      >
                        {registering ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Register
                      </Button>
                    )}
                  </div>
                </div>

                {error && (
                  <p className="text-red-600 text-sm mt-2">{error}</p>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  )
}