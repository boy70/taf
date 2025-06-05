import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { UserRole } from "../../../types/user"
import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/db"
import { DashboardLayout } from "../../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "SUPERADMIN") {
    return <div>Unauthorized</div>
  }

  // Get counts for dashboard
  const startupCount = await prisma.startup.count()
  const userCounts = await prisma.user.groupBy({
    by: ["role"],
    _count: {
      id: true,
    },
  })

  const hrCount = userCounts.find((count: any) => count.role === "HR")?._count.id || 0
  const employeeCount = userCounts.find((count: any) => count.role === "EMPLOYEE")?._count.id || 0
  const testCount = await prisma.result.count()

  return (
    <DashboardLayout role={(session.user.role || "SUPERADMIN") as UserRole}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/dashboard/admin/startups/new">Add Startup</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/admin/users/new">Add User</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Startups</CardTitle>
              <CardDescription>Platform-wide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{startupCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">HR Managers</CardTitle>
              <CardDescription>Platform-wide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Employees</CardTitle>
              <CardDescription>Platform-wide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeeCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
              <CardDescription>Platform-wide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testCount}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Startups</CardTitle>
              <CardDescription>Recently added startups to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href="/dashboard/admin/startups" className="text-primary underline">
                  View all startups
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Recently added users to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href="/dashboard/admin/users" className="text-primary underline">
                  View all users
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
