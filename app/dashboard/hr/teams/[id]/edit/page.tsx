"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./../../../../../../components/ui/card"
import { Button } from "../../../../../../components/ui/button"
import { Input } from "./../../../../../../components/ui/input"
import { Badge } from "./../../../../../../components/ui/badge"
import { Alert, AlertDescription } from "./../../../../../../components/ui/alert"
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Save,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

interface Team {
  id: string
  name: string
  purpose?: string
  description?: string
  status: string
  visibility?: string
  eventId?: string | null
}

export default function TeamEditPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const teamId = params.id as string

  const [team, setTeam] = useState<Team | null>(null)
  const [formData, setFormData] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/teams?id=${teamId}`)
        if (!res.ok) throw new Error("Failed to fetch team")

        const data = await res.json()
        const teamData = Array.isArray(data) ? data[0] : data
        setTeam(teamData)
        setFormData(teamData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (teamId) {
      fetchTeamData()
    }
  }, [teamId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSave = async () => {
    if (!formData) return

    if (!formData.name.trim()) {
      alert("Team name is required")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          purpose: formData.purpose,
          description: formData.description,
          status: formData.status,
          visibility: formData.visibility,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to update team")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/dashboard/hr/teams/${teamId}`)
      }, 1500)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
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

  if (error || !team || !formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-2xl mx-auto">
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
      <div className="max-w-2xl mx-auto">
        <Link href={`/dashboard/hr/teams/${teamId}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Team
        </Link>

        <Card className="shadow-lg border-0 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-700"></div>
          <CardHeader className="pt-8 pb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md flex items-center justify-center text-white text-2xl font-bold -mt-20">
                {team.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">Edit Team</CardTitle>
                <CardDescription>Update team information and settings</CardDescription>
              </div>
            </div>
          </CardHeader>

          {success && (
            <Alert className="mx-6 mb-4 bg-emerald-50 border-emerald-200">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-700">Team updated successfully! Redirecting...</AlertDescription>
            </Alert>
          )}

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Team Name *</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Team name"
                  className="focus:ring-2 focus:ring-blue-500 h-10"
                  disabled={saving}
                />
                <p className="text-xs text-gray-500 mt-1">The primary name of your team</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  disabled={saving}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Purpose/Description</label>
              <textarea
                name="purpose"
                value={formData.purpose || ""}
                onChange={handleInputChange}
                placeholder="What is this team for? What are their main responsibilities?"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                disabled={saving}
              />
              <p className="text-xs text-gray-500 mt-1">Describe the team's purpose and responsibilities</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Additional Description</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Any additional information about this team"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Visibility</label>
                <select
                  name="visibility"
                  value={formData.visibility || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  disabled={saving}
                >
                  <option value="">Select visibility</option>
                  <option value="public">Public</option>
                  <option value="organization">Organization Only</option>
                  <option value="members">Members Only</option>
                  <option value="private">Private</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Who can see this team</p>
              </div>

              {team.eventId && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Team Type</label>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                      Event-Based (Linked)
                    </Badge>
                    <p className="text-xs text-gray-600 mt-2">This team is linked to an event and cannot be changed to independent</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-sm text-blue-900 mb-2">Quick Info</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                <div>
                  <p className="text-blue-600 font-medium">Team ID</p>
                  <code className="bg-white px-2 py-1 rounded border border-blue-100 block mt-1 break-all font-mono">{team.id}</code>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
