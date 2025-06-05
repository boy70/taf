"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { UserRole } from "../../../../../types/user"

import { DashboardLayout } from "../../../../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../../../../../components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../../../../components/ui/select"

export default function InviteEmployeePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole>(UserRole.EMPLOYEE)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tempPassword, setTempPassword] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setTempPassword(null)

    if (!session?.user.startupId) {
      setError("You are not associated with a startup")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/users/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          role,
          startupId: session.user.startupId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to invite employee")
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setTempPassword(data.tempPassword)
      setName("")
      setEmail("")
      setRole(UserRole.EMPLOYEE)
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "unauthenticated") {
    router.push("/auth/login")
    return null
  }

  if (status === "authenticated" && session.user.role !== "HR") {
    router.push("/dashboard")
    return null
  }

  return (
    <DashboardLayout role={(session?.user.role || "HR") as UserRole}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Invite Employee</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/hr/employees">Back to Employees</Link>
          </Button>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Invite a New Employee</CardTitle>
            <CardDescription>Send an invitation to join your team and take the DISC test</CardDescription>
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
                <AlertTitle>Invitation Sent</AlertTitle>
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
                <Select onValueChange={(value) => setRole(value as UserRole)} value={role}>
                  <SelectTrigger id="role" aria-label="Role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Roles</SelectLabel>
                      <SelectItem value={UserRole.EMPLOYEE}>Employee</SelectItem>
                      <SelectItem value={UserRole.HR}>HR Manager</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
              {isLoading ? "Sending Invitation..." : "Send Invitation"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
