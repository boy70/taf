"use client"
import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import type { UserRole } from "../../../../types/user"

import { DashboardLayout } from "../../../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import type { TeamMember, TeamCompatibility } from "../../../../lib/types"
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar"

export default function CompatibilityPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [compatibility, setCompatibility] = useState<TeamCompatibility | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    if (status === "authenticated" && session.user.role === "HR" && session.user.startupId) {
      fetchCompatibility()
    }
  }, [status, router, session])

  const fetchCompatibility = async () => {
    try {
      const response = await fetch(`/api/compatibility/${session?.user.startupId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch compatibility data")
      }
      const data = await response.json()
      setTeamMembers(data.teamMembers)
      setCompatibility(data.compatibility)
      setIsLoading(false)
    } catch (error) {
      setError("Failed to load compatibility data. Please try again.")
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "D":
        return "bg-red-500"
      case "I":
        return "bg-yellow-500"
      case "S":
        return "bg-green-500"
      case "C":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout role={(session?.user.role || "HR") as UserRole}>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout role={(session?.user.role || "HR") as UserRole}>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </DashboardLayout>
    )
  }

  if (!teamMembers.length) {
    return (
      <DashboardLayout role={(session?.user.role || "HR") as UserRole}>
        <Card>
          <CardHeader>
            <CardTitle>No Team Data Available</CardTitle>
            <CardDescription>
              Your team members need to complete the DISC test to view compatibility analysis.
            </CardDescription>
          </CardHeader>
        </Card>
      </DashboardLayout>
    )
  }

  // Count DISC types
  const typeCounts = {
    D: teamMembers.filter((m) => m.dominantType === "D").length,
    I: teamMembers.filter((m) => m.dominantType === "I").length,
    S: teamMembers.filter((m) => m.dominantType === "S").length,
    C: teamMembers.filter((m) => m.dominantType === "C").length,
  }

  // Calculate percentages
  const total = teamMembers.length
  const typePercentages = {
    D: (typeCounts.D / total) * 100,
    I: (typeCounts.I / total) * 100,
    S: (typeCounts.S / total) * 100,
    C: (typeCounts.C / total) * 100,
  }

  return (
    <DashboardLayout role={(session?.user.role || "HR") as UserRole}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Team Compatibility Analysis</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Team Balance Score</CardTitle>
              <CardDescription>How well-balanced your team is across DISC types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-4">{compatibility?.balance ? Math.round(compatibility.balance) : 0}%</div>
                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{
                      width: `${compatibility?.balance ?? 0}%`,
                    }}
                  ></div>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {compatibility?.balance === undefined
                    ? "No balance data available"
                    : compatibility.balance < 30
                      ? "Poor balance - Your team lacks diversity in personality types"
                      : compatibility.balance < 60
                        ? "Moderate balance - Your team has some diversity, but could improve"
                        : "Good balance - Your team has a healthy mix of personality types"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DISC Distribution</CardTitle>
              <CardDescription>Personality type breakdown in your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center">
                  <div className="text-xl font-bold text-red-500">D</div>
                  <div className="text-lg">{typeCounts.D}</div>
                  <div className="text-sm">{Math.round(typePercentages.D)}%</div>
                  <div className="h-24 w-full bg-gray-200 mt-2">
                    <div className="bg-red-500 h-full" style={{ height: `${typePercentages.D}%` }}></div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xl font-bold text-yellow-500">I</div>
                  <div className="text-lg">{typeCounts.I}</div>
                  <div className="text-sm">{Math.round(typePercentages.I)}%</div>
                  <div className="h-24 w-full bg-gray-200 mt-2">
                    <div className="bg-yellow-500 h-full" style={{ height: `${typePercentages.I}%` }}></div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xl font-bold text-green-500">S</div>
                  <div className="text-lg">{typeCounts.S}</div>
                  <div className="text-sm">{Math.round(typePercentages.S)}%</div>
                  <div className="h-24 w-full bg-gray-200 mt-2">
                    <div className="bg-green-500 h-full" style={{ height: `${typePercentages.S}%` }}></div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xl font-bold text-blue-500">C</div>
                  <div className="text-lg">{typeCounts.C}</div>
                  <div className="text-sm">{Math.round(typePercentages.C)}%</div>
                  <div className="h-24 w-full bg-gray-200 mt-2">
                    <div className="bg-blue-500 h-full" style={{ height: `${typePercentages.C}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analysis">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Team Analysis</TabsTrigger>
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          <TabsContent value="analysis" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Strengths & Weaknesses</CardTitle>
                <CardDescription>Based on your team's DISC composition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Team Strengths</h3>
                    {compatibility?.strengths.length ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {compatibility.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No strengths identified yet.</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Team Weaknesses</h3>
                    {compatibility?.weaknesses.length ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {compatibility.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No weaknesses identified yet.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="members" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Individual DISC profiles in your team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center p-3 border rounded-lg">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarFallback className={getTypeColor(member.dominantType)}>
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">Type {member.dominantType}</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex flex-col items-center w-10">
                          <div className="text-xs font-medium text-red-500">D</div>
                          <div className="text-xs">{Math.round(member.dScore)}%</div>
                        </div>
                        <div className="flex flex-col items-center w-10">
                          <div className="text-xs font-medium text-yellow-500">I</div>
                          <div className="text-xs">{Math.round(member.iScore)}%</div>
                        </div>
                        <div className="flex flex-col items-center w-10">
                          <div className="text-xs font-medium text-green-500">S</div>
                          <div className="text-xs">{Math.round(member.sScore)}%</div>
                        </div>
                        <div className="flex flex-col items-center w-10">
                          <div className="text-xs font-medium text-blue-500">C</div>
                          <div className="text-xs">{Math.round(member.cScore)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="recommendations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Recommendations</CardTitle>
                <CardDescription>Suggestions to improve team dynamics</CardDescription>
              </CardHeader>
              <CardContent>
                {compatibility?.recommendations.length ? (
                  <ul className="list-disc pl-5 space-y-3">
                    {compatibility.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No recommendations available yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
