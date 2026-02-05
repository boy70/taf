import type React from "react"
import { getServerSession } from "next-auth/next"
import { UserRole } from "../../../../../types/user"
import { authOptions } from "../../../../../lib/auth"
import { prisma } from "../../../../../lib/db"
import { HRSidebar } from "../../../../../components/layout/hr-sidebar"
import TeamGroupsClient from "../../../../../components/team-groups-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Alert, AlertDescription } from "../../../../../components/ui/alert"
import { AlertCircle } from "lucide-react"

export default async function TeamGroupsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <div className="p-8 text-center text-red-500">Not authenticated</div>
  }
  if (session.user.role !== UserRole.HR) {
    return <div className="p-8 text-center text-red-500">Not authorized</div>
  }
  if (!session.user.startupId) {
    return <div className="p-8 text-center text-red-500">No startup assigned</div>
  }

  let startup = null
  let employees: any[] = []

  try {
    startup = await prisma.startup.findUnique({
      where: { id: session.user.startupId },
    })

    employees = await prisma.user.findMany({
      where: {
        startupId: session.user.startupId,
        role: "EMPLOYEE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile: {
          select: {
            headline: true,
            bio: true,
          },
        },
        result: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            dominantType: true,
          },
        },
      },
    })
  } catch (err: any) {
    return <div className="p-8 text-center text-red-500">Error loading data: {err.message}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Sidebar */}
      <HRSidebar organizationName={startup?.name || "Organization"} />

      {/* Main Content */}
      <main className="md:ml-64 pt-20 md:pt-0">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Team Groups & Divisions
            </h1>
            <p className="text-gray-600">Organize your team into groups with drag-and-drop functionality</p>
          </div>

          {/* Info Alert */}
          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Drag and drop employees between groups. Each group needs at least one <strong>Chef d'équipe</strong> (team leader).
            </AlertDescription>
          </Alert>

          {/* Team Groups Component */}
          <TeamGroupsClient employees={employees} startupId={session.user.startupId} />
        </div>
      </main>
    </div>
  )
}
