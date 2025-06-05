import type React from "react"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { UserRole } from "../../../types/user"

import { authOptions } from "../../../.../../lib/auth"
import { DashboardLayout } from "../../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"

export default async function HRDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  if (session.user.role !== UserRole.HR) {
    return null
  }

  // Get startup info
  const startup = await prisma.startup.findUnique({
    where: {
      id: session.user.startupId,
    },
  })

  // Get employee counts
  const employeeCount = await prisma.user.count({
    where: {
      startupId: session.user.startupId,
      role: "EMPLOYEE",
    },
  })

  // Get test completion count
  const testCompletionCount = await prisma.user.count({
    where: {
      startupId: session.user.startupId,
      role: "EMPLOYEE",
      result: {
        some: {},
      },
    },
  })

  // Get DISC type distribution
  const discDistribution = await prisma.user.findMany({
    where: {
      startupId: session.user.startupId,
      role: "EMPLOYEE",
      result: {
        some: {},
      },
    },
    include: {
      result: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  })

  const dCount = discDistribution.filter((user: any) => user.results[0]?.dominantType === "D").length
  const iCount = discDistribution.filter((user: any) => user.results[0]?.dominantType === "I").length
  const sCount = discDistribution.filter((user: any) => user.results[0]?.dominantType === "S").length
  const cCount = discDistribution.filter((user: any) => user.results[0]?.dominantType === "C").length

  return (
    <DashboardLayout role={session.user.role as UserRole}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{startup?.name} Dashboard</h1>
            <p className="text-muted-foreground">HR Manager View</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/hr/employees/invite">Invite Employee</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <CardDescription>In your startup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeeCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
              <CardDescription>By your employees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testCompletionCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CardDescription>Test completion percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {employeeCount > 0 ? Math.round((testCompletionCount / employeeCount) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Team Balance</CardTitle>
              <CardDescription>DISC type distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {testCompletionCount > 0
                  ? Math.round(
                      (1 -
                        Math.abs(0.25 - dCount / testCompletionCount) -
                        Math.abs(0.25 - iCount / testCompletionCount) -
                        Math.abs(0.25 - sCount / testCompletionCount) -
                        Math.abs(0.25 - cCount / testCompletionCount)) *
                        100,
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>DISC Distribution</CardTitle>
              <CardDescription>Personality types in your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="text-xl font-bold text-red-500">D</div>
                    <div className="text-lg">{dCount}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xl font-bold text-yellow-500">I</div>
                    <div className="text-lg">{iCount}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xl font-bold text-green-500">S</div>
                    <div className="text-lg">{sCount}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xl font-bold text-blue-500">C</div>
                    <div className="text-lg">{cCount}</div>
                  </div>
                </div>
                <Link href="/dashboard/hr/compatibility" className="text-primary underline">
                  View detailed compatibility analysis
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Completions</CardTitle>
              <CardDescription>Employees who recently completed the DISC test</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href="/dashboard/hr/employees" className="text-primary underline">
                  View all employees
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
