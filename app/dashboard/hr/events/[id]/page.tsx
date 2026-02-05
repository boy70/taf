import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { authOptions } from "../../../../../lib/auth"
import { prisma } from "../../../../../lib/db"
import { UserRole } from "../../../../../types/user"
import { DashboardLayout } from "../../../../../components/layout/dashboard-layout"
import { Button } from "../../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { HREventRegistrations } from "../../../../../components/hr-event-registrations"
import { ArrowLeft, Edit, Calendar, MapPin, Users, DollarSign } from "lucide-react"
import { Badge } from "../../../../../components/ui/badge"

export default async function HREventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div className="p-8 text-center text-red-500">Not authenticated</div>
  }

  if (session.user.role !== UserRole.HR) {
    return <div className="p-8 text-center text-red-500">Not authorized</div>
  }

  try {
    const eventId = params.id

    // Fetch event details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return (
        <DashboardLayout role={UserRole.HR}>
          <div className="p-8 text-center text-red-500">Event not found</div>
        </DashboardLayout>
      )
    }

    // Fetch startup details
    const startup = await prisma.startup.findUnique({
      where: { id: event.startupId },
      select: { id: true, name: true },
    })

    // Verify the HR owns this event's startup
    if (startup?.id !== session.user.startupId) {
      return (
        <DashboardLayout role={UserRole.HR}>
          <div className="p-8 text-center text-red-500">Not authorized to view this event</div>
        </DashboardLayout>
      )
    }

    // Fetch registration counts
    const totalRegistrations = await prisma.eventRegistration.count({
      where: { eventId },
    })

    const attendanceCount = await prisma.eventAttendance.count({
      where: { eventId, status: "ATTENDED" },
    })

    // For feedbacks, we'll use 0 as placeholder since the model might need Prisma regeneration
    const feedbackCount = 0

    const eventDate = new Date(event.startAt)
    const isUpcoming = eventDate > new Date()
    const isFree = event.price === 0

    return (
      <DashboardLayout role={UserRole.HR as UserRole}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/hr/events">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <p className="text-gray-600">{startup?.name}</p>
              </div>
            </div>
            <Link href={`/dashboard/hr/events/${eventId}/edit`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit Event
              </Button>
            </Link>
          </div>

          {/* Event Details Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Event Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{eventDate.toLocaleDateString()}</div>
                <p className="text-xs text-gray-500">
                  {eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Registrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRegistrations}</div>
                <p className="text-xs text-gray-500">Total sign-ups</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  className={
                    event.status === "UPCOMING"
                      ? "bg-blue-100 text-blue-800"
                      : event.status === "ONGOING"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                  }
                >
                  {event.status}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isFree ? "Free" : `${event.currency} ${event.price}`}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Type</p>
                  <p className="font-medium">{event.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Format</p>
                  <p className="font-medium">{event.format.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Visibility</p>
                  <p className="font-medium">{event.visibility.replace("_", " ")}</p>
                </div>
                {event.location && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                  <p className="text-2xl font-bold">{totalRegistrations}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmed Attendees</p>
                  <p className="text-2xl font-bold">{attendanceCount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Feedback Received</p>
                  <p className="text-2xl font-bold">{feedbackCount}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {event.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Registrations Section */}
          <HREventRegistrations
            eventId={eventId}
            eventTitle={event.title}
            eventStartAt={event.startAt.toISOString()}
          />
        </div>
      </DashboardLayout>
    )
  } catch (error: any) {
    console.error("Error loading event:", error)
    return (
      <DashboardLayout role={UserRole.HR}>
        <div className="p-8 text-center text-red-500">
          Error loading event: {error.message}
        </div>
      </DashboardLayout>
    )
  }
}
