import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/db"
import type { NextRequest } from "next/server"
import QRCode from "qrcode"
import { v4 as uuidv4 } from "uuid"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const startupId = searchParams.get("startupId")
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "20")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const session = await getServerSession(authOptions)
    const where: any = {}

    if (startupId) where.startupId = startupId
    if (status) where.status = status

    // Build visibility query based on user role
    if (session?.user?.id) {
      where.OR = [
        { visibility: "PUBLIC" },
        { visibility: "ORG_ONLY", startupId: session.user.startupId },
        {
          visibility: "MEMBERS_ONLY",
          startupId: session.user.startupId,
        },
        {
          visibility: "PRIVATE",
          approvalRequests: {
            some: {
              userId: session.user.id,
              status: "APPROVED",
            },
          },
        },
      ]
    } else {
      where.visibility = "PUBLIC"
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { registrations: true, attendances: true },
          },
        },
        orderBy: { startAt: "asc" },
        take: limit,
        skip,
      }),
      prisma.event.count({ where }),
    ])

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || user.role !== "HR") {
      return NextResponse.json(
        { error: "Only HR can create events" },
        { status: 403 }
      )
    }

    if (!user.startupId) {
      return NextResponse.json(
        { error: "User not assigned to a startup" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const {
      title,
      description,
      type,
      format,
      price,
      currency,
      visibility,
      maxParticipants,
      startAt,
      endAt,
      location,
      venue,
      skillsJson,
      tags,
      category,
      relatedTeamId,
      relatedProjectId,
    } = body

    if (!title || !startAt) {
      return NextResponse.json(
        { error: "Title and startAt are required" },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        startupId: user.startupId,
        title,
        description,
        type: type || "GENERAL",
        format: format || "IN_PERSON",
        price: price || 0,
        currency: currency || "USD",
        visibility: visibility || "ORG_ONLY",
        maxParticipants: maxParticipants || null,
        startAt: new Date(startAt),
        endAt: endAt ? new Date(endAt) : null,
        location,
        venue,
        skillsJson,
        tags,
        category,
        relatedTeamId,
        relatedProjectId,
        createdById: session.user.id,
        status: "UPCOMING",
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        _count: {
            select: { registrations: true, attendances: true },
        },
      },
    })

    // Generate QR code for the event
    try {
      const qrCodeData = uuidv4()
      const qrCodeUrl = await QRCode.toDataURL(qrCodeData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      // Update event with QR code
      await prisma.event.update({
        where: { id: event.id },
        data: {
          qrCodeUrl,
          qrCodeData,
        },
      })

      // Create QR code record
      await prisma.eventQRCode.create({
        data: {
          eventId: event.id,
          code: qrCodeData,
          qrImageUrl: qrCodeUrl,
          qrData: qrCodeData,
        },
      })

      // Return event with QR code
      return NextResponse.json({
        ...event,
        qrCodeUrl,
        qrCodeData,
      }, { status: 201 })
    } catch (qrError) {
      console.error("Error generating QR code:", qrError)
      // Return event without QR code if generation fails
      return NextResponse.json(event, { status: 201 })
    }
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

