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
import { Badge } from "../../../../components/ui/badge"
import { Search, Users, CheckCircle, Clock, Mail, Eye, Bell } from "lucide-react"
import type { EmployeeData } from "../../../../lib/types"

export default function EmployeesPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [employees, setEmployees] = useState<EmployeeData[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "completed" | "pending">("all")
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
    let filtered = employees

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (employee) => employee.name.toLowerCase().includes(query) || employee.email.toLowerCase().includes(query),
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter((employee) =>
        filterType === "completed" ? employee.testCompleted : !employee.testCompleted,
      )
    }

    setFilteredEmployees(filtered)
  }, [searchQuery, employees, filterType])

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`/api/users?startupId=${session?.user.startupId}&role=EMPLOYEE`)
      if (!response.ok) {
        throw new Error("Failed to fetch employees")
      }
      const data = await response.json()

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

  const getTypeDescription = (type: string | null) => {
    switch (type) {
      case "D":
        return "Dominant"
      case "I":
        return "Influencer"
      case "S":
        return "Steadiness"
      case "C":
        return "Conscientious"
      default:
        return "Not Available"
    }
  }

  const stats = {
    total: employees.length,
    completed: employees.filter((e) => e.testCompleted).length,
    pending: employees.filter((e) => !e.testCompleted).length,
  }

  if (isLoading) {
    return (
      <DashboardLayout role={(session?.user.role || "HR") as UserRole}>
        <div className="flex justify-center items-center py-24">
          <div className="space-y-4 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="text-gray-600">Loading your team...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout role={(session?.user.role || "HR") as UserRole}>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Error</CardTitle>
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role={(session?.user.role || "HR") as UserRole}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Team Members
            </h1>
            <p className="text-gray-600 mt-1">Manage and track your team's DISC assessments</p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg">
            <Link href="/dashboard/hr/employees/invite">
              <Mail className="w-4 h-4" />
              Invite Employee
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-3xl font-bold text-blue-700 mt-2">{stats.total}</p>
                </div>
                <Users className="w-10 h-10 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">{stats.completed}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-amber-700 mt-2">{stats.pending}</p>
                </div>
                <Clock className="w-10 h-10 text-amber-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {(["all", "completed", "pending"] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={filterType === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(filter)}
                  className={
                    filterType === filter ? "bg-blue-600 hover:bg-blue-700" : "border-gray-300 hover:bg-gray-50"
                  }
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)} ({
                    filter === "all"
                      ? stats.total
                      : filter === "completed"
                        ? stats.completed
                        : stats.pending
                  })
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employees Grid */}
        {filteredEmployees.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="py-12">
              <div className="text-center space-y-3">
                <Users className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-gray-600 font-medium">No employees found</p>
                <p className="text-gray-400 text-sm">
                  {searchQuery ? "Try adjusting your search" : "Start by inviting your first employee"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEmployees.map((employee) => (
              <Card
                key={employee.id}
                className="group hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <CardContent className="pt-6 pb-4">
                  {/* Header with Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {employee.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">{employee.email}</p>
                    </div>
                    <Badge
                      className={`ml-2 ${
                        employee.testCompleted
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-amber-100 text-amber-800 border-amber-200"
                      }`}
                      variant="outline"
                    >
                      {employee.testCompleted ? "Done" : "Pending"}
                    </Badge>
                  </div>

                  {/* DISC Type */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    {employee.dominantType ? (
                      <div className="flex items-center gap-2">
                        <Badge className={`${getTypeColor(employee.dominantType)} text-white text-xs`}>
                          Type {employee.dominantType}
                        </Badge>
                        <span className="text-xs text-gray-600">{getTypeDescription(employee.dominantType)}</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-600">
                        Assessment pending
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {employee.testCompleted ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-blue-600 hover:bg-blue-50 border-blue-200 gap-2"
                        onClick={() => router.push(`/dashboard/hr/employees/${employee.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                        View Results
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-amber-600 hover:bg-amber-50 border-amber-200 gap-2"
                        onClick={() => {
                          alert(`Reminder sent to ${employee.email}`)
                        }}
                      >
                        <Bell className="w-4 h-4" />
                        Send Reminder
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
