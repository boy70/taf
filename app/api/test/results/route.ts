import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import { prisma } from "../../../../lib/db"

const secret = process.env.NEXTAUTH_SECRET

export async function GET(req: NextRequest) {
  try {
    // Use getToken to retrieve session token without req/res
    const token = await getToken({ req, secret })
    let userId: string | null = null

    if (token) {
      const user = await prisma.user.findUnique({ where: { id: token.sub } })
      if (user) {
        userId = user.id
      }
    }

    // If no user is found, try to get the most recent result
    if (!userId) {
      const latestResult = await prisma.result.findFirst({
        orderBy: {
          createdAt: 'desc'
        }
      })

      if (!latestResult) {
        return NextResponse.json({ error: "No results found" }, { status: 404 })
      }

      // Get the insight separately
      const insight = await prisma.insight.findFirst({
        where: {
          userId: latestResult.userId
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return NextResponse.json({
        result: latestResult,
        insight
      })
    }

    // Get the user's most recent result
    const result = await prisma.result.findFirst({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!result) {
      return NextResponse.json({ error: "No results found" }, { status: 404 })
    }

    // Get the insight separately
    const insight = await prisma.insight.findFirst({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      result,
      insight
    })
  } catch (error) {
    console.error("Error fetching test results:", error)
    return NextResponse.json({ error: "Failed to fetch test results" }, { status: 500 })
  }
} 