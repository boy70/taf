import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/db"
import { calculateTeamCompatibility } from "../../../../lib/compatibility"

export async function GET(
  request: NextRequest,
  context: { params: { startupId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { startupId } = context.params

    // Check if the user is authorized to view this startup's compatibility
    if (session.user.role !== "SUPERADMIN" && (session.user.role !== "HR" || session.user.startupId !== startupId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get all users with results for this startup
    const users = await prisma.user.findMany({
      where: {
        startupId,
      },
      include: {
        result: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    })

    // Filter users who have taken the test
    const usersWithResults = users.filter((user: any) => user.result.length > 0)

    // Format team members
    const teamMembers = usersWithResults.map((user: any) => ({
      id: user.id,
      name: user.name,
      dominantType: user.result[0].dominantType,
      dScore: user.result[0].dScore,
      iScore: user.result[0].iScore,
      sScore: user.result[0].sScore,
      cScore: user.result[0].cScore,
    }))

    // Calculate team compatibility
    const compatibility = calculateTeamCompatibility(teamMembers)

    return NextResponse.json({
      teamMembers,
      compatibility,
    })
  } catch (error) {
    console.error("Compatibility fetch error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
