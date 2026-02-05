import { getServerSession } from "next-auth/next"
import { UserRole } from "../../../../types/user"
import { authOptions } from "../../../../lib/auth"
import { HRSidebar } from "../../../../components/layout/hr-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Alert, AlertDescription } from "../../../../components/ui/alert"
import { Settings, Bell, Shield, Users, LogOut } from "lucide-react"

export default async function HRSettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== UserRole.HR) {
    return <div className="p-8 text-center text-red-500">Not authorized</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Sidebar */}
      <HRSidebar organizationName={session.user.name || "Organization"} />

      {/* Main Content */}
      <main className="md:ml-64 pt-20 md:pt-0">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Settings
            </h1>
            <p className="text-gray-600">Manage your HR account and preferences</p>
          </div>

          {/* Profile Settings */}
          <div className="grid gap-6 mb-8">
            {/* Account Information */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <CardTitle>Account Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-lg text-gray-900 font-semibold">{session.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-lg text-gray-900 font-semibold">{session.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Role</p>
                    <Badge className="mt-2 bg-blue-100 text-blue-700">{session.user.role}</Badge>
                  </div>
                  <Button variant="outline" className="mt-4">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-600" />
                  <CardTitle>Notifications</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Event Registrations</p>
                      <p className="text-sm text-gray-600">Receive notifications when employees register for events</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div>
                      <p className="font-medium text-gray-900">Team Updates</p>
                      <p className="text-sm text-gray-600">Get notified about team group changes</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div>
                      <p className="font-medium text-gray-900">Training Assignments</p>
                      <p className="text-sm text-gray-600">Notifications about training program updates</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <CardTitle>Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Change Password</p>
                    <p className="text-sm text-gray-600 mb-4">Update your account password regularly for security</p>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="font-medium text-gray-900 mb-2">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600 mb-4">Add extra security to your account</p>
                    <Badge variant="outline" className="text-yellow-700 bg-yellow-50">
                      Not Enabled
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Management */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  <CardTitle>Team Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Manage team grouping, events, and employee assignments
                  </p>
                  <Button variant="outline">Go to Team Groups</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Danger Zone */}
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-gray-900 mb-2">Sign Out</p>
                <p className="text-sm text-gray-600 mb-4">Sign out from your account on this device</p>
                <Button variant="destructive" className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
