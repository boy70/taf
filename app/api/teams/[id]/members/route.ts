import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "../../../../../lib/auth"
import { prisma } from "../../../../../lib/db"

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== "SUPERADMIN" && session.user.role !== "HR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { id } = await context.params
  const { userId, roleInTeam } = await req.json()

  const team = await prisma.team.findUnique({ where: { id }, select: { startupId: true } })
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { startupId: true } })
  if (!team || !user) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (session.user.role !== "SUPERADMIN") {
    if (!session.user.startupId || session.user.startupId !== team.startupId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
  }
  if (team.startupId !== user.startupId) {
    return NextResponse.json({ error: "User not in same startup" }, { status: 400 })
  }

  const member = await prisma.teamMember.upsert({
    where: { teamId_userId: { teamId: id, userId } },
    update: { roleInTeam },
    create: { teamId: id, userId, roleInTeam },
  })

  return NextResponse.json(member, { status: 201 })
}

