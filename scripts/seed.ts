const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create admin user first (without startup)
  const adminPassword = await bcryptjs.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@tafsula.com" },
    update: {},
    create: {
      id: uuidv4(),
      name: "Admin User",
      email: "admin@tafsula.com",
      password: adminPassword,
      role: "SUPERADMIN",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create startup with admin as creator
  const startup = await prisma.startup.upsert({
    where: { id: "sample-startup-001" },
    update: {},
    create: {
      id: "sample-startup-001",
      name: "Sample Startup",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: admin.id,
    },
  });

  // Create HR user
  const hrPassword = await bcryptjs.hash("hr123", 10);
  const hr = await prisma.user.upsert({
    where: { email: "hr@samplestartup.com" },
    update: {},
    create: {
      id: uuidv4(),
      name: "HR Manager",
      email: "hr@samplestartup.com",
      password: hrPassword,
      role: "HR",
      startupId: startup.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create employee user
  const employeePassword = await bcryptjs.hash("employee123", 10);
  const employee1 = await prisma.user.upsert({
    where: { email: "john@samplestartup.com" },
    update: {},
    create: {
      id: uuidv4(),
      name: "John Doe",
      email: "john@samplestartup.com",
      password: employeePassword,
      role: "EMPLOYEE",
      startupId: startup.id,
      invitedById: hr.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create another employee user
  const employee2Password = await bcryptjs.hash("employee123", 10);
  const employee2 = await prisma.user.upsert({
    where: { email: "jane@samplestartup.com" },
    update: {},
    create: {
      id: uuidv4(),
      name: "Jane Smith",
      email: "jane@samplestartup.com",
      password: employee2Password,
      role: "EMPLOYEE",
      startupId: startup.id,
      invitedById: hr.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`Created users: admin, hr, employees`);

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
