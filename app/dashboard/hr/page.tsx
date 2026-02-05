import type React from "react"
import { HRInviteEmployee } from "../../../components/hr-invite-employee"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { UserRole } from "../../../types/user"
import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/db"
import { HRSidebar } from "../../../components/layout/hr-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import {
  Calendar,
  Users,
  Zap,
  TrendingUp,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Clock,
  Target,
  Briefcase,
} from "lucide-react"

export default async function HRDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div className="p-8 text-center text-red-500">Not authenticated</div>
  }
  if (session.user.role !== UserRole.HR) {
    return <div className="p-8 text-center text-red-500">Not authorized</div>
  }
  if (!session.user.startupId) {
    return <div className="p-8 text-center text-red-500">No startup assigned to your HR user. Please contact admin.</div>
  }

  let startup = null,
    employeeCount = 0,
    testCompletionCount = 0,
    discDistribution = [],
    dCount = 0,
    iCount = 0,
    sCount = 0,
    cCount = 0,
    totalEvents = 0,
    totalRegistrations = 0,
    approvedRegistrations = 0,
    upcomingEvents = []
  try {
    startup = await prisma.startup.findUnique({
      where: { id: session.user.startupId },
    })
    employeeCount = await prisma.user.count({
      where: { startupId: session.user.startupId, role: "EMPLOYEE" },
    })
    testCompletionCount = await prisma.user.count({
      where: { startupId: session.user.startupId, role: "EMPLOYEE", result: { some: {} } },
    })
    discDistribution = await prisma.user.findMany({
      where: { startupId: session.user.startupId, role: "EMPLOYEE", result: { some: {} } },
      include: { result: { orderBy: { createdAt: "desc" }, take: 1 } },
    })
    dCount = discDistribution.filter((user: any) => user.result[0]?.dominantType === "D").length
    iCount = discDistribution.filter((user: any) => user.result[0]?.dominantType === "I").length
    sCount = discDistribution.filter((user: any) => user.result[0]?.dominantType === "S").length
    cCount = discDistribution.filter((user: any) => user.result[0]?.dominantType === "C").length

    // Fetch event statistics
    totalEvents = await prisma.event.count({
      where: { startupId: session.user.startupId },
    })

    totalRegistrations = await prisma.eventRegistration.count({
      where: {
        event: {
          startupId: session.user.startupId,
        },
      },
    })

    approvedRegistrations = await prisma.eventRegistration.count({
      where: {
        event: {
          startupId: session.user.startupId,
        },
        status: "APPROVED",
      },
    })

    upcomingEvents = await prisma.event.findMany({
      where: {
        startupId: session.user.startupId,
        status: "UPCOMING",
      },
      select: {
        id: true,
        title: true,
        startAt: true,
        format: true,
        type: true,
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { startAt: "asc" },
      take: 4,
    })
  } catch (err: any) {
    return <div className="p-8 text-center text-red-500">Error loading dashboard: {err.message || String(err)}</div>
  }

  const completionRate = employeeCount > 0 ? Math.round((testCompletionCount / employeeCount) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Sidebar */}
      <HRSidebar organizationName={startup?.name || "Organization"} />

      {/* Main Content */}
      <main className="md:ml-64 pt-20 md:pt-0">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Welcome back, {session.user.name}
              </h1>
              <p className="text-gray-600">Here's an overview of your organization and upcoming events</p>
            </div>
            <div className="flex gap-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg">
                <Link href="/dashboard/hr/events/new">
                  <Plus className="w-4 h-4" />
                  Create Event
                </Link>
              </Button>
              <HRInviteEmployee />
            </div>
          </div>

          {/* Main Grid - Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Total Employees */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>Total Employees</span>
                  <Users className="w-5 h-5 text-blue-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{employeeCount}</div>
                <p className="text-xs text-gray-500 mt-1">Active team members</p>
              </CardContent>
            </Card>

            {/* Tests Completed */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>Tests Completed</span>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{testCompletionCount}</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="text-xs text-gray-500">{completionRate}% completion</div>
                  <TrendingUp className="w-3 h-3 text-green-600" />
                </div>
              </CardContent>
            </Card>

            {/* Total Events */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>Total Events</span>
                  <Calendar className="w-5 h-5 text-purple-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{totalEvents}</div>
                <p className="text-xs text-gray-500 mt-1">Organized events</p>
              </CardContent>
            </Card>

            {/* Event Registrations */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>Registrations</span>
                  <Zap className="w-5 h-5 text-amber-600" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{totalRegistrations}</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="text-xs text-gray-500">{approvedRegistrations} approved</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3 mb-8">
            {/* Upcoming Events - Featured */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Events Card */}
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <CardTitle>Upcoming Events</CardTitle>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/dashboard/hr/events">
                        View All
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  <CardDescription>Your next scheduled events</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No upcoming events</p>
                      <p className="text-sm text-gray-400">Create your first event to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingEvents.map((event, index) => (
                        <Link
                          key={event.id}
                          href={`/dashboard/hr/events/${event.id}`}
                          className="group block p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {event.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {new Date(event.startAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-blue-100 text-blue-700 mb-2">{event.format.replace("_", " ")}</Badge>
                              <p className="text-sm font-medium text-gray-900">{event._count.registrations}</p>
                              <p className="text-xs text-gray-500">registered</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Team Personality Distribution */}
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white/50 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-transparent pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                      <CardTitle>Team Composition</CardTitle>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/dashboard/hr/compatibility">
                        Analyze
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                  <CardDescription>DISC personality distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { letter: "D", count: dCount, color: "text-red-600", bg: "bg-red-50", label: "Dominant" },
                      { letter: "I", count: iCount, color: "text-yellow-600", bg: "bg-yellow-50", label: "Influencer" },
                      { letter: "S", count: sCount, color: "text-green-600", bg: "bg-green-50", label: "Steadfast" },
                      { letter: "C", count: cCount, color: "text-blue-600", bg: "bg-blue-50", label: "Conscientious" },
                    ].map((disc) => (
                      <div key={disc.letter} className={`${disc.bg} rounded-lg p-4 text-center border border-gray-200`}>
                        <div className={`text-2xl font-bold ${disc.color}`}>{disc.letter}</div>
                        <div className="text-xl font-semibold text-gray-900 mt-1">{disc.count}</div>
                        <p className="text-xs text-gray-600 mt-1">{disc.label}</p>
                      </div>
                    ))}
                  </div>
                  {testCompletionCount > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-900">{completionRate}%</span> of your team has completed the
                        personality assessment
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Quick Actions */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white/50 backdrop-blur-sm sticky top-24">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/dashboard/hr/events/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Event
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/dashboard/hr/employees">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Team
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/dashboard/hr/training-planner">
                      <Target className="w-4 h-4 mr-2" />
                      Training Plans
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/dashboard/hr/compatibility">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Team Analysis
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Stats Summary */}
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white/50 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-blue-600">{employeeCount}</span> employees in your organization
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-green-600">{totalEvents}</span> events created this year
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-purple-600">{totalRegistrations}</span> total registrations
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-8 border-t border-slate-200">
            <p>TAFSULA HR Dashboard • Last updated {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
