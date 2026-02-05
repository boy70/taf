import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const where: any = {}
  if (session.user.role !== "SUPERADMIN") {
    where.startupId = session.user.startupId ?? undefined
    where.OR = [
      { visibility: "ORG" },
      ...(session.user.role === "HR" ? [{ visibility: "HR_ONLY" }] : []),
    ]
  }

  const resources = await prisma.resource.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(resources)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== "SUPERADMIN" && session.user.role !== "HR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const body = await req.json()
  const { title, type, url, description, tagsJson, linkedProjectId, linkedTeamId, visibility } = body
  const startupId = session.user.role === "SUPERADMIN" ? (req.headers.get("x-startup-id") || session.user.startupId) : session.user.startupId
  if (!startupId) return NextResponse.json({ error: "Startup required" }, { status: 400 })

  const resource = await prisma.resource.create({
    data: {
      startupId,
      title,
      type,
      url,
      description,
      tagsJson,
      linkedProjectId,
      linkedTeamId,
      createdById: session.user.id,
      visibility: visibility || "ORG",
    },
  })

  return NextResponse.json(resource, { status: 201 })
}

