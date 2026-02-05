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
    where.visibility = { in: ["ORG", ...(session.user.role === "HR" ? ["HR_ONLY"] : [])] }
  }

  const proposals = await prisma.proposal.findMany({
    where,
    include: {
      submittedBy: { select: { id: true, name: true } },
      reviewer: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(proposals)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const startupId = session.user.role === "SUPERADMIN" ? (req.headers.get("x-startup-id") || session.user.startupId) : session.user.startupId
  if (!startupId) return NextResponse.json({ error: "Startup required" }, { status: 400 })

  const body = await req.json()
  const { type, title, visibility, canvasJson, swotJson, timelineStart, timelineEnd, expectedImpact } = body

  const proposal = await prisma.proposal.create({
    data: {
      startupId,
      type,
      title,
      visibility: visibility || "ORG",
      canvasJson,
      swotJson,
      timelineStart: timelineStart ? new Date(timelineStart) : undefined,
      timelineEnd: timelineEnd ? new Date(timelineEnd) : undefined,
      expectedImpact,
      submittedById: session.user.id,
      status: "submitted",
    },
  })
  return NextResponse.json(proposal, { status: 201 })
}

