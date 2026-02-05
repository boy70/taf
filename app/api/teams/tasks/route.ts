import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user || user.role !== "HR") {
      return NextResponse.json(
        { error: "Only HR can create tasks" },
        { status: 403 }
      );
    }

    const { teamId, title, description, priority, dueDate } = await req.json();

    if (!teamId || !title) {
      return NextResponse.json(
        { error: "Team ID and title are required" },
        { status: 400 }
      );
    }

    // Verify team exists and belongs to user's startup
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { startup: true, members: true },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    if (team.startup.id !== user.startupId) {
      return NextResponse.json(
        { error: "Unauthorized: team not in your organization" },
        { status: 403 }
      );
    }

    // Create the task
    const task = await prisma.teamTask.create({
      data: {
        teamId,
        title,
        description,
        priority: priority?.toUpperCase() || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        createdById: user.id,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    // Auto-assign to all team members
    const members = team.members;
    const assignments = await Promise.all(
      members.map((member: any) =>
        prisma.teamTaskAssignment.create({
          data: {
            taskId: task.id,
            teamMemberId: member.id,
            userId: member.userId,
            status: "ASSIGNED",
          },
        })
      )
    );

    return NextResponse.json(
      { success: true, task, assignments },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");
    const status = searchParams.get("status");

    let whereClause: any = {
      team: {
        startup: { id: user.startupId },
      },
    };

    if (teamId) {
      whereClause.teamId = teamId;
    }

    if (status) {
      whereClause.status = status.toUpperCase();
    }

    const tasks = await prisma.teamTask.findMany({
      where: whereClause,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignments: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            approver: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
