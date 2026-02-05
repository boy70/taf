"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Badge } from "../../../../../components/ui/badge"
import { Alert, AlertDescription } from "../../../../../components/ui/alert"
import {
  ArrowLeft,
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react"
import Link from "next/link"

interface TeamMember {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  role: string
  joinedAt: string
}

interface Team {
  id: string
  name: string
  purpose?: string
  description?: string
  status: string
  eventId?: string | null
  members: TeamMember[]
  taskCount: number
  createdBy: string
  createdAt?: string
  visibility?: string
}

interface Event {
  id: string
  title: string
  startAt: string
}

export default function TeamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const teamId = params.id as string

  const [team, setTeam] = useState<Team | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [addingMember, setAddingMember] = useState(false)

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/teams?id=${teamId}`)
        if (!res.ok) throw new Error("Failed to fetch team")

        const data = await res.json()
        const teamData = Array.isArray(data) ? data[0] : data
        setTeam(teamData)

        if (teamData.eventId) {
          const eventRes = await fetch(`/api/events/${teamData.eventId}`)
          if (eventRes.ok) {
            const eventData = await eventRes.json()
            setEvent(eventData)
          }
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (teamId) {
      fetchTeamDetails()
    }
  }, [teamId])

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      alert("Please enter an email address")
      return
    }

    setAddingMember(true)
    try {
      const res = await fetch(`/api/teams/${teamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newMemberEmail }),
      })

      if (!res.ok) throw new Error("Failed to add member")

      setNewMemberEmail("")
      setShowAddMember(false)
      const teamRes = await fetch(`/api/teams?id=${teamId}`)
      if (teamRes.ok) {
        const data = await teamRes.json()
        setTeam(Array.isArray(data) ? data[0] : data)
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setAddingMember(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Remove this member from the team?")) return

    try {
      const res = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to remove member")

      const teamRes = await fetch(`/api/teams?id=${teamId}`)
      if (teamRes.ok) {
        const data = await teamRes.json()
        setTeam(Array.isArray(data) ? data[0] : data)
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading team...</p>
        </div>
      </div>
    )
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard/hr/teams" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Teams
          </Link>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Team not found"}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <Link href="/dashboard/hr/teams" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/hr/teams/${teamId}/edit`)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-700"></div>
              <CardContent className="pt-0 relative">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-16 mb-6 relative z-10">
                  <div className="flex-1">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center border-4 border-white">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{team.name}</h1>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${team.status === "active" ? "bg-emerald-100 text-emerald-700 border-emerald-300" : "bg-gray-100 text-gray-700 border-gray-300"} border`}>
                        {team.status === "active" ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {team.status}
                      </Badge>
                      {team.eventId && <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200"><Calendar className="w-3 h-3 mr-1" />Linked</Badge>}
                    </div>
                  </div>
                </div>
                {team.purpose && <p className="text-gray-600">{team.purpose}</p>}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-0 shadow-md hover:shadow-lg transition">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-gray-900">{team.members?.length || 0}</p>
                    <p className="text-sm text-gray-600">Members</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md hover:shadow-lg transition">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Target className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-gray-900">{team.taskCount || 0}</p>
                    <p className="text-sm text-gray-600">Tasks</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md hover:shadow-lg transition">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-lg font-bold text-gray-900">{team.createdAt ? new Date(team.createdAt).toLocaleDateString() : "N/A"}</p>
                    <p className="text-sm text-gray-600">Created</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {team.eventId && event && (
              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Linked Event</h3>
                      <p className="text-sm text-gray-700 mt-1">{event.title}</p>
                      <p className="text-xs text-gray-600 mt-2">Start: {new Date(event.startAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl pb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    <div>
                      <CardTitle>Members</CardTitle>
                      <CardDescription className="text-blue-100 text-xs mt-1">{team.members?.length || 0} total</CardDescription>
                    </div>
                  </div>
                  <Button onClick={() => setShowAddMember(!showAddMember)} className="bg-white text-blue-600 hover:bg-blue-50" size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {showAddMember && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="space-y-3">
                      <Input type="email" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} placeholder="email@example.com" className="focus:ring-2 focus:ring-blue-500" />
                      <div className="flex gap-2">
                        <Button onClick={handleAddMember} disabled={addingMember} className="flex-1 bg-blue-600 hover:bg-blue-700">
                          {addingMember ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                          {addingMember ? "Adding..." : "Add"}
                        </Button>
                        <Button variant="outline" onClick={() => { setShowAddMember(false); setNewMemberEmail("") }}>Cancel</Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {team.members && team.members.length > 0 ? (
                    team.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {member.user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{member.user.name}</p>
                              <p className="text-sm text-gray-500 truncate">{member.user.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{member.role || "Member"}</Badge>
                          <button onClick={() => handleRemoveMember(member.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Remove">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No members</p>
                      <Button variant="link" onClick={() => setShowAddMember(true)} className="text-blue-600 hover:text-blue-700 mt-2">
                        Add first member
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg sticky top-6">
              <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-xl">
                <CardTitle className="text-lg">Info</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">ID</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1 font-mono break-all">{teamId}</code>
                </div>
                <div className="border-t pt-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Creator</p>
                  <p className="text-sm text-gray-900 mt-1 font-medium">{team.createdBy || "N/A"}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Status</p>
                  <Badge className={`mt-1 ${team.status === "active" ? "bg-emerald-100 text-emerald-700 border-emerald-300" : "bg-gray-100 text-gray-700 border-gray-300"} border`}>
                    {team.status}
                  </Badge>
                </div>
                {team.visibility && (
                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase">Visibility</p>
                    <Badge variant="outline" className="mt-1">{team.visibility}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
