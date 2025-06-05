"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"

import { DashboardLayout } from "../../../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { Badge } from "../../../../components/ui/badge"
import { UserRole } from "../../../../types/user"
export default function UsersPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    if (status === "authenticated" && session.user.role === "SUPERADMIN") {
      fetchUsers()
    }
  }, [status, router, session])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            (user.startup?.name && user.startup.name.toLowerCase().includes(query)),
        ),
      )
    }
  }, [searchQuery, users])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data)
      setFilteredUsers(data)
      setIsLoading(false)
    } catch (error) {
      setError("Failed to load users. Please try again.")
      setIsLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-purple-500 hover:bg-purple-600"
      case "HR":
        return "bg-blue-500 hover:bg-blue-600"
      case "EMPLOYEE":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500"
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
          <h1 className="text-3xl font-bold">Users</h1>
          <Button asChild>
            <Link href="/dashboard/admin/users/new">Add User</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
            <CardDescription>Manage users on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Startup</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.startup?.name || "—"}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/admin/users/${user.id}`)}
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
