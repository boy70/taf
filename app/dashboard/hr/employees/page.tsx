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
import { Badge } from "../../../../components/ui/badge"
import type { EmployeeData } from "../../../../lib/types"

export default function EmployeesPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [employees, setEmployees] = useState<EmployeeData[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    if (status === "authenticated" && session.user.role === "HR" && session.user.startupId) {
      fetchEmployees()
    }
  }, [status, router, session])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredEmployees(
        employees.filter(
          (employee) => employee.name.toLowerCase().includes(query) || employee.email.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, employees])

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`/api/users?startupId=${session?.user.startupId}&role=EMPLOYEE`)
      if (!response.ok) {
        throw new Error("Failed to fetch employees")
      }
      const data = await response.json()

      // Format employee data
      const formattedEmployees = data.map((employee: any) => ({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        dominantType: employee.results[0]?.dominantType || null,
        testCompleted: employee.results.length > 0,
      }))

      setEmployees(formattedEmployees)
      setFilteredEmployees(formattedEmployees)
      setIsLoading(false)
    } catch (error) {
      setError("Failed to load employees. Please try again.")
      setIsLoading(false)
    }
  }

  const getTypeColor = (type: string | null) => {
    if (!type) return "bg-gray-500"

    switch (type) {
      case "D":
        return "bg-red-500 hover:bg-red-600"
      case "I":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "S":
        return "bg-green-500 hover:bg-green-600"
      case "C":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout role={(session?.user.role || "HR") as UserRole}>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout role={(session?.user.role || "HR") as UserRole}>
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
    <DashboardLayout role={(session?.user.role || "HR") as UserRole}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Employees</h1>
          <Button asChild>
            <Link href="/dashboard/hr/employees/invite">Invite Employee</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
            <CardDescription>Manage and view DISC profiles of your team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {filteredEmployees.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No employees found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>DISC Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                        {employee.dominantType ? (
                          <Badge className={getTypeColor(employee.dominantType)}>Type {employee.dominantType}</Badge>
                        ) : (
                          <Badge variant="outline">Not Available</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {employee.testCompleted ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {employee.testCompleted ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/hr/employees/${employee.id}`)}
                          >
                            View Results
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // In a real app, this would send a reminder email
                              alert(`Reminder sent to ${employee.email}`)
                            }}
                          >
                            Send Reminder
                          </Button>
                        )}
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
