import { NextResponse } from "next/server"
import { prisma } from "../../../lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    // Get all startups with public profiles
    const startups = await prisma.startup.findMany({
      where: {
        startupProfile: {
          isPublic: true,
        },
      },
      include: {
        startupProfile: true,
        user: {
          where: { role: "HR" },
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { user: true, event: true, project: true },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    })

    const total = await prisma.startup.count({
      where: {
        startupProfile: {
          isPublic: true,
        },
      },
    })

    return NextResponse.json({
      startups,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
