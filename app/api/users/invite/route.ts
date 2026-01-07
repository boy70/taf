import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import crypto from "crypto"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/db"
import { UserRole } from "../../../../lib/auth"
import { sendInviteEmail } from "../../../../lib/email"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== UserRole.SUPERADMIN && session.user.role !== UserRole.HR)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    const { name, email, role, startupId } = await req.json()
    let finalRole = role
    let finalStartupId = startupId
    // HR can only invite EMPLOYEE to their own startup
    if (session.user.role === UserRole.HR) {
      finalRole = UserRole.EMPLOYEE
      finalStartupId = session.user.startupId
    }
    // Validate role
    if (!finalRole || !Object.values(UserRole).includes(finalRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }
    // Validate startupId for EMPLOYEE/HR
    if ((finalRole === UserRole.EMPLOYEE || finalRole === UserRole.HR) && !finalStartupId) {
      return NextResponse.json({ error: "Startup is required for this role" }, { status: 400 })
    }
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 400 })
    }
    // Generate a random password (should be sent to the user)
    const generatedPassword = crypto.randomBytes(8).toString("base64")
    // Create user
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: name || email.split("@")[0],
        email,
        password: generatedPassword, // In production, hash this and send via email
        role: finalRole,
        startupId: finalStartupId,
        invitedById: session.user.id,
        updatedAt: new Date(),
      },
    })
    // Send email to user with credentials
    try {
      await sendInviteEmail({ to: email, password: generatedPassword })
    } catch (emailErr: any) {
      console.error("Failed to send invite email:", emailErr)
      return NextResponse.json({ error: "User created, but failed to send email: " + (emailErr?.message || emailErr) }, { status: 500 })
    }
    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Invitation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
