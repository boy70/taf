"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { UserRole } from "../../../../types/user"
import { DashboardLayout } from "../../../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import type { StartupData } from "../../../../lib/types"

export default function StartupsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [startups, setStartups] = useState<StartupData[]>([])
  const [filteredStartups, setFilteredStartups] = useState<StartupData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    if (status === "authenticated" && session.user.role === "SUPERADMIN") {
      fetchStartups()
    }
  }, [status, router, session])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStartups(startups)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredStartups(startups.filter((startup) => startup.name.toLowerCase().includes(query)))
    }
  }, [searchQuery, startups])

  const fetchStartups = async () => {
    try {
      const response = await fetch("/api/startups")
      if (!response.ok) {
        throw new Error("Failed to fetch startups")
      }
      const data = await response.json()

      // Format startup data
      const formattedStartups = data.map((startup: any) => ({
        id: startup.id,
        name: startup.name,
        employeeCount: startup._count?.users || 0,
        hrCount: 0, // We'll calculate this separately
      }))

      // Get HR counts
      const usersResponse = await fetch("/api/users?role=HR")
      if (!usersResponse.ok) {
        throw new Error("Failed to fetch HR users")
      }
      const usersData = await usersResponse.json()

      // Count HR managers per startup
      const hrCounts: { [startupId: string]: number } = {}
      usersData.forEach((user: any) => {
        if (user.startupId) {
          hrCounts[user.startupId] = (hrCounts[user.startupId] || 0) + 1
        }
      })

      // Update HR counts in startups
      const startupsWithHrCounts = formattedStartups.map((startup: { id: string | number }) => ({
        ...startup,
        hrCount: hrCounts[startup.id] || 0,
      }))

      setStartups(startupsWithHrCounts)
      setFilteredStartups(startupsWithHrCounts)
      setIsLoading(false)
    } catch (error) {
      setError("Failed to load startups. Please try again.")
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout role={(session?.user.role || "SUPERADMIN") as UserRole}>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout role={(session?.user.role || "SUPERADMIN") as UserRole}>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role={(session?.user.role || "SUPERADMIN") as UserRole}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Startups</h1>
          <Button asChild>
            <Link href="/dashboard/admin/startups/new">Add Startup</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Startup List</CardTitle>
            <CardDescription>Manage startups on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Input
                placeholder="Search startups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {filteredStartups.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No startups found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>HR Managers</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStartups.map((startup) => (
                    <TableRow key={startup.id}>
                      <TableCell className="font-medium">{startup.name}</TableCell>
                      <TableCell>{startup.employeeCount}</TableCell>
                      <TableCell>{startup.hrCount}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/admin/startups/${startup.id}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
