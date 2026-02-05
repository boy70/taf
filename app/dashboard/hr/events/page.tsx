"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { UserRole } from "../../../../types/user"
import { DashboardLayout } from "../../../../components/layout/dashboard-layout"
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  QrCode,
  Eye,
  Edit,
  UserCheck,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  CheckCircle,
  XCircle,
  Clock
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
  status: string
  startAt: string
  endAt?: string
  location?: string
  venue?: string
  posterUrl?: string
  qrCodeUrl?: string
  galleryImagesJson?: any
  _count?: {
    registrations: number
    attendances: number
    feedbacks: number
  }
}

export default function HREventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      // Fetch all events for HR management
      const response = await fetch("/api/events?limit=100")
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateEventVisibility = async (eventId: string, visibility: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility }),
      })
      if (response.ok) {
        await fetchEvents() // Refresh data
      }
    } catch (error) {
      console.error("Failed to update visibility:", error)
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

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case "PUBLIC":
        return <Badge variant="outline" className="border-green-500 text-green-700">Public</Badge>
      case "ORG_ONLY":
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Org Only</Badge>
      case "MEMBERS_ONLY":
        return <Badge variant="outline" className="border-purple-500 text-purple-700">Members Only</Badge>
      case "PRIVATE":
        return <Badge variant="outline" className="border-red-500 text-red-700">Private</Badge>
      default:
        return <Badge variant="outline">{visibility}</Badge>
    }
  }

  const filteredEvents = events.filter((event) => {
    if (activeTab === "all") return true
    if (activeTab === "upcoming") return event.status === "UPCOMING"
    if (activeTab === "completed") return event.status === "COMPLETED"
    return true
  })

  if (loading) {
    return (
      <DashboardLayout role={UserRole.HR}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role={UserRole.HR}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Events Management</h1>
            <p className="text-muted-foreground">Comprehensive event management and analytics</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/hr/events/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Events ({events.length})</TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({events.filter(e => e.status === "UPCOMING").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({events.filter(e => e.status === "COMPLETED").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          {event.posterUrl && (
                            <img
                              src={event.posterUrl}
                              alt={event.title}
                              className="w-16 h-16 object-cover rounded-lg border"
                            />
                          )}
                          <div>
                            <CardTitle className="text-xl">{event.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusBadge(event.status)}
                              <Badge variant="outline">{event.type}</Badge>
                              <Badge variant="outline">{event.format.replace("_", " ")}</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.startAt).toLocaleDateString()}
                          </div>
                          {(event.location || event.venue) && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.venue || event.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Visibility:</span>
                          <Select
                            value={event.visibility}
                            onValueChange={(value) => updateEventVisibility(event.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PUBLIC">Public</SelectItem>
                              <SelectItem value="ORG_ONLY">Org Only</SelectItem>
                              <SelectItem value="MEMBERS_ONLY">Members Only</SelectItem>
                              <SelectItem value="PRIVATE">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/events/${event.id}`}>
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/hr/events/${event.id}/edit`}>
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          {event.qrCodeUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/hr/events/${event.id}/qr`}>
                                <QrCode className="w-3 h-3 mr-1" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Users className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                        <div className="text-lg font-bold text-blue-700">
                          {event._count?.registrations || 0}
                        </div>
                        <div className="text-xs text-blue-600">Registered</div>
                      </div>

                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-600" />
                        <div className="text-lg font-bold text-green-700">
                          {event._count?.attendances || 0}
                        </div>
                        <div className="text-xs text-green-600">Attended</div>
                      </div>

                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <XCircle className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                        <div className="text-lg font-bold text-orange-700">
                          {(event._count?.registrations || 0) - (event._count?.attendances || 0)}
                        </div>
                        <div className="text-xs text-orange-600">No Show</div>
                      </div>

                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <MessageSquare className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                        <div className="text-lg font-bold text-purple-700">
                          {event._count?.feedbacks || 0}
                        </div>
                        <div className="text-xs text-purple-600">Feedback</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/hr/events/${event.id}/attendance`}>
                          <UserCheck className="w-3 h-3 mr-1" />
                          Manage Attendance
                        </Link>
                      </Button>

                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/hr/events/${event.id}/gallery`}>
                          <ImageIcon className="w-3 h-3 mr-1" />
                          Gallery ({Array.isArray(event.galleryImagesJson) ? event.galleryImagesJson.length : 0})
                        </Link>
                      </Button>

                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/hr/events/${event.id}/feedback`}>
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Feedback
                        </Link>
                      </Button>
                    </div>

                    {event.description && (
                      <p className="text-sm text-gray-600 mt-4 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No {activeTab === "all" ? "" : activeTab} events found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === "all" ? "Create your first event to get started" : `No ${activeTab} events available`}
                  </p>
                  {activeTab === "all" && (
                    <Button asChild>
                      <Link href="/dashboard/hr/events/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Event
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}