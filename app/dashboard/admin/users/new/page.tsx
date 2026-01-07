
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { UserRole } from "../../../../../lib/auth"
import { DashboardLayout } from "../../../../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../../../../../components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { RadioGroup, RadioGroupItem } from "../../../../../components/ui/radio-group"

export default function NewUserPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [startups, setStartups] = useState<any[]>([])
  const [isLoadingStartups, setIsLoadingStartups] = useState(true)
  const [selectedStartupId, setSelectedStartupId] = useState<string>("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login")
    if (status === "authenticated" && session.user.role === "SUPERADMIN") {
      fetchUsers()
      fetchStartups()
    }
  }, [status, router, session])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      setUsers(data)
    } catch {
      setError("Failed to load users. Please try again.")
    }
  }

  const fetchStartups = async () => {
    try {
      const response = await fetch("/api/startups")
      if (!response.ok) throw new Error("Failed to fetch startups")
      const data = await response.json()
      setStartups(data)
    } catch {
      setError("Failed to load startups. Please try again.")
    } finally {
      setIsLoadingStartups(false)
    }
  }

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId)
    const user = users.find((u) => u.id === userId)
    setSelectedRole(user?.role)
    setSelectedStartupId(user?.startupId || "")
    setSuccess(false)
    setError(null)
  }

  const handleRoleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserId || !selectedRole) {
      setError("Please select a user and a role.")
      return
    }
    if ((selectedRole === "HR" || selectedRole === "EMPLOYEE") && !selectedStartupId) {
      setError("Please select a startup for this role.")
      return
    }
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    const payload = { role: selectedRole, startupId: (selectedRole === "HR" || selectedRole === "EMPLOYEE") ? selectedStartupId : null }
    console.log("Submitting payload to /api/users/" + selectedUserId + "/role:", payload)
    try {
      const response = await fetch(`/api/users/${selectedUserId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      let data = null
      try {
        data = await response.json()
      } catch (jsonErr) {
        console.error("Failed to parse JSON response", jsonErr)
      }
      if (!response.ok) {
        console.error("API error response:", data)
        setError((data && data.error) || response.statusText || "Failed to update role")
        setIsLoading(false)
        return
      }
      setSuccess(true)
      fetchUsers()
    } catch (err) {
      console.error("Network or unexpected error:", err)
      
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "unauthenticated") return null
  if (status === "authenticated" && session.user.role !== "SUPERADMIN") {
    router.push("/dashboard")
    return null
  }

  return (
    <DashboardLayout role={(session?.user.role || "SUPERADMIN") as UserRole}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin/users">Back to Users</Link>
          </Button>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Select a user to update their role</CardDescription>
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
                <AlertTitle>Role Updated</AlertTitle>
              </Alert>
            )}
            <div className="mb-6">
              <ul className="divide-y border rounded">
                {users.map((user) => (
                  <li key={user.id} className={`flex items-center px-4 py-2 cursor-pointer ${selectedUserId === user.id ? "bg-gray-100" : ""}`} onClick={() => handleUserSelect(user.id)}>
                    <span className="flex-1">{user.name} <span className="text-xs text-gray-500">({user.email})</span></span>
                    <span className="text-xs text-gray-600">{user.role}</span>
                  </li>
                ))}
              </ul>
            </div>
            {selectedUserId && (
              <form onSubmit={handleRoleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <RadioGroup value={selectedRole} onValueChange={setSelectedRole} className="flex gap-4">
                    <RadioGroupItem value="SUPERADMIN" id="role-superadmin" />
                    <Label htmlFor="role-superadmin" className="mr-4">Super Admin</Label>
                    <RadioGroupItem value="HR" id="role-hr" />
                    <Label htmlFor="role-hr" className="mr-4">HR Manager</Label>
                    <RadioGroupItem value="EMPLOYEE" id="role-employee" />
                    <Label htmlFor="role-employee">Employee</Label>
                  </RadioGroup>
                </div>
                {(selectedRole === "HR" || selectedRole === "EMPLOYEE") && (
                  <div className="space-y-2">
                    <Label htmlFor="startup">Startup</Label>
                    <div className="text-xs text-gray-500 mb-1">Selected Startup ID: {JSON.stringify(selectedStartupId)}</div>
                    {isLoadingStartups ? (
                      <Input disabled value="Loading startups..." />
                    ) : startups.length === 0 ? (
                      <Input disabled value="No startups available" />
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-2 py-1 border">Name</th>
                              <th className="px-2 py-1 border">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {startups.map((startup) => (
                              <tr key={startup.id} className={selectedStartupId === startup.id ? "bg-blue-100" : ""}>
                                <td className="px-2 py-1 border">{startup.name}</td>
                                <td className="px-2 py-1 border text-center">
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant={selectedStartupId === startup.id ? "default" : "outline"}
                                    onClick={() => setSelectedStartupId(startup.id)}
                                  >
                                    {selectedStartupId === startup.id ? "Selected" : "Select"}
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                <Button 
                  type="submit" 
                  disabled={isLoading || ((selectedRole === "HR" || selectedRole === "EMPLOYEE") && !selectedStartupId)} 
                  className="w-full"
                >
                  {isLoading ? "Updating..." : "Update Role"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
