import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import crypto from "crypto"

import { prisma } from "../../../../lib/db"

export async function POST(req: Request) {
  try {
    console.log("🔐 Registration attempt started")
    
    const { name, email, password, role, startupId } = await req.json()
    
    console.log("📝 Registration data:", { name, email, role, startupId: startupId ? "provided" : "not provided" })

    // Test database connection first
    try {
      await prisma.$connect()
      console.log("✅ Database connection successful")
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError)
      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 500 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      console.log("❌ User already exists:", email)
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    console.log("✅ User does not exist, proceeding with creation")

    // Hash password
    const hashedPassword = await hash(password, 10)
    console.log("✅ Password hashed successfully")

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

    console.log("✅ User created successfully:", user.email)

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
    console.error("❌ Registration error:", error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Database connection failed")) {
        return NextResponse.json(
          { error: "Database connection failed. Please try again later." },
          { status: 500 }
        )
      }
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    )
  } finally {
    try {
      await prisma.$disconnect()
      console.log("✅ Database connection closed")
    } catch (error) {
      console.error("❌ Error disconnecting from database:", error)
    }
  }
}
