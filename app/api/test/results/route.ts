import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"
import { prisma } from "../../../../lib/db"

const secret = process.env.NEXTAUTH_SECRET

export async function GET(req: NextRequest) {
  try {
    // Use getToken to retrieve session token without req/res
    const token = await getToken({ req, secret })
    if (!token?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const userId = token.sub

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