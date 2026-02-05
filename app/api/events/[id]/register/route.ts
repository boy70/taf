import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/auth"
import { prisma } from "../../../../../lib/db"
import type { NextRequest } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const { id: eventId } = await params

    // Get registration status with event details
    const registration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.id,
        },
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startAt: true,
            status: true,
          },
        },
      },
    })

    return NextResponse.json({
      isRegistered: !!registration,
      status: registration?.status || null,
      appliedAt: registration?.appliedAt || null,
      approvedAt: registration?.approvedAt || null,
      event: registration?.event || null,
    })
  } catch (error) {
    console.error("Error checking registration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const { id: eventId } = await params

    // Validate event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        visibility: true,
        title: true,
        status: true,
        isApprovalRequired: true,
        maxParticipants: true,
        startAt: true,
        _count: { select: { registrations: true } },
      },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if event is in the past
    if (event.status === "COMPLETED" || event.status === "CANCELLED") {
      return NextResponse.json(
        { error: `Cannot register for a ${event.status.toLowerCase()} event` },
        { status: 400 }
      )
    }

    // Check max participants
    if (event.maxParticipants && event._count.registrations >= event.maxParticipants) {
      return NextResponse.json(
        { error: "Event is at full capacity" },
        { status: 400 }
      )
    }

    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.id,
        },
      },
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 }
      )
    }

    // Determine initial registration status based on event settings
    const initialStatus = event.isApprovalRequired ? "REGISTERED" : "APPROVED"

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId: session.user.id,
        status: initialStatus,
        appliedAt: new Date(),
        approvedAt: !event.isApprovalRequired ? new Date() : null,
      },
      include: {
        user: {
          select: { 
            id: true, 
            name: true, 
            email: true,
            profile: {
              select: { headline: true }
            }
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            startAt: true,
          },
        },
      },
    })

    // Log event for auditing
    console.log(`User ${session.user.id} registered for event ${eventId}`)

    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    console.error("Error registering for event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const { id: eventId } = await params

    const registration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.id,
        },
      },
      include: {
        event: {
          select: { title: true },
        },
      },
    })

    if (!registration) {
      return NextResponse.json(
        { error: "Not registered for this event" },
        { status: 404 }
      )
    }

    // Check if event is already happening
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { status: true, startAt: true },
    })

    if (event?.status === "ONGOING") {
      return NextResponse.json(
        { error: "Cannot unregister from an ongoing event" },
        { status: 400 }
      )
    }

    // Cancel registration
    await prisma.eventRegistration.delete({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.id,
        },
      },
    })

    console.log(`User ${session.user.id} unregistered from event ${eventId}`)

    return NextResponse.json({ 
      success: true, 
      message: "Registration cancelled successfully" 
    })
  } catch (error) {
    console.error("Error cancelling registration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
