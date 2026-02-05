import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { UserRole } from "../../../../types/user"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/db"
import { DashboardLayout } from "../../../../components/layout/dashboard-layout"
import { OrgProfileEdit } from "../../../../components/org-profile-edit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function OrgProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== UserRole.HR) {
    return <div className="p-8 text-center text-red-500">Not authorized</div>
  }

  if (!session.user.startupId) {
    return <div className="p-8 text-center text-red-500">No startup assigned</div>
  }

  const profile = await prisma.startupProfile.findUnique({
    where: { startupId: session.user.startupId },
  })

  const startup = await prisma.startup.findUnique({
    where: { id: session.user.startupId },
  })

  return (
    <DashboardLayout role={UserRole.HR}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/hr">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Organization Profile</h1>
            <p className="text-gray-600">Manage your organization's public profile</p>
          </div>
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base">Why Update Your Profile?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Appear in the public organizations directory</li>
              <li>✓ Showcase your events and training programs</li>
              <li>✓ Attract talented professionals to your events</li>
              <li>✓ Build your organization's professional brand</li>
            </ul>
          </CardContent>
        </Card>

        <OrgProfileEdit
          startupId={session.user.startupId}
          initialData={{
            profileImageUrl: profile?.profileImageUrl || "",
            coverImageUrl: profile?.coverImageUrl || "",
            bio: profile?.bio || "",
            contactEmail: profile?.contactEmail || "",
            contactPhone: profile?.contactPhone || "",
            location: profile?.location || "",
            website: profile?.website || "",
            isPublic: profile?.isPublic ?? true,
          }}
        />

        {profile && (
          <Card>
            <CardHeader>
              <CardTitle>Preview Your Profile</CardTitle>
              <CardDescription>
                Your profile will appear like this to other users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/organizations/${session.user.startupId}`}>
                <Button variant="outline" className="w-full">
                  View Public Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
