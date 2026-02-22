"use client"

import React, { useState, useEffect } from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Textarea } from "../../../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { Alert, AlertDescription } from "../../../../../components/ui/alert"
import { Loader2, ArrowLeft, Plus, X, Users, Briefcase, Check } from "lucide-react"
import Link from "next/link"
import { Badge } from "../../../../../components/ui/badge"
import { Checkbox } from "../../../../../components/ui/checkbox"

// Label mappings for select options
const TYPE_LABELS: Record<string, string> = {
  GENERAL: '📋 General Event',
  TRAINING: '🎓 Training',
  WORKSHOP: '🛠️ Workshop',
  CONFERENCE: '🎤 Conference',
  MEETING: '👔 Meeting',
  WEBINAR: '💻 Webinar',
}

const FORMAT_LABELS: Record<string, string> = {
  IN_PERSON: '🏢 In Person',
  ONLINE: '💻 Online',
  HYBRID: '🔀 Hybrid',
}

const VISIBILITY_LABELS: Record<string, string> = {
  PUBLIC: '🌍 Public',
  ORG_ONLY: '🏢 Organization Only',
  MEMBERS_ONLY: '👥 Members Only',
  PRIVATE: '🔒 Private',
}

interface Team {
  name: string
  purpose: string
  type: "event-based"
}

interface OrganizationMember {
  id: string
  name: string
  email: string
}

export default function CreateEventPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editEventId = searchParams.get("editId")
  const { data: session } = useSession()
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(!!editEventId)
  const [error, setError] = useState<string | null>(null)
  const [createdEventId, setCreatedEventId] = useState<string | null>(null)
  const [showSetupModal, setShowSetupModal] = useState(false)

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
  const [posterUrl, setPosterUrl] = useState<string | null>(null)
  const [eventTeams, setEventTeams] = useState<any[]>([])
  const [eventDirectors, setEventDirectors] = useState<string[]>([])

  // Load event data if in edit mode
  useEffect(() => {
    if (editEventId) {
      fetchEvent()
    }
  }, [editEventId])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${editEventId}`)
      if (response.ok) {
        const eventData = await response.json()
        setFormData({
          title: eventData.title || "",
          description: eventData.description || "",
          type: eventData.type || "GENERAL",
          format: eventData.format || "IN_PERSON",
          price: eventData.price || 0,
          currency: eventData.currency || "USD",
          startAt: eventData.startAt ? new Date(eventData.startAt).toISOString().slice(0, 16) : "",
          endAt: eventData.endAt ? new Date(eventData.endAt).toISOString().slice(0, 16) : "",
          location: eventData.location || "",
          venue: eventData.venue || "",
          visibility: eventData.visibility || "ORG_ONLY",
          maxParticipants: eventData.maxParticipants?.toString() || "",
          posterFile: null,
        })
        if (eventData.posterUrl) {
          setPosterUrl(eventData.posterUrl)
        }
        setIsEditMode(true)
        setCreatedEventId(editEventId)

        // Fetch teams and directors for this event
        try {
          const teamsResponse = await fetch(`/api/teams?eventId=${editEventId}`)
          if (teamsResponse.ok) {
            const teamsData = await teamsResponse.json()
            setEventTeams(teamsData.data || teamsData || [])
          }
        } catch (err) {
          console.error("Failed to fetch teams:", err)
        }

        try {
          const directorsResponse = await fetch(`/api/event-directors?eventId=${editEventId}`)
          if (directorsResponse.ok) {
            const directorsData = await directorsResponse.json()
            setEventDirectors(directorsData.data?.map((d: any) => d.memberId) || [])
          }
        } catch (err) {
          console.error("Failed to fetch directors:", err)
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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

      const eventPayload = {
        ...formData,
        posterUrl,
        price: parseFloat(formData.price.toString()) || 0,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
        startAt: new Date(formData.startAt).toISOString(),
        endAt: formData.endAt ? new Date(formData.endAt).toISOString() : null,
      }

      if (isEditMode && editEventId) {
        // Update existing event
        const eventResponse = await fetch(`/api/events/${editEventId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventPayload),
        })

        if (!eventResponse.ok) {
          const data = await eventResponse.json()
          throw new Error(data.error || "Failed to update event")
        }

        router.push("/dashboard/hr/events")
      } else {
        // Create new event
        const eventResponse = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventPayload),
        })

        if (!eventResponse.ok) {
          const data = await eventResponse.json()
          throw new Error(data.error || "Failed to create event")
        }

        const eventData = await eventResponse.json()
        const eventId = eventData.id || eventData.data?.id

        // Store the created event ID and show setup modal
        setCreatedEventId(eventId)
        setShowSetupModal(true)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSkipSetup = () => {
    router.push("/dashboard/hr/events")
  }

  const handleGoToSetup = () => {
    if (createdEventId) {
      router.push(`/dashboard/hr/events/setup-teams-and-directors?eventId=${createdEventId}`)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Setup Complete Modal */}
        {showSetupModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">✨ Event Created!</h2>
                <p className="text-gray-600">Your event has been created successfully. Would you like to set up teams and directors now?</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleGoToSetup}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-6"
                >
                  👥 Set Up Teams & Directors
                </Button>
                <Button
                  onClick={handleSkipSetup}
                  variant="outline"
                  className="w-full border-2 py-6"
                >
                  Skip for Now
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                You can always set up teams and directors later from the event details page.
              </p>
            </div>
          </div>
        )}

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
              <CardHeader className="bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 text-white rounded-t-2xl pb-8 shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100 mb-2">
                      {isEditMode ? '✏️ Edit Event' : 'Create Event'}
                    </CardTitle>
                    <CardDescription className="text-purple-100 mt-2 text-lg">
                      {isEditMode ? 'Update your event details' : 'Craft an unforgettable experience for your community'}
                    </CardDescription>
                  </div>
                  <div className="hidden md:block text-6xl opacity-20">{isEditMode ? '✏️' : '✨'}</div>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Info Section */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-100">
                      <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold">1</span>
                        <span>Event Essentials</span>
                      </h3>
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="font-bold text-gray-800 text-base">
                            Event Title <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            placeholder="e.g., Tech Innovation Summit 2026"
                            required
                            className="h-12 text-base border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 font-medium placeholder:text-gray-400 transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="font-bold text-gray-800 text-base">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Tell us about your event... What will make it special?"
                            rows={4}
                            className="border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none font-medium text-base placeholder:text-gray-400 transition-all"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="poster" className="font-bold text-gray-800 text-base">
                            Event Poster
                          </Label>
                          <div className="relative">
                            <Input
                              id="poster"
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null
                                setFormData(prev => ({ ...prev, posterFile: file }))
                              }}
                              className="h-12 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-purple-500 file:to-indigo-600 file:text-white hover:file:bg-gradient-to-r hover:file:from-purple-600 hover:file:to-indigo-700 transition-all"
                            />
                          </div>
                          <p className="text-xs text-gray-600 font-medium">
                            JPG or PNG • Recommended: 1200×600px • Max 5MB
                          </p>
                          {(formData.posterFile || posterUrl) && (
                            <div className="mt-4 p-4 bg-white border-2 border-green-300 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-bold text-green-700">✓ Poster uploaded</p>
                                {formData.posterFile && (
                                  <button
                                    type="button"
                                    onClick={() => setPosterUrl(null)}
                                    className="text-xs text-red-600 hover:text-red-800 font-semibold"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                              <img
                                src={formData.posterFile ? URL.createObjectURL(formData.posterFile) : (posterUrl || "/placeholder.svg")}
                                alt="Poster preview"
                                className="max-w-xs max-h-40 object-contain rounded-lg shadow-md border border-gray-200"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event Configuration Section */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border-2 border-indigo-100">
                      <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">2</span>
                        <span>Event Configuration</span>
                      </h3>
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="type" className="font-bold text-gray-800 text-base">
                              Event Type <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                              <SelectTrigger
                                className={`h-12 border-2 rounded-xl focus:ring-2 focus:ring-indigo-200 font-bold text-base transition-all ${
                                  formData.type
                                    ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-900'
                                    : 'border-gray-200 bg-white hover:border-indigo-400 text-gray-600'
                                }`}
                              >
                                <SelectValue placeholder="Choose event type">
                                  {formData.type ? TYPE_LABELS[formData.type] : 'Choose event type'}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl">
                                <SelectItem value="GENERAL">📋 General Event</SelectItem>
                                <SelectItem value="TRAINING">🎓 Training</SelectItem>
                                <SelectItem value="WORKSHOP">🛠️ Workshop</SelectItem>
                                <SelectItem value="CONFERENCE">🎤 Conference</SelectItem>
                                <SelectItem value="MEETING">👔 Meeting</SelectItem>
                                <SelectItem value="WEBINAR">💻 Webinar</SelectItem>
                              </SelectContent>
                            </Select>
                            {formData.type && (
                              <div className="mt-2 p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg border-l-4 border-indigo-600">
                                <p className="text-sm font-bold text-indigo-900">Selected: {formData.type}</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="format" className="font-bold text-gray-800 text-base">
                              Format <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.format} onValueChange={(value) => handleChange("format", value)}>
                              <SelectTrigger
                                className={`h-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-200 font-bold text-base transition-all ${
                                  formData.format
                                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-900'
                                    : 'border-gray-200 bg-white hover:border-indigo-400 text-gray-600'
                                }`}
                              >
                                <SelectValue placeholder="Choose format">
                                  {formData.format ? FORMAT_LABELS[formData.format] : 'Choose format'}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl">
                                <SelectItem value="IN_PERSON">🏢 In Person</SelectItem>
                                <SelectItem value="ONLINE">💻 Online</SelectItem>
                                <SelectItem value="HYBRID">🔀 Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                            {formData.format && (
                              <div className="mt-2 p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg border-l-4 border-blue-600">
                                <p className="text-sm font-bold text-blue-900">Selected: {formData.format}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="visibility" className="font-bold text-gray-800 text-base">
                              Visibility <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.visibility} onValueChange={(value) => handleChange("visibility", value)}>
                              <SelectTrigger
                                className={`h-12 border-2 rounded-xl focus:ring-2 focus:ring-amber-200 font-bold text-base transition-all ${
                                  formData.visibility
                                    ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900'
                                    : 'border-gray-200 bg-white hover:border-indigo-400 text-gray-600'
                                }`}
                              >
                                <SelectValue placeholder="Choose visibility">
                                  {formData.visibility ? VISIBILITY_LABELS[formData.visibility] : 'Choose visibility'}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl">
                                <SelectItem value="PUBLIC">🌍 Public</SelectItem>
                                <SelectItem value="ORG_ONLY">🏢 Organization Only</SelectItem>
                                <SelectItem value="MEMBERS_ONLY">👥 Members Only</SelectItem>
                                <SelectItem value="PRIVATE">🔒 Private</SelectItem>
                              </SelectContent>
                            </Select>
                            {formData.visibility && (
                              <div className="mt-2 p-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border-l-4 border-amber-600">
                                <p className="text-sm font-bold text-amber-900">Selected: {formData.visibility.replace(/_/g, ' ')}</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="maxParticipants" className="font-bold text-gray-800 text-base">
                              Max Participants
                            </Label>
                            <Input
                              id="maxParticipants"
                              type="number"
                              min="1"
                              value={formData.maxParticipants}
                              onChange={(e) => handleChange("maxParticipants", e.target.value)}
                              placeholder="Leave empty for unlimited"
                              className="h-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 font-medium text-base transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-100">
                      <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center text-lg font-bold">3</span>
                        <span>Pricing Details</span>
                      </h3>
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="price" className="font-bold text-gray-800 text-base">
                              Price
                            </Label>
                            <div className="relative">
                              <span className="absolute left-4 top-3.5 text-2xl font-bold text-emerald-600">💰</span>
                              <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => handleChange("price", e.target.value)}
                                placeholder="0.00"
                                className="pl-14 h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 font-medium text-base transition-all"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="currency" className="font-bold text-gray-800 text-base">
                              Currency <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
                              <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 font-medium text-base transition-all bg-white hover:border-emerald-400">
                                <SelectValue placeholder="Choose currency" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl">
                                <SelectItem value="USD" className="font-semibold">🇺🇸 USD - United States</SelectItem>
                                <SelectItem value="EUR" className="font-semibold">🇪🇺 EUR - Europe</SelectItem>
                                <SelectItem value="GBP" className="font-semibold">🇬🇧 GBP - British Pounds</SelectItem>
                                <SelectItem value="JPY" className="font-semibold">🇯🇵 JPY - Japanese Yen</SelectItem>
                              </SelectContent>
                            </Select>
                            {formData.currency && (
                              <div className="mt-2 p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-l-4 border-emerald-600">
                                <p className="text-sm font-bold text-emerald-900">Selected: {formData.currency}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date & Location Section */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 border-2 border-rose-100">
                      <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-full flex items-center justify-center text-lg font-bold">4</span>
                        <span>Date & Location</span>
                      </h3>
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="startAt" className="font-bold text-gray-800 text-base">
                              Start Date & Time <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                              <span className="absolute left-4 top-3.5 text-2xl">🚀</span>
                              <Input
                                id="startAt"
                                type="datetime-local"
                                value={formData.startAt}
                                onChange={(e) => handleChange("startAt", e.target.value)}
                                required
                                className="pl-14 h-12 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 font-medium text-base transition-all"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="endAt" className="font-bold text-gray-800 text-base">
                              End Date & Time
                            </Label>
                            <div className="relative">
                              <span className="absolute left-4 top-3.5 text-2xl">🏁</span>
                              <Input
                                id="endAt"
                                type="datetime-local"
                                value={formData.endAt}
                                onChange={(e) => handleChange("endAt", e.target.value)}
                                className="pl-14 h-12 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 font-medium text-base transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="location" className="font-bold text-gray-800 text-base">
                              Location
                            </Label>
                            <div className="relative">
                              <span className="absolute left-4 top-3.5 text-2xl">📍</span>
                              <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => handleChange("location", e.target.value)}
                                placeholder="City, Country"
                                className="pl-14 h-12 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 font-medium text-base transition-all"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="venue" className="font-bold text-gray-800 text-base">
                              Venue Name
                            </Label>
                            <div className="relative">
                              <span className="absolute left-4 top-3.5 text-2xl">🏛️</span>
                              <Input
                                id="venue"
                                value={formData.venue}
                                onChange={(e) => handleChange("venue", e.target.value)}
                                placeholder="e.g., Grand Ballroom"
                                className="pl-14 h-12 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 font-medium text-base transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Teams & Directors Section (Edit Mode) */}
                  {isEditMode && (eventTeams.length > 0 || eventDirectors.length > 0) && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border-2 border-cyan-100">
                        <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                          <span className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">5</span>
                          <span>Teams & Directors</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Directors */}
                          {eventDirectors.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-xl">👥</span>
                                Event Directors ({eventDirectors.length})
                              </h4>
                              <div className="space-y-2">
                                {eventDirectors.map((directorId) => (
                                  <div key={directorId} className="p-3 bg-white border-l-4 border-blue-500 rounded-lg">
                                    <p className="font-semibold text-gray-700 text-sm">⭐ {directorId}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Teams */}
                          {eventTeams.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-xl">🎯</span>
                                Teams ({eventTeams.length})
                              </h4>
                              <div className="space-y-2">
                                {eventTeams.map((team: any) => (
                                  <div key={team.id} className="p-3 bg-white border-l-4 border-emerald-500 rounded-lg">
                                    <p className="font-semibold text-gray-700 text-sm">{team.name}</p>
                                    {team.members && team.members.length > 0 && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 p-3 bg-blue-100 border-l-4 border-blue-600 rounded-lg">
                          <p className="text-sm text-blue-900 font-medium">
                            💡 To update teams and directors, go to the <strong>setup page</strong> after saving.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive" className="border-2 border-red-300 bg-red-50 rounded-xl">
                      <AlertDescription className="text-red-800 font-bold">⚠️ {error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg font-black rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {isEditMode ? 'Updating Event...' : 'Creating Event...'}
                        </>
                      ) : (
                        isEditMode ? '💾 Update Event' : '✨ Create Event'
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => router.push("/dashboard/hr")} 
                      disabled={loading} 
                      className="h-14 px-8 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-bold text-base transition-all"
                    >
                      ← Back
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Teams & Directors Setup */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 sticky top-6 rounded-2xl overflow-hidden h-fit">
              <CardHeader className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600 text-white rounded-t-2xl pb-6">
                <CardTitle className="flex items-center text-2xl font-black">
                  <span className="mr-3 text-3xl">👥</span>
                  Teams & Directors
                </CardTitle>
                <CardDescription className="text-blue-100 text-sm mt-2 font-medium">
                  Manage your event team setup
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Setup Steps */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Create Event</p>
                      <p className="text-xs text-gray-600 mt-1">Fill in event details above</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Set Up Team</p>
                      <p className="text-xs text-gray-600 mt-1">Assign members to teams</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Select Directors</p>
                      <p className="text-xs text-gray-600 mt-1">Choose team leads with ⭐</p>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
                  <p className="text-xs text-blue-900 leading-relaxed font-medium">
                    <strong className="text-sm">💡 Tip:</strong> Create your event first, then set up your team structure on the next page. You can also do this later!
                  </p>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => {
                    if (createdEventId) {
                      router.push(`/dashboard/hr/events/setup-teams-and-directors?eventId=${createdEventId}`)
                    } else {
                      setError("Please create the event first!")
                    }
                  }}
                  disabled={loading}
                  className={`w-full h-12 font-bold rounded-xl shadow-md transition-all transform hover:scale-105 active:scale-95 ${
                    createdEventId
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <span className="text-lg mr-2">👥</span>
                  {createdEventId ? 'Set Up Teams & Directors' : 'Create Event First'}
                </Button>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                  <div className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                    <p className="text-xs text-gray-600 font-semibold">Team Members</p>
                    <p className="text-2xl font-black text-purple-600 mt-1">∞</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                    <p className="text-xs text-gray-600 font-semibold">Directors</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">∞</p>
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <p className="text-xs font-bold text-gray-700 mb-3">✨ Features:</p>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="text-lg">🎯</span>
                    <span>Drag-and-drop member assignment</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="text-lg">⭐</span>
                    <span>Star-based team lead selection</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="text-lg">🔍</span>
                    <span>Quick member search & filter</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="text-lg">↩️</span>
                    <span>Return to event creation</span>
                  </div>
                </div>

                {/* Navigation Notice */}
                <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg">
                  <p className="text-xs text-amber-900 font-medium">
                    After creating your event, you'll see a modal to proceed to team setup. You can also skip and set it up later!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
