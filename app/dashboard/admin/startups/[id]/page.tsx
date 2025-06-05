"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import Link from "next/link"
import type { UserRole } from "../../../../../types/user"

import { DashboardLayout } from "../../../../../components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"

interface Startup {
  id: string
  name: string
  // Add other fields as needed
}

export default function StartupDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const startupId = params?.id

  const [startup, setStartup] = React.useState<Startup | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!startupId) return

    async function fetchStartup() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/startups/${startupId}`)
        if (!res.ok) {
          throw new Error("Failed to fetch startup")
        }
        const data = await res.json()
        setStartup(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Unknown error")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStartup()
  }, [startupId])

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
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Startup Details</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin/startups">Back to Startups</Link>
          </Button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {startup && (
          <Card>
            <CardHeader>
              <CardTitle>{startup.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>ID: {startup.id}</p>
              {/* Add more startup details here as needed */}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
