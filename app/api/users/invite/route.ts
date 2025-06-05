import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import crypto from "crypto"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/db"
import { UserRole } from "../../../../lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== UserRole.SUPERADMIN && session.user.role !== UserRole.HR)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { name, email, role, startupId } = await req.json()

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name,
        email,
        password: "", // Password should be set properly, e.g., hashed or generated
        role,
        startupId,
        invitedById: session.user.id,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Invitation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
