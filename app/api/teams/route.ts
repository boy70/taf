import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions, UserRole } from "../../../lib/auth"
import { prisma } from "../../../lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const startupId = searchParams.get("startupId")

    const where: any = {}
    
    if (startupId) {
      where.startupId = startupId
    } else if (session.user.role !== UserRole.SUPERADMIN) {
      where.startupId = session.user.startupId ?? undefined
    }

    const teams = await prisma.team.findMany({
      where,
      include: {
        members: { include: { user: { select: { id: true, name: true, role: true } } } },
        event: { select: { id: true, title: true } },
        project: { select: { id: true, title: true, status: true } },
        tasks: true,
      },
      orderBy: { createdAt: "desc" },
    })

    // Format response for frontend
    const formattedTeams = teams.map((team) => ({
      id: team.id,
      name: team.name,
      purpose: team.purpose,
      description: team.description,
      status: team.status,
      eventId: team.eventId,
      projectId: team.projectId,
      members: team.members.length,
      taskCount: team.tasks.length,
      createdBy: session.user.name,
    }))

    return NextResponse.json(formattedTeams)
  } catch (error) {
    console.error("Teams fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== UserRole.SUPERADMIN && session.user.role !== UserRole.HR)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { name, purpose, description, status, visibility, leadIdsJson, startupId, eventId } = await req.json()
    
    const finalStartupId = startupId || session.user.startupId

    if (!finalStartupId) return NextResponse.json({ error: "Startup required" }, { status: 400 })
    if (!name) return NextResponse.json({ error: "Team name required" }, { status: 400 })

    const team = await prisma.team.create({
      data: {
        name,
        purpose,
        description,
        status: status || "active",
        visibility: visibility || "ORG",
        leadIdsJson,
        startupId: finalStartupId,
        createdById: session.user.id,
        eventId: eventId || null,
      },
      include: {
        members: true,
        createdBy: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json({
      id: team.id,
      name: team.name,
      purpose: team.purpose,
      status: team.status,
      eventId: team.eventId,
      members: team.members.length,
      taskCount: 0,
      createdBy: team.createdBy.name,
    })
  } catch (error) {
    console.error("Team creation error:", error)
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 })
  }
}

