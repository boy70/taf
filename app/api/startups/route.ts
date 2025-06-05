import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import crypto from "crypto"
import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const startups = await prisma.startup.findMany({
      include: {
        _count: {
          select: { user: true },
        },
      },
    })

    return NextResponse.json(startups)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { name } = body

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid startup name" }, { status: 400 })
    }

    const newStartup = await prisma.startup.create({
      data: {
        id: crypto.randomUUID(),
        name,
        createdById: session.user.id,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(newStartup, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
