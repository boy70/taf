import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import crypto from "crypto"

import { prisma } from "../../../../lib/db"

export async function POST(req: Request) {
  try {
    const { name, email, password, role, startupId } = await req.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name,
        email,
        password: hashedPassword,
        role,
        startupId,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
