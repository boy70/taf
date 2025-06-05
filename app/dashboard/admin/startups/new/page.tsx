"use client"

import type React from "react"

import { useState } from "react"
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

export default function NewStartupPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/startups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create startup")
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setName("")

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/admin/startups")
      }, 2000)
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

  if (status === "authenticated" && session.user.role !== "SUPERADMIN") {
    router.push("/dashboard")
    return null
  }

  return (
    <DashboardLayout role={(session?.user.role || "SUPERADMIN") as UserRole}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Add New Startup</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin/startups">Back to Startups</Link>
          </Button>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Create a New Startup</CardTitle>
            <CardDescription>Add a new startup to the platform</CardDescription>
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
                <AlertTitle>Startup Created</AlertTitle>
                <AlertDescription>The startup has been created successfully. Redirecting...</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Startup Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Startup"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
