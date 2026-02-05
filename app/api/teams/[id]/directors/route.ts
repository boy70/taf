import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get all directors of this team
    const directors = await prisma.teamDirector.findMany({
      where: { teamId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ directors })
  } catch (error: any) {
    console.error("Error fetching team directors:", error)
    return NextResponse.json(
      { error: "Failed to fetch team directors" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "HR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await req.json()
    const { userId, role = "DIRECTOR" } = body

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // Verify team exists
    const team = await prisma.team.findUnique({
      where: { id },
    })

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    // Check if director already exists
    const existing = await prisma.teamDirector.findUnique({
      where: {
        teamId_userId: {
          teamId: id,
          userId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "User is already a director of this team" },
        { status: 400 }
      )
    }

    // Create director relationship
    const director = await prisma.teamDirector.create({
      data: {
        teamId: id,
        userId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ director }, { status: 201 })
  } catch (error: any) {
    console.error("Error assigning team director:", error)
    return NextResponse.json(
      { error: "Failed to assign team director" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "HR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, userId } = params

    // Delete director relationship
    const deleted = await prisma.teamDirector.delete({
      where: {
        teamId_userId: {
          teamId: id,
          userId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ message: "Director removed", director: deleted })
  } catch (error: any) {
    console.error("Error removing team director:", error)
    return NextResponse.json(
      { error: "Failed to remove team director" },
      { status: 500 }
    )
  }
}
