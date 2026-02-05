import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "HR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const startupId = session.user.startupId

    // Fetch all employees in the organization
    const employees = await prisma.user.findMany({
      where: { startupId },
    })

    // Fetch all events
    const events = await prisma.event.findMany({
      where: { startupId: startupId || undefined },
    })

    const upcomingEvents = events.filter((e) => new Date(e.startAt) > new Date())
    const pastEvents = events.filter((e) => new Date(e.startAt) <= new Date())

    // Fetch event registrations
    const registrations = await prisma.eventRegistration.findMany({
      where: {
        event: { startupId: startupId || undefined },
      },
    })

    const registeredCount = registrations.filter((r) => r.status === "registered").length
    const attendedCount = registrations.filter((r) => r.status === "attended").length

    // Fetch all proposals
    const proposals = await prisma.proposal.findMany({
      where: {
        submittedBy: { startupId: startupId || undefined },
      },
    })

    const approvedProposals = proposals.filter((p) => p.status === "approved").length
    const rejectedProposals = proposals.filter((p) => p.status === "rejected").length
    const pendingProposals = proposals.filter((p) => p.status === "submitted").length

    // Fetch DISC distribution
    const discResults = await prisma.result.findMany({
      where: { userId: { in: employees.map((e) => e.id) } },
    })

    const discDistribution = {
      D: discResults.filter((r) => r.dominantType === "D").length,
      I: discResults.filter((r) => r.dominantType === "I").length,
      S: discResults.filter((r) => r.dominantType === "S").length,
      C: discResults.filter((r) => r.dominantType === "C").length,
    }

    // Fetch teams
    const teams = await prisma.team.findMany({
      where: { startupId: startupId || undefined },
      include: {
        members: { select: { id: true } },
      },
    })

    // Fetch posts
    const posts = await prisma.organizationPost.findMany({
      where: { startupId: startupId || undefined, status: "published" },
    })

    // Fetch recent activity (using direct queries if activityLog doesn't exist)
    const recentActivity: any[] = []

    return NextResponse.json({
      totalEmployees: employees.length,
      totalEvents: events.length,
      upcomingEventsCount: upcomingEvents.length,
      pastEventsCount: pastEvents.length,
      registeredCount,
      attendedCount,
      approvedProposals,
      rejectedProposals,
      pendingProposals,
      discDistribution,
      teamsCount: teams.length,
      totalTeamMembers: teams.reduce((sum, t: any) => sum + (t.members?.length || 0), 0),
      postsCount: posts.length,
      recentActivity: recentActivity.map((a: any) => ({
        id: a.id,
        action: a.action,
        user: a.user?.name || "System",
        createdAt: a.createdAt,
      })),
    })
  } catch (error: any) {
    console.error("HR dashboard stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}
