import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface DirectorshipData {
  projects: any[]
  events: any[]
  teams: any[]
  summary: {
    projectCount: number
    eventCount: number
    teamCount: number
    totalDirectorships: number
  }
}

export function DirectorDashboard() {
  const [directorships, setDirectorships] = useState<DirectorshipData | null>(
    null
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDirectorships()
  }, [])

  const fetchDirectorships = async () => {
    try {
      const res = await fetch("/api/directors/me")
      const data = await res.json()
      setDirectorships(data)
    } catch (error) {
      console.error("Error fetching directorships:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading your directorships...</div>
  }

  if (!directorships) {
    return <div>Failed to load directorships</div>
  }

  const { projects, events, teams, summary } = directorships

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.projectCount}</div>
            <p className="text-xs text-gray-500">
              {summary.projectCount === 1 ? "project" : "projects"} managed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.eventCount}</div>
            <p className="text-xs text-gray-500">
              {summary.eventCount === 1 ? "event" : "events"} managed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.teamCount}</div>
            <p className="text-xs text-gray-500">
              {summary.teamCount === 1 ? "team" : "teams"} managed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.totalDirectorships}
            </div>
            <p className="text-xs text-gray-500">total directorships</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Section */}
      {projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Projects You Direct</CardTitle>
            <CardDescription>
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((pd) => (
              <div
                key={pd.id}
                className="flex items-start justify-between rounded border p-4 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <Link
                    href={`/projects/${pd.project.id}`}
                    className="font-semibold hover:underline"
                  >
                    {pd.project.title}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {pd.project.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge>{pd.role}</Badge>
                    <Badge variant="outline">{pd.project.status}</Badge>
                  </div>
                </div>
                <Button asChild size="sm">
                  <Link href={`/projects/${pd.project.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Events Section */}
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Events You Direct</CardTitle>
            <CardDescription>
              {events.length} event{events.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.map((ed) => (
              <div
                key={ed.id}
                className="flex items-start justify-between rounded border p-4 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <Link
                    href={`/events/${ed.event.id}`}
                    className="font-semibold hover:underline"
                  >
                    {ed.event.title}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {ed.event.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(ed.event.startAt).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge>{ed.role}</Badge>
                    <Badge variant="outline">{ed.event.status}</Badge>
                  </div>
                </div>
                <Button asChild size="sm">
                  <Link href={`/events/${ed.event.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Teams Section */}
      {teams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Teams You Direct</CardTitle>
            <CardDescription>
              {teams.length} team{teams.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teams.map((td) => (
              <div
                key={td.id}
                className="flex items-start justify-between rounded border p-4 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <Link
                    href={`/teams/${td.team.id}`}
                    className="font-semibold hover:underline"
                  >
                    {td.team.name}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {td.team.purpose || "No description"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {td.team.members?.length || 0} member
                    {(td.team.members?.length || 0) !== 1 ? "s" : ""}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge>{td.role}</Badge>
                    <Badge variant="outline">{td.team.status}</Badge>
                  </div>
                </div>
                <Button asChild size="sm">
                  <Link href={`/teams/${td.team.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {summary.totalDirectorships === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              You are not currently assigned as a director for any projects,
              events, or teams.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
