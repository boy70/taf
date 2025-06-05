import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

const newQuestions = [
  // Dominance (D) Questions
  {
    questionText: "I enjoy taking charge of situations and leading others.",
    discMapping: {
      "1": { d: 1, i: 0, s: 0, c: 0 },
      "2": { d: 0.75, i: 0, s: 0, c: 0 },
      "3": { d: 0.5, i: 0, s: 0, c: 0 },
      "4": { d: 0.25, i: 0, s: 0, c: 0 },
      "5": { d: 0, i: 0, s: 0, c: 0 }
    }
  },
  {
    questionText: "I am comfortable making quick decisions, even with limited information.",
    discMapping: {
      "1": { d: 1, i: 0, s: 0, c: 0 },
      "2": { d: 0.75, i: 0, s: 0, c: 0 },
      "3": { d: 0.5, i: 0, s: 0, c: 0 },
      "4": { d: 0.25, i: 0, s: 0, c: 0 },
      "5": { d: 0, i: 0, s: 0, c: 0 }
    }
  },
  {
    questionText: "I set ambitious goals and strive to achieve them, regardless of obstacles.",
    discMapping: {
      "1": { d: 1, i: 0, s: 0, c: 0 },
      "2": { d: 0.75, i: 0, s: 0, c: 0 },
      "3": { d: 0.5, i: 0, s: 0, c: 0 },
      "4": { d: 0.25, i: 0, s: 0, c: 0 },
      "5": { d: 0, i: 0, s: 0, c: 0 }
    }
  },

  // Influence (I) Questions
  {
    questionText: "I find it easy to engage others in conversation and build rapport.",
    discMapping: {
      "1": { d: 0, i: 1, s: 0, c: 0 },
      "2": { d: 0, i: 0.75, s: 0, c: 0 },
      "3": { d: 0, i: 0.5, s: 0, c: 0 },
      "4": { d: 0, i: 0.25, s: 0, c: 0 },
      "5": { d: 0, i: 0, s: 0, c: 0 }
    }
  },
  {
    questionText: "I often use enthusiasm to motivate those around me.",
    discMapping: {
      "1": { d: 0, i: 1, s: 0, c: 0 },
      "2": { d: 0, i: 0.75, s: 0, c: 0 },
      "3": { d: 0, i: 0.5, s: 0, c: 0 },
      "4": { d: 0, i: 0.25, s: 0, c: 0 },
      "5": { d: 0, i: 0, s: 0, c: 0 }
    }
  },
  {
    questionText: "I enjoy being the center of attention in social settings.",
    discMapping: {
      "1": { d: 0, i: 1, s: 0, c: 0 },
      "2": { d: 0, i: 0.75, s: 0, c: 0 },
      "3": { d: 0, i: 0.5, s: 0, c: 0 },
      "4": { d: 0, i: 0.25, s: 0, c: 0 },
      "5": { d: 0, i: 0, s: 0, c: 0 }
    }
  },

  // Steadiness (S) Questions
  {
    questionText: "I prefer a consistent and predictable routine in my daily activities.",
    discMapping: {
      "1": { d: 0, i: 0, s: 1, c: 0 },
      "2": { d: 0, i: 0, s: 0.75, c: 0 },
      "3": { d: 0, i: 0, s: 0.5, c: 0 },
      "4": { d: 0, i: 0, s: 0.25, c: 0 },
      "5": { d: 0, i: 0, s: 0, c: 0 }
    }
  },
  {
    questionText: "I am patient and willing to listen to others' concerns.",
    discMapping: {
      "1": { d: 0, i: 0, s: 1, c: 0 },
      "2": { d: 0, i: 0, s: 0.75, c: 0 },
      "3": { d: 0, i: 0, s: 0.5, c: 0 },
      "4": { d: 0, i: 0, s: 0.25, c: 0 },
      "5": { d: 0, i: 0, s: 0, c: 0 }
    }
  },
  {
    questionText: "I remain calm and composed, even in stressful situations.",
    discMapping: {
      "1": { d: 0, i: 0, s: 1, c: 0 },
      "2": { d: 0, i: 0, s: 0.75, c: 0 },
      "3": { d: 0, i: 0, s: 0.5, c: 0 },
      "4": { d: 0, i: 0, s: 0.25, c: 0 },
      "5": { d: 0, i: 0, s: 0, c: 0 }
    }
  },

  // Conscientiousness (C) Questions
  {
    questionText: "I pay close attention to details to ensure accuracy in my work.",
    discMapping: {
      "1": { d: 0, i: 0, s: 0, c: 1 },
      "2": { d: 0, i: 0, s: 0, c: 0.75 },
      "3": { d: 0, i: 0, s: 0, c: 0.5 },
      "4": { d: 0, i: 0, s: 0, c: 0.25 },
      "5": { d: 0, i: 0, s: 0, c: 0 }
    }
  },
  {
    questionText: "I prefer to follow established procedures and guidelines.",
    discMapping: {
      "1": { d: 0, i: 0, s: 0, c: 1 },
      "2": { d: 0, i: 0, s: 0, c: 0.75 },
      "3": { d: 0, i: 0, s: 0, c: 0.5 },
      "4": { d: 0, i: 0, s: 0, c: 0.25 },
      "5": { d: 0, i: 0, s: 0, c: 0 }
    }
  },
  {
    questionText: "I take time to analyze information thoroughly before making decisions.",
    discMapping: {
      "1": { d: 0, i: 0, s: 0, c: 1 },
      "2": { d: 0, i: 0, s: 0, c: 0.75 },
      "3": { d: 0, i: 0, s: 0, c: 0.5 },
      "4": { d: 0, i: 0, s: 0, c: 0.25 },
      "5": { d: 0, i: 0, s: 0, c: 0 }
    }
  },

  // Adaptive Behavior Questions
  {
    questionText: "I adjust my communication style based on the audience I am addressing.",
    discMapping: {
      "1": { d: 0.25, i: 0.25, s: 0.25, c: 0.25 },
      "2": { d: 0.2, i: 0.2, s: 0.2, c: 0.2 },
      "3": { d: 0.15, i: 0.15, s: 0.15, c: 0.15 },
      "4": { d: 0.1, i: 0.1, s: 0.1, c: 0.1 },
      "5": { d: 0.05, i: 0.05, s: 0.05, c: 0.05 }
    }
  },
  {
    questionText: "I can shift between tasks easily when priorities change.",
    discMapping: {
      "1": { d: 0.25, i: 0.25, s: 0.25, c: 0.25 },
      "2": { d: 0.2, i: 0.2, s: 0.2, c: 0.2 },
      "3": { d: 0.15, i: 0.15, s: 0.15, c: 0.15 },
      "4": { d: 0.1, i: 0.1, s: 0.1, c: 0.1 },
      "5": { d: 0.05, i: 0.05, s: 0.05, c: 0.05 }
    }
  },
  {
    questionText: "I seek feedback to improve my performance and adapt accordingly.",
    discMapping: {
      "1": { d: 0.25, i: 0.25, s: 0.25, c: 0.25 },
      "2": { d: 0.2, i: 0.2, s: 0.2, c: 0.2 },
      "3": { d: 0.15, i: 0.15, s: 0.15, c: 0.15 },
      "4": { d: 0.1, i: 0.1, s: 0.1, c: 0.1 },
      "5": { d: 0.05, i: 0.05, s: 0.05, c: 0.05 }
    }
  }
]

async function main() {
  try {
    // Delete all existing questions
    await prisma.question.deleteMany()
    console.log('Deleted all existing questions')

    // Create new questions
    for (const question of newQuestions) {
      await prisma.question.create({
        data: {
          id: uuidv4(),
          questionText: question.questionText,
          type: 'AGREEMENT_SCALE',
          discMapping: JSON.stringify(question.discMapping),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }
    console.log(`Created ${newQuestions.length} new questions`)

  } catch (error) {
    console.error('Error updating questions:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 