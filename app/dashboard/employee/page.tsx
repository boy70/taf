import { getServerSession } from "next-auth/next"
import Link from "next/link"

import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/db"
import { DashboardLayout } from "../../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { UserRole } from "../../../lib/auth"

export default async function EmployeeDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== UserRole.EMPLOYEE) {
    return <div>Unauthorized</div>
  }

  // Check if user has completed the test
  const result = await prisma.result.findFirst({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Get startup info if available
  let startup = null
  if (session.user.startupId) {
    startup = await prisma.startup.findUnique({
      where: {
        id: session.user.startupId,
      },
    })
  }

  return (
    <DashboardLayout role={session.user.role}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Employee Dashboard</h1>
            {startup && <p className="text-muted-foreground">{startup.name ?? ""}</p>}
          </div>
        </div>

        {!result ? (
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Tafsula!</CardTitle>
              <CardDescription>
                Take the DISC personality test to discover your work style and strengths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The DISC assessment will help you understand your personality type and how you work best with others. It
                only takes about 5-10 minutes to complete.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/test">Take the DISC Test</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your DISC Profile</CardTitle>
                <CardDescription>
                  Your personality type is <strong>{result.dominantType}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex flex-col items-center">
                      <div className="text-xl font-bold text-red-500">D</div>
                      <div className="text-lg">{Math.round(result.dScore)}%</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xl font-bold text-yellow-500">I</div>
                      <div className="text-lg">{Math.round(result.iScore)}%</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xl font-bold text-green-500">S</div>
                      <div className="text-lg">{Math.round(result.sScore)}%</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-xl font-bold text-blue-500">C</div>
                      <div className="text-lg">{Math.round(result.cScore)}%</div>
                    </div>
                  </div>
                  <Link href="/dashboard/employee/results" className="text-primary underline">
                    View detailed results
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Retake the Test</CardTitle>
                <CardDescription>Want to update your DISC profile?</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  You can retake the DISC test at any time to update your profile. Your previous results will be saved
                  for reference.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/test">Retake the Test</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
