import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/db"

interface Params {
  id: string
}

export async function GET(req: Request, context: { params: Promise<Params> }) {
  const params = await context.params
  try {
    const { id } = params

    const startup = await prisma.startup.findUnique({
      where: { id },
      include: {
        startupProfile: true,
        _count: {
          select: {
            user: true,
            event: true,
            project: true,
          },
        },
      },
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    return NextResponse.json(startup)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
