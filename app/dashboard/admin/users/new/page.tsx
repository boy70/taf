"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import type { UserRole } from "../../../../../types/user"
import { DashboardLayout } from "../../../../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../../../../../components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"

export default function NewUserPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("EMPLOYEE")
  const [startupId, setStartupId] = useState("")
  const [startups, setStartups] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingStartups, setIsLoadingStartups] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tempPassword, setTempPassword] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    if (status === "authenticated" && session.user.role === "SUPERADMIN") {
      fetchStartups()
    }
  }, [status, router, session])

  const fetchStartups = async () => {
    try {
      const response = await fetch("/api/startups")
      if (!response.ok) {
        throw new Error("Failed to fetch startups")
      }
      const data = await response.json()
      setStartups(data)
      setIsLoadingStartups(false)
    } catch (error) {
      setError("Failed to load startups. Please try again.")
      setIsLoadingStartups(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setTempPassword(null)

    try {
      const userData = {
        name,
        email,
        password,
        role,
        startupId: role === "EMPLOYEE" || role === "HR" ? startupId : null,
      }

      const response = await fetch("/api/users/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create user")
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setTempPassword(data.tempPassword)
      setName("")
      setEmail("")
      setPassword("")
      setRole("EMPLOYEE")
      setStartupId("")
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "unauthenticated") {
    return null
  }

  if (status === "authenticated" && session.user.role !== "SUPERADMIN") {
    router.push("/dashboard")
    return null
  }

  return (
    <DashboardLayout role={(session?.user.role || "SUPERADMIN") as UserRole}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Add New User</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin/users">Back to Users</Link>
          </Button>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Create a New User</CardTitle>
            <CardDescription>Add a new user to the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>User Created</AlertTitle>
                <AlertDescription>
                  {tempPassword && (
                    <div className="mt-2">
                      <p>
                        Temporary password: <strong>{tempPassword}</strong>
                      </p>
                      <p className="text-xs mt-1">In a real application, this would be sent via email.</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                    <SelectItem value="HR">HR Manager</SelectItem>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(role === "HR" || role === "EMPLOYEE") && (
                <div className="space-y-2">
                  <Label htmlFor="startup">Startup</Label>
                  <Select value={startupId} onValueChange={setStartupId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a startup" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingStartups ? (
                        <SelectItem value="" disabled>
                          Loading startups...
                        </SelectItem>
                      ) : startups.length === 0 ? (
                        <SelectItem value="" disabled>
                          No startups available
                        </SelectItem>
                      ) : (
                        startups.map((startup) => (
                          <SelectItem key={startup.id} value={startup.id}>
                            {startup.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
