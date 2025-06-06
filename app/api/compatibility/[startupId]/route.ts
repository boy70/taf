import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/db"
import { calculateTeamCompatibility } from "../../../../lib/compatibility"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ startupId: string }> }
) {
  const params = await context.params
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { startupId } = params

    // Authorization check
    if (
      session.user.role !== "SUPERADMIN" &&
      (session.user.role !== "HR" || session.user.startupId !== startupId)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Fetch users with their latest result
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

    const usersWithResults = users.filter((user: any) => user.result.length > 0)

    const teamMembers = usersWithResults.map((user: any) => ({
      id: user.id,
      name: user.name,
      dominantType: user.result[0].dominantType,
      dScore: user.result[0].dScore,
      iScore: user.result[0].iScore,
      sScore: user.result[0].sScore,
      cScore: user.result[0].cScore,
    }))

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
