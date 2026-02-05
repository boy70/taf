"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Textarea } from "../../../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { Alert, AlertDescription } from "../../../../../components/ui/alert"
import { Loader2, ArrowLeft, Plus, X, Users, Briefcase } from "lucide-react"
import Link from "next/link"
import { Badge } from "../../../../../components/ui/badge"

interface Team {
  name: string
  purpose: string
  type: "event-based"
}

export default function CreateEventPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [newTeam, setNewTeam] = useState({ name: "", purpose: "" })

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "GENERAL",
    format: "IN_PERSON",
    price: 0,
    currency: "USD",
    startAt: "",
    endAt: "",
    location: "",
    venue: "",
    visibility: "ORG_ONLY",
    maxParticipants: "",
    posterFile: null as File | null,
  })

  const handleAddTeam = () => {
    if (!newTeam.name.trim()) {
      alert("Team name is required")
      return
    }
    setTeams([...teams, { ...newTeam, type: "event-based" }])
    setNewTeam({ name: "", purpose: "" })
    setShowTeamForm(false)
  }

  const handleRemoveTeam = (index: number) => {
    setTeams(teams.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let posterUrl = null

      // Handle poster upload
      if (formData.posterFile) {
        posterUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(formData.posterFile!)
        })
      }

      // Create event first
      const eventResponse = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          posterUrl,
          price: parseFloat(formData.price.toString()) || 0,
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
          startAt: new Date(formData.startAt).toISOString(),
          endAt: formData.endAt ? new Date(formData.endAt).toISOString() : null,
        }),
      })

      if (!eventResponse.ok) {
        const data = await eventResponse.json()
        throw new Error(data.error || "Failed to create event")
      }

      const eventData = await eventResponse.json()
      const eventId = eventData.id || eventData.data?.id

      // Create associated teams if any
      if (teams.length > 0) {
        for (const team of teams) {
          await fetch("/api/teams", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: team.name,
              purpose: team.purpose,
              startupId: session?.user.startupId,
              eventId: eventId,
            }),
          })
        }
      }

      // Redirect to events page
      router.push("/dashboard/hr/events")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard/hr" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl pb-6">
                <CardTitle className="text-2xl md:text-3xl">Create New Event</CardTitle>
                <CardDescription className="text-blue-100 mt-1">
                  Set up your event details and optionally create teams
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Info Section */}
                  <div>
                    <div className="space-y-1 pb-4 border-b-2 border-gray-100">
                      <h3 className="text-base font-bold text-gray-800 flex items-center">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                        Event Details
                      </h3>
                    </div>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="font-semibold text-gray-700">Event Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleChange("title", e.target.value)}
                          placeholder="e.g., Annual Company Meetup 2026"
                          required
                          className="focus:ring-2 focus:ring-blue-500 h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="font-semibold text-gray-700">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleChange("description", e.target.value)}
                          placeholder="Describe your event in detail..."
                          rows={3}
                          className="focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="poster" className="font-semibold text-gray-700">Event Poster</Label>
                        <Input
                          id="poster"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setFormData(prev => ({ ...prev, posterFile: file }))
                          }}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-gray-500">
                          Upload a poster image (JPG, PNG). Recommended: 1200×600px
                        </p>
                        {formData.posterFile && (
                          <div className="mt-3">
                            <img
                              src={URL.createObjectURL(formData.posterFile)}
                              alt="Poster preview"
                              className="max-w-xs max-h-40 object-contain border border-gray-200 rounded-lg shadow-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Event Configuration Section */}
                  <div>
                    <div className="space-y-1 pb-4 border-b-2 border-gray-100">
                      <h3 className="text-base font-bold text-gray-800 flex items-center">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                        Event Configuration
                      </h3>
                    </div>
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="type" className="font-semibold text-gray-700">Event Type *</Label>
                          <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                            <SelectTrigger className="focus:ring-2 focus:ring-blue-500 h-10">
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GENERAL">📋 General</SelectItem>
                              <SelectItem value="TRAINING">🎓 Training</SelectItem>
                              <SelectItem value="WORKSHOP">🛠️ Workshop</SelectItem>
                              <SelectItem value="CONFERENCE">🎤 Conference</SelectItem>
                              <SelectItem value="MEETING">👔 Meeting</SelectItem>
                              <SelectItem value="WEBINAR">💻 Webinar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="format" className="font-semibold text-gray-700">Format *</Label>
                          <Select value={formData.format} onValueChange={(value) => handleChange("format", value)}>
                            <SelectTrigger className="focus:ring-2 focus:ring-blue-500 h-10">
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IN_PERSON">🏢 In Person</SelectItem>
                              <SelectItem value="ONLINE">💻 Online</SelectItem>
                              <SelectItem value="HYBRID">🔀 Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="visibility" className="font-semibold text-gray-700">Visibility *</Label>
                          <Select value={formData.visibility} onValueChange={(value) => handleChange("visibility", value)}>
                            <SelectTrigger className="focus:ring-2 focus:ring-blue-500 h-10">
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PUBLIC">🌍 Public</SelectItem>
                              <SelectItem value="ORG_ONLY">🏢 Organization Only</SelectItem>
                              <SelectItem value="MEMBERS_ONLY">👥 Members Only</SelectItem>
                              <SelectItem value="PRIVATE">🔒 Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="maxParticipants" className="font-semibold text-gray-700">Max Participants</Label>
                          <Input
                            id="maxParticipants"
                            type="number"
                            min="1"
                            value={formData.maxParticipants}
                            onChange={(e) => handleChange("maxParticipants", e.target.value)}
                            placeholder="Leave empty for unlimited"
                            className="focus:ring-2 focus:ring-blue-500 h-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div>
                    <div className="space-y-1 pb-4 border-b-2 border-gray-100">
                      <h3 className="text-base font-bold text-gray-800 flex items-center">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                        Pricing
                      </h3>
                    </div>
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price" className="font-semibold text-gray-700">Price</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={(e) => handleChange("price", e.target.value)}
                            placeholder="0.00"
                            className="focus:ring-2 focus:ring-blue-500 h-10"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currency" className="font-semibold text-gray-700">Currency *</Label>
                          <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
                            <SelectTrigger className="focus:ring-2 focus:ring-blue-500 h-10">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">🇺🇸 USD ($)</SelectItem>
                              <SelectItem value="EUR">🇪🇺 EUR (€)</SelectItem>
                              <SelectItem value="GBP">🇬🇧 GBP (£)</SelectItem>
                              <SelectItem value="JPY">🇯🇵 JPY (¥)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date & Location Section */}
                  <div>
                    <div className="space-y-1 pb-4 border-b-2 border-gray-100">
                      <h3 className="text-base font-bold text-gray-800 flex items-center">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                        Date & Location
                      </h3>
                    </div>
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startAt" className="font-semibold text-gray-700">Start Date & Time *</Label>
                          <Input
                            id="startAt"
                            type="datetime-local"
                            value={formData.startAt}
                            onChange={(e) => handleChange("startAt", e.target.value)}
                            required
                            className="focus:ring-2 focus:ring-blue-500 h-10"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="endAt" className="font-semibold text-gray-700">End Date & Time</Label>
                          <Input
                            id="endAt"
                            type="datetime-local"
                            value={formData.endAt}
                            onChange={(e) => handleChange("endAt", e.target.value)}
                            className="focus:ring-2 focus:ring-blue-500 h-10"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location" className="font-semibold text-gray-700">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                            placeholder="City, Country"
                            className="focus:ring-2 focus:ring-blue-500 h-10"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="venue" className="font-semibold text-gray-700">Venue Name</Label>
                          <Input
                            id="venue"
                            value={formData.venue}
                            onChange={(e) => handleChange("venue", e.target.value)}
                            placeholder="e.g., Grand Ballroom"
                            className="focus:ring-2 focus:ring-blue-500 h-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="border-red-300 bg-red-50">
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 text-base font-semibold rounded-lg">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Event"
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push("/dashboard/hr")} disabled={loading} className="px-6 py-5 rounded-lg">
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Teams Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 sticky top-6">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-t-xl pb-6">
                <CardTitle className="flex items-center text-lg md:text-xl">
                  <Users className="mr-2 h-5 w-5" />
                  Event Teams
                </CardTitle>
                <CardDescription className="text-emerald-100 text-xs mt-2">
                  Optional: Create teams for this event now
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Teams List */}
                  {teams.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {teams.map((team, index) => (
                        <div key={index} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg hover:border-emerald-400 transition">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-gray-900 truncate">{team.name}</p>
                              {team.purpose && (
                                <p className="text-xs text-gray-600 line-clamp-2 mt-1">{team.purpose}</p>
                              )}
                              <Badge variant="outline" className="mt-2 bg-emerald-100 text-emerald-700 border-emerald-300 text-xs">
                                <Briefcase className="h-3 w-3 mr-1" />
                                Event Team
                              </Badge>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveTeam(index)}
                              className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition"
                              title="Remove team"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Team Form */}
                  {showTeamForm ? (
                    <div className="border-2 border-dashed border-emerald-300 rounded-lg p-4 bg-emerald-50">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="team-name" className="text-xs font-bold text-gray-700">Team Name *</Label>
                          <Input
                            id="team-name"
                            value={newTeam.name}
                            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                            placeholder="e.g., VIP Team"
                            className="text-sm focus:ring-2 focus:ring-emerald-500 h-9"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="team-purpose" className="text-xs font-bold text-gray-700">Purpose (Optional)</Label>
                          <Textarea
                            id="team-purpose"
                            value={newTeam.purpose}
                            onChange={(e) => setNewTeam({ ...newTeam, purpose: e.target.value })}
                            placeholder="What is this team for?"
                            rows={2}
                            className="text-sm resize-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleAddTeam}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Team
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowTeamForm(false)
                              setNewTeam({ name: "", purpose: "" })
                            }}
                            className="px-3"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setShowTeamForm(true)}
                      variant="outline"
                      className="w-full border-2 border-dashed border-emerald-400 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-500 transition"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Team
                    </Button>
                  )}

                  {/* Info Box */}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <strong>💡 Tip:</strong> Teams you create here will be automatically linked to this event and managed from the Teams section.
                    </p>
                  </div>

                  {/* Stats */}
                  {teams.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600 text-center font-semibold">
                        <span className="inline-block bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{teams.length} team{teams.length !== 1 ? "s" : ""}</span>
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
