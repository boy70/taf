import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "../../../../../lib/auth"
import { prisma } from "../../../../../lib/db"

const allowedStatuses = ["submitted", "under_review", "needs_changes", "accepted", "rejected"]

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== "SUPERADMIN" && session.user.role !== "HR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  const { id } = await context.params
  const { status } = await req.json()
  if (!allowedStatuses.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 })

  const proposal = await prisma.proposal.findUnique({ where: { id }, select: { startupId: true } })
  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (session.user.role !== "SUPERADMIN" && session.user.startupId !== proposal.startupId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const updated = await prisma.proposal.update({
    where: { id },
    data: { status, reviewerId: session.user.id },
  })
  return NextResponse.json(updated)
}

