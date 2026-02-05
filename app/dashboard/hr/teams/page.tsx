"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { UserRole } from "../../../../types/user"
import { DashboardLayout } from "../../../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"
import {
  Search,
  Users,
  Plus,
  Calendar,
  Briefcase,
  Eye,
  Edit,
  CheckCircle,
  Trash2,
  AlertCircle,
} from "lucide-react"

interface Team {
  id: string
  name: string
  purpose?: string
  description?: string
  status: string
  eventId?: string
  projectId?: string
  members: number
  taskCount: number
  createdBy: string
}

interface Event {
  id: string
  title: string
  startAt: string
  endAt?: string
  description?: string
}

export default function TeamsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [teams, setTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "event-based" | "independent">("all")
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTeam, setNewTeam] = useState({ name: "", purpose: "", type: "independent" })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    if (status === "authenticated" && session?.user.role === "HR") {
      fetchTeamsAndEvents()
    }
  }, [status, router, session])

  useEffect(() => {
    let filtered = teams

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((team) => team.name.toLowerCase().includes(query))
    }

    if (filterType === "event-based") {
      filtered = filtered.filter((team) => team.eventId)
    } else if (filterType === "independent") {
      filtered = filtered.filter((team) => !team.eventId)
    }

    if (selectedEvent && filterType !== "independent") {
      filtered = filtered.filter((team) => team.eventId === selectedEvent)
    }

    setFilteredTeams(filtered)
  }, [searchQuery, teams, filterType, selectedEvent])

  const fetchTeamsAndEvents = async () => {
    try {
      const [teamsRes, eventsRes] = await Promise.all([
        fetch(`/api/teams?startupId=${session?.user.startupId}`),
        fetch(`/api/events?startupId=${session?.user.startupId}`),
      ])

      if (!teamsRes.ok || !eventsRes.ok) throw new Error("Failed to fetch data")

      const teamsData = await teamsRes.json()
      const eventsResponse = await eventsRes.json()

      setTeams(teamsData || [])
      setFilteredTeams(teamsData || [])
      // Events API returns { events, pagination } - extract the events array
      setEvents(eventsResponse?.events || [])
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load teams. Please try again.")
      setIsLoading(false)
    }
  }

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (!confirm(`Are you sure you want to delete "${teamName}"? This action cannot be undone.`)) return

    setIsDeleting(teamId)
    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete team")

      // Remove team from list
      setTeams(teams.filter((t) => t.id !== teamId))
      alert("Team deleted successfully")
    } catch (error: any) {
      alert(error.message || "Error deleting team")
    } finally {
      setIsDeleting(null)
    }
  }

  const handleEditTeam = (teamId: string) => {
    router.push(`/dashboard/hr/teams/${teamId}/edit`)
  }

  const handleManageTeam = (teamId: string) => {
    router.push(`/dashboard/hr/teams/${teamId}`)
  }

  const handleCreateTeam = async () => {
    if (!newTeam.name.trim()) {
      alert("Team name is required")
      return
    }

    if (newTeam.type === "event-based" && !selectedEvent) {
      alert("Please select an event for event-based teams")
      return
    }

    setIsCreating(true)
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTeam.name,
          purpose: newTeam.purpose,
          startupId: session?.user.startupId,
          eventId: newTeam.type === "event-based" ? selectedEvent : null,
        }),
      })

      if (!res.ok) throw new Error("Failed to create team")

      setNewTeam({ name: "", purpose: "", type: "independent" })
      setShowCreateModal(false)
      setSelectedEvent(null)
      await fetchTeamsAndEvents()
    } catch (error) {
      alert("Error creating team")
    } finally {
      setIsCreating(false)
    }
  }

  const stats = {
    total: teams.length,
    eventBased: teams.filter((t) => t.eventId).length,
    independent: teams.filter((t) => !t.eventId).length,
    active: teams.filter((t) => t.status === "active").length,
  }

  if (isLoading) {
    return (
      <DashboardLayout role={(session?.user.role || "HR") as UserRole}>
        <div className="flex justify-center items-center py-24">
          <div className="space-y-4 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="text-gray-600">Loading teams...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout role={(session?.user.role || "HR") as UserRole}>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Error</CardTitle>
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role={(session?.user.role || "HR") as UserRole}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Teams & Groups
            </h1>
            <p className="text-gray-600 mt-1">Organize teams, manage groups, and assign tasks</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Create Team
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Teams</p>
                  <p className="text-3xl font-bold text-blue-700 mt-2">{stats.total}</p>
                </div>
                <Users className="w-10 h-10 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Event-Based</p>
                  <p className="text-3xl font-bold text-purple-700 mt-2">{stats.eventBased}</p>
                </div>
                <Calendar className="w-10 h-10 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Independent</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">{stats.independent}</p>
                </div>
                <Briefcase className="w-10 h-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-emerald-700 mt-2">{stats.active}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-emerald-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>

            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                {(["all", "event-based", "independent"] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={filterType === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setFilterType(filter)
                      setSelectedEvent(null)
                    }}
                    className={
                      filterType === filter ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300 hover:bg-gray-50"
                    }
                  >
                    {filter === "all"
                      ? "All Teams"
                      : filter === "event-based"
                        ? "Event-Based"
                        : "Independent"}{" "}
                    ({filter === "all" ? stats.total : filter === "event-based" ? stats.eventBased : stats.independent})
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="py-12">
              <div className="text-center space-y-3">
                <Users className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-gray-600 font-medium">No teams found</p>
                <p className="text-gray-400 text-sm">
                  {searchQuery ? "Try adjusting your search" : "Create your first team to get started"}
                </p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.map((team) => (
              <Card
                key={team.id}
                className="group hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden"
              >
                <CardContent className="pt-6 pb-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {team.name}
                      </h3>
                      {team.purpose && (
                        <p className="text-sm text-gray-500 truncate">{team.purpose}</p>
                      )}
                    </div>
                    <Badge
                      className={`ml-2 ${
                        team.status === "active"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                      variant="outline"
                    >
                      {team.status}
                    </Badge>
                  </div>

                  {/* Type Badge */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    {team.eventId ? (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200 gap-2" variant="outline">
                        <Calendar className="w-3 h-3" />
                        Event-Based
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 gap-2" variant="outline">
                        <Briefcase className="w-3 h-3" />
                        Independent
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-gray-100">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Members</p>
                      <p className="text-xl font-bold text-gray-900">{team.members}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">Tasks</p>
                      <p className="text-xl font-bold text-gray-900">{team.taskCount}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-blue-600 hover:bg-blue-50 border-blue-200 gap-2"
                      onClick={() => handleManageTeam(team.id)}
                    >
                      <Eye className="w-4 h-4" />
                      Manage
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 hover:bg-gray-50 border-gray-200"
                      onClick={() => handleEditTeam(team.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 border-red-200"
                      onClick={() => handleDeleteTeam(team.id, team.name)}
                      disabled={isDeleting === team.id}
                    >
                      {isDeleting === team.id ? "..." : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 overflow-y-auto">
          <Card className="w-full max-w-md my-8">
            <CardHeader>
              <CardTitle>Create New Team</CardTitle>
              <CardDescription>Create a team for your events or as a standalone group</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Team Name *</label>
                <Input
                  placeholder="e.g., Marketing Team"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Purpose/Description</label>
                <Input
                  placeholder="What is this team for?"
                  value={newTeam.purpose}
                  onChange={(e) => setNewTeam({ ...newTeam, purpose: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <div className="flex gap-2">
                  <Button
                    variant={newTeam.type === "event-based" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setNewTeam({ ...newTeam, type: "event-based" })}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Event-Based
                  </Button>
                  <Button
                    variant={newTeam.type === "independent" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setNewTeam({ ...newTeam, type: "independent" })}
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Independent
                  </Button>
                </div>
              </div>

              {/* Event Selection for Event-Based Teams */}
              {newTeam.type === "event-based" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Event *</label>
                  {events.length === 0 ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                      No events available. Create an event first.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {events.map((event: any) => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event.id)}
                          className={`w-full p-3 border rounded-lg text-left transition-all ${
                            selectedEvent === event.id
                              ? "bg-blue-50 border-blue-500 ring-2 ring-blue-200"
                              : "bg-white border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(event.startAt).toLocaleDateString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowCreateModal(false)
                    setSelectedEvent(null)
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={handleCreateTeam}
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
