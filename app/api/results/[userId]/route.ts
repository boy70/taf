import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/db"

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { userId } = params

    // Check if the user is authorized to view these results
    if (
      session.user.id !== userId &&
      session.user.role !== "SUPERADMIN" &&
      (session.user.role !== "HR" || !session.user.startupId)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // If HR, check if the requested user belongs to their startup
    if (session.user.role === "HR") {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!user || user.startupId !== session.user.startupId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }
    }

    // Get the latest result
    const result = await prisma.result.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get the latest insight
    const insight = await prisma.insight.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      result,
      insight,
    })
  } catch (error) {
    console.error("Results fetch error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
