import { prisma } from "../lib/db"

async function main() {
  try {
    const result = await prisma.user.deleteMany({
      where: {
        email: "hamedbendahmen@gmail.com",
      },
    })
    console.log("✅ Deleted:", result.count, "user(s)")
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
