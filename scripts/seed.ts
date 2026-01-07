const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create admin user
  const adminPassword = await hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@tafsula.com" },
    update: {},
    create: {
      id: uuidv4(),
      name: "Admin User",
      email: "admin@tafsula.com",
  // Balanced DISC questions: 5 for each type
  const questions = [
    // D
    {
      questionText: "I enjoy taking charge of situations, even if it means making tough decisions.",
      discMapping: { "1": { d: 1 }, "2": { d: 0.75 }, "3": { d: 0.5 }, "4": { d: 0.25 }, "5": { d: 0 } },
    },
    {
      questionText: "When faced with obstacles, I focus on solutions rather than emotions.",
      discMapping: { "1": { d: 1 }, "2": { d: 0.75 }, "3": { d: 0.5 }, "4": { d: 0.25 }, "5": { d: 0 } },
    },
    {
      questionText: "I often push for results, even if it means stepping on some toes.",
      discMapping: { "1": { d: 1 }, "2": { d: 0.75 }, "3": { d: 0.5 }, "4": { d: 0.25 }, "5": { d: 0 } },
    },
    {
      questionText: "I’m comfortable in competitive or high-pressure environments.",
      discMapping: { "1": { d: 1 }, "2": { d: 0.75 }, "3": { d: 0.5 }, "4": { d: 0.25 }, "5": { d: 0 } },
    },
    {
      questionText: "I like to take initiative and make decisions quickly.",
      discMapping: { "1": { d: 1 }, "2": { d: 0.75 }, "3": { d: 0.5 }, "4": { d: 0.25 }, "5": { d: 0 } },
    },
    // I
    {
      questionText: "I enjoy being the center of attention in group settings.",
      discMapping: { "1": { i: 1 }, "2": { i: 0.75 }, "3": { i: 0.5 }, "4": { i: 0.25 }, "5": { i: 0 } },
    },
    {
      questionText: "I often inspire others with my enthusiasm and ideas.",
      discMapping: { "1": { i: 1 }, "2": { i: 0.75 }, "3": { i: 0.5 }, "4": { i: 0.25 }, "5": { i: 0 } },
    },
    {
      questionText: "I like to build relationships and connect with new people.",
      discMapping: { "1": { i: 1 }, "2": { i: 0.75 }, "3": { i: 0.5 }, "4": { i: 0.25 }, "5": { i: 0 } },
    },
    {
      questionText: "I am enthusiastic and optimistic in most situations.",
      discMapping: { "1": { i: 1 }, "2": { i: 0.75 }, "3": { i: 0.5 }, "4": { i: 0.25 }, "5": { i: 0 } },
    },
    {
      questionText: "I enjoy motivating others to achieve their goals.",
      discMapping: { "1": { i: 1 }, "2": { i: 0.75 }, "3": { i: 0.5 }, "4": { i: 0.25 }, "5": { i: 0 } },
    },
    // S
    {
      questionText: "I value harmony and try to avoid conflict.",
      discMapping: { "1": { s: 1 }, "2": { s: 0.75 }, "3": { s: 0.5 }, "4": { s: 0.25 }, "5": { s: 0 } },
    },
    {
      questionText: "I am patient and a good listener.",
      discMapping: { "1": { s: 1 }, "2": { s: 0.75 }, "3": { s: 0.5 }, "4": { s: 0.25 }, "5": { s: 0 } },
    },
    {
      questionText: "I am loyal and dependable in relationships.",
      discMapping: { "1": { s: 1 }, "2": { s: 0.75 }, "3": { s: 0.5 }, "4": { s: 0.25 }, "5": { s: 0 } },
    },
    {
      questionText: "I prefer stability and routine over change.",
      discMapping: { "1": { s: 1 }, "2": { s: 0.75 }, "3": { s: 0.5 }, "4": { s: 0.25 }, "5": { s: 0 } },
    },
    {
      questionText: "I am supportive and helpful to others.",
      discMapping: { "1": { s: 1 }, "2": { s: 0.75 }, "3": { s: 0.5 }, "4": { s: 0.25 }, "5": { s: 0 } },
    },
    // C
    {
      questionText: "I pay attention to details and strive for accuracy.",
      discMapping: { "1": { c: 1 }, "2": { c: 0.75 }, "3": { c: 0.5 }, "4": { c: 0.25 }, "5": { c: 0 } },
    },
    {
      questionText: "I like to analyze problems before making decisions.",
      discMapping: { "1": { c: 1 }, "2": { c: 0.75 }, "3": { c: 0.5 }, "4": { c: 0.25 }, "5": { c: 0 } },
    },
    {
      questionText: "I follow rules and procedures closely.",
      discMapping: { "1": { c: 1 }, "2": { c: 0.75 }, "3": { c: 0.5 }, "4": { c: 0.25 }, "5": { c: 0 } },
    },
    {
      questionText: "I am cautious and think before acting.",
      discMapping: { "1": { c: 1 }, "2": { c: 0.75 }, "3": { c: 0.5 }, "4": { c: 0.25 }, "5": { c: 0 } },
    },
    {
      questionText: "I strive for high standards in my work.",
      discMapping: { "1": { c: 1 }, "2": { c: 0.75 }, "3": { c: 0.5 }, "4": { c: 0.25 }, "5": { c: 0 } },
    },
  ]
    where: { email: "jane@samplestartup.com" },
    update: {},
    create: {
      id: uuidv4(),
      name: "Jane Smith",
      email: "jane@samplestartup.com",
      password: employeePassword,
      role: "EMPLOYEE",
      startupId: startup.id,
      invitedById: hr.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`Created employee users: ${employee1.email}, ${employee2.email}`);

  // Create DISC questions based on user's provided statements
  const questions = [
    {
      questionText: "I enjoy taking charge of situations, even if it means making tough decisions.",
      discMapping: {
        "1": { d: 1, i: 0, s: 0, c: 0 },
        "2": { d: 0.75, i: 0, s: 0, c: 0 },
        "3": { d: 0.5, i: 0, s: 0, c: 0 },
        "4": { d: 0.25, i: 0, s: 0, c: 0 },
        "5": { d: 0, i: 0, s: 0, c: 0 },
      },
    },
    {
      questionText: "When faced with obstacles, I focus on solutions rather than emotions.",
      discMapping: {
        "1": { d: 1, i: 0, s: 0, c: 0 },
        "2": { d: 0.75, i: 0, s: 0, c: 0 },
        "3": { d: 0.5, i: 0, s: 0, c: 0 },
        "4": { d: 0.25, i: 0, s: 0, c: 0 },
        "5": { d: 0, i: 0, s: 0, c: 0 },
      },
    },
    {
      questionText: "I often push for results, even if it means stepping on some toes.",
      discMapping: {
        "1": { d: 1, i: 0, s: 0, c: 0 },
        "2": { d: 0.75, i: 0, s: 0, c: 0 },
        "3": { d: 0.5, i: 0, s: 0, c: 0 },
        "4": { d: 0.25, i: 0, s: 0, c: 0 },
        "5": { d: 0, i: 0, s: 0, c: 0 },
      },
    },
    {
      questionText: "I’m comfortable in competitive or high-pressure environments.",
      discMapping: {
        "1": { d: 1, i: 0, s: 0, c: 0 },
        "2": { d: 0.75, i: 0, s: 0, c: 0 },
        "3": { d: 0.5, i: 0, s: 0, c: 0 },
        "4": { d: 0.25, i: 0, s: 0, c: 0 },
        "5": { d: 0, i: 0, s: 0, c: 0 },
      },
    },
    {
      questionText: "I enjoy being the center of attention in group settings.",
      discMapping: {
        "1": { d: 0, i: 1, s: 0, c: 0 },
        "2": { d: 0, i: 0.75, s: 0, c: 0 },
        "3": { d: 0, i: 0.5, s: 0, c: 0 },
        "4": { d: 0, i: 0.25, s: 0, c: 0 },
        "5": { d: 0, i: 0, s: 0, c: 0 },
      },
    },
    {
      questionText: "I often inspire others with my enthusiasm and ideas.",
      discMapping: {
        "1": { d: 0, i: 1, s: 0, c: 0 },
        "2": { d: 0, i: 0.75, s: 0, c: 0 },
        "3": { d: 0, i: 0.5, s: 0, c: 0 },
        "4": { d: 0, i: 0.25, s: 0, c: 0 },
        "5": { d: 0, i: 0, s: 0, c: 0 },
      },
    },
    {
      questionText: "I prefer spontaneous conversations over structured planning.",
      discMapping: {
        "1": { d: 0, i: 1, s: 0, c: 0 },
        "2": { d: 0, i: 0.75, s: 0, c: 0 },
        "3": { d: 0, i: 0.5, s: 0, c: 0 },
        "4": { d: 0, i: 0.25, s: 0, c: 0 },
        "5": { d: 0, i: 0, s: 0, c: 0 },
      },
    },
    {
      questionText: "I value relationships more than rules or processes.",
      discMapping: {
        "1": { d: 0, i: 1, s: 0, c: 0 },
        "2": { d: 0, i: 0.75, s: 0, c: 0 },
        "3": { d: 0, i: 0.5, s: 0, c: 0 },
        "4": { d: 0, i: 0.25, s: 0, c: 0 },
        "5": { d: 0, i: 0, s: 0, c: 0 },
      },
    },
    {
      questionText: "I stay calm and consistent, even in stressful situations.",
      discMapping: {
        "1": { d: 0, i: 0, s: 1, c: 0 },
        "2": { d: 0, i: 0, s: 0.75, c: 0 },
        "3": { d: 0, i: 0, s: 0.5, c: 0 },
        "4": { d: 0, i: 0, s: 0.25, c: 0 },
        "5": { d: 0, i: 0, s: 0, c: 0 },
      },
    },
    {
      questionText: "People often describe me as a good listener and a loyal friend.",
      discMapping: {
        "1": { d: 0, i: 0, s: 1, c: 0 },
        "2": { d: 0, i: 0, s: 0.75, c: 0 },
        "3": { d: 0, i: 0, s: 0.5, c: 0 },
        "4": { d: 0, i: 0, s: 0.25, c: 0 },
        "5": { d: 0, i: 0, s: 0, c: 0 },
      },
    },
    {
      questionText: "I prefer steady routines over frequent changes or surprises.",
      discMapping: {
        "1": { d: 0, i: 0, s: 1, c: 0 },
        "2": { d: 0, i: 0, s: 0.75, c: 0 },
        "3": { d: 0, i: 0, s: 0.5, c: 0 },
        "4": { d: 0, i: 0, s: 0.25, c: 0 },
        "5": { d: 0, i: 0, s: 0, c: 0 },
      },
    },
    {
      questionText: "I try to maintain harmony, even if I have to compromise.",
      discMapping: {
        "1": { d: 0, i: 0, s: 1, c: 0 },
        "2": { d: 0, i: 0, s: 0.75, c: 0 },
        "3": { d: 0, i: 0, s: 0.5, c: 0 },
        "4": { d: 0, i: 0, s: 0.25, c: 0 },
        "5": { d: 0, i: 0, s: 0, c: 0 },
      },
    },
    {
      questionText: "I double-check details to ensure my work is accurate and complete.",
      discMapping: {
        "1": { d: 0, i: 0, s: 0, c: 1 },
        "2": { d: 0, i: 0, s: 0, c: 0.75 },
        "3": { d: 0, i: 0, s: 0, c: 0.5 },
        "4": { d: 0, i: 0, s: 0, c: 0.25 },
        "5": { d: 0, i: 0, s: 0, c: 0 },
      },
    },
    {
      questionText: "I prefer planning and preparation over improvisation.",
      discMapping: {
        "1": { d: 0, i: 0, s: 0, c: 1 },
        "2": { d: 0, i: 0, s: 0, c: 0.75 },
        "3": { d: 0, i: 0, s: 0, c: 0.5 },
        "4": { d: 0, i: 0, s: 0, c: 0.25 },
        "5": { d: 0, i: 0, s: 0, c: 0 },
      },
    },
    {
      questionText: "I follow rules and procedures carefully, even if others don’t.",
      discMapping: {
        "1": { d: 0, i: 0, s: 0, c: 1 },
        "2": { d: 0, i: 0, s: 0, c: 0.75 },
        "3": { d: 0, i: 0, s: 0, c: 0.5 },
        "4": { d: 0, i: 0, s: 0, c: 0.25 },
        "5": { d: 0, i: 0, s: 0, c: 0 },
      },
    },
  ];

  for (const question of questions) {
    await prisma.question.create({
      data: {
        id: uuidv4(),
        questionText: question.questionText,
        discMapping: JSON.stringify(question.discMapping),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  console.log(`Created ${questions.length} DISC questions`);

  // Create sample results for employees
  const johnResult = await prisma.result.create({
    data: {
      userId: employee1.id,
      dScore: 75,
      iScore: 45,
      sScore: 30,
      cScore: 50,
      dominantType: "D",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const johnInsight = await prisma.insight.create({
    data: {
      userId: employee1.id,
      text: `As a dominant "D" personality type, John is direct, decisive, and results-oriented. He thrives in challenging environments and is motivated by achievement and control.

Work Style:
- John is a natural leader who takes charge and makes quick decisions
- He focuses on the big picture and delegates details to others
- He's competitive and driven to succeed
- He values efficiency and getting results

Communication Style:
- John is direct and to the point
- He may come across as blunt or impatient
- He prefers brief, focused conversations
- He's not afraid to address conflicts head-on

Strengths:
- Decision-making and problem-solving
- Taking initiative and driving change
- Overcoming obstacles
- Setting and achieving ambitious goals

Growth Areas:
- Practice active listening and patience
- Consider how decisions impact others
- Develop empathy and emotional intelligence
- Recognize the value of collaboration and teamwork

To be most effective, John should focus on balancing his natural drive with consideration for others. The team values his ability to make tough decisions and move projects forward.`,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const janeResult = await prisma.result.create({
    data: {
      userId: employee2.id,
      dScore: 25,
      iScore: 80,
      sScore: 40,
      cScore: 35,
      dominantType: "I",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const janeInsight = await prisma.insight.create({
    data: {
      userId: employee2.id,
      text: `As an influential "I" personality type, Jane is outgoing, enthusiastic, and people-oriented. She thrives in social environments and is motivated by recognition and relationships.

Work Style:
- Jane is energetic and optimistic
- She enjoys collaboration and teamwork
- She's creative and thinks outside the box
- She inspires and motivates others

Communication Style:
- Jane is expressive and animated
- She enjoys storytelling and sharing experiences
- She builds rapport easily
- She prefers face-to-face interactions

Strengths:
- Building relationships and networking
- Persuading and influencing others
- Creating enthusiasm for projects
- Thinking creatively

Growth Areas:
- Follow through on commitments
- Pay attention to details
- Manage time effectively
- Balance socializing with task completion

To be most effective, Jane should harness her natural charisma while developing more structure and follow-through. The team values her ability to create positive energy and build connections.`,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`Created sample results and insights for employees`);

  console.log("Seed completed successfully!");
}

main()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
