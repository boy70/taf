import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { hash } from "bcryptjs"
import type { NextRequest } from "next/server"

import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/db"
import { generateInsight } from "../../../../lib/huggingface"

const secret = process.env.NEXTAUTH_SECRET

export async function POST(req: NextRequest) {
  try {
    // Use getToken to retrieve session token without req/res
    const token = await getToken({ req, secret })
    let userId: string | null = null

    if (token) {
      const user = await prisma.user.findUnique({ where: { id: token.sub } })
      if (user) {
        userId = user.id
      }
    }

    const { answers } = await req.json()

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: "Invalid answers" }, { status: 400 })
    }

    const questionIds = answers.map((a) => a.questionId)
    const questions = await prisma.question.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
    })

    let dScore = 0, iScore = 0, sScore = 0, cScore = 0
    const totalQuestions = answers.length

    for (const answer of answers) {
      const question = questions.find((q: any) => q.id === answer.questionId)
      if (!question) continue

      const discMapping = JSON.parse(question.discMapping)
      const mapping = discMapping[answer.agreementLevel?.toString() ?? ""]

      if (mapping) {
        dScore += mapping.d || 0
        iScore += mapping.i || 0
        sScore += mapping.s || 0
        cScore += mapping.c || 0
      }
    }

    dScore = (dScore / totalQuestions) * 100
    iScore = (iScore / totalQuestions) * 100
    sScore = (sScore / totalQuestions) * 100
    cScore = (cScore / totalQuestions) * 100

    const scores = [
      { type: "D", score: dScore },
      { type: "I", score: iScore },
      { type: "S", score: sScore },
      { type: "C", score: cScore },
    ]

    scores.sort((a, b) => b.score - a.score)
    const dominantType = scores[0].type as "D" | "I" | "S" | "C"

    // Create a temporary user if not authenticated
    if (!userId) {
      const tempPassword = await hash("temp_password", 10)
      const tempUser = await prisma.user.create({
        data: {
          email: `temp_${Date.now()}@example.com`,
          name: "Guest User",
          password: tempPassword,
          role: "REGULAR_USER",
          id: `temp_${Date.now()}`,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      })
      userId = tempUser.id
    }

    await prisma.$transaction(
      answers.map((answer) =>
        prisma.answer.create({
          data: {
            userId,
            questionId: answer.questionId,
            agreementLevel: answer.agreementLevel ?? 0,
          },
        })
      )
    )

    const result = await prisma.result.create({
      data: {
        userId,
        dScore,
        iScore,
        sScore,
        cScore,
        dominantType,
      },
    })

    const insightText = await generateInsight({
      dScore,
      iScore,
      sScore,
      cScore,
      dominantType,
    })

    const insight = await prisma.insight.create({
      data: {
        userId,
        text: insightText,
      },
    })

    return NextResponse.json({ result, insight })
  } catch (error) {
    console.error("Test submission error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
