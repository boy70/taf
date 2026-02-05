import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const startupId = searchParams.get("startupId")
    const role = searchParams.get("role")
    const userId = searchParams.get("userId")

    const whereClause: any = {}

    // Filter by startup if provided
    if (startupId) {
      whereClause.startupId = startupId
    }

    // Filter by role if provided
    if (role) {
      whereClause.role = role
    }

    // Filter by userId if provided
    if (userId) {
      whereClause.id = userId
    }

    // Superadmin can see all users
    if (session.user.role === "SUPERADMIN") {
      const users = await prisma.user.findMany({
        where: whereClause,
        include: {
          result: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
          startup: true,
        },
      })

      // Transform results to match expected format
      return NextResponse.json(
        users.map((user: any) => ({
          ...user,
          results: user.result,
        })),
      )
    }

    // HR can only see users in their startup
    if (session.user.role === "HR" && session.user.startupId) {
      const users = await prisma.user.findMany({
        where: {
          ...whereClause,
          startupId: session.user.startupId,
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

      // Transform results to match expected format
      return NextResponse.json(
        users.map((user: any) => ({
          ...user,
          results: user.result,
        })),
      )
    }

    // Employees can only see themselves
    if (session.user.role === "EMPLOYEE") {
      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
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

      return NextResponse.json([
        {
          ...user,
          results: user?.result,
        },
      ])
    }

    return NextResponse.json([])
  } catch (error) {
    console.error("Users fetch error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
