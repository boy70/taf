import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get all questions
    const questions = await prisma.question.findMany()

    // Parse discMapping JSON string to object
    const parsedQuestions = questions.map((q: any) => ({
      ...q,
      discMapping: JSON.parse(q.discMapping),
    }))

    // Randomize the order
    const shuffledQuestions = parsedQuestions.sort(() => Math.random() - 0.5)

    // Limit to 20 questions for the test
    const testQuestions = shuffledQuestions.slice(0, 20)

    return NextResponse.json(testQuestions)
  } catch (error) {
    console.error("Questions fetch error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

