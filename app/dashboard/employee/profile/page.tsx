"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import { DashboardLayout } from "../../../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Textarea } from "../../../../components/ui/textarea"
import { UserRole } from "../../../../lib/auth"

export default function EmployeeProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [headline, setHeadline] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [roleTitle, setRoleTitle] = useState("")
  const [experienceJson, setExperienceJson] = useState("")
  const [skillsJson, setSkillsJson] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login")
    if (status === "authenticated" && session?.user?.id) {
      fetchProfile()
    }
  }, [status, session])

  const fetchProfile = async () => {
    const res = await fetch(`/api/profiles/${session?.user?.id}`)
    if (!res.ok) return
    const data = await res.json()
    setProfile(data)
    setHeadline(data.profile?.headline || "")
    setBio(data.profile?.bio || "")
    setLocation(data.profile?.location || "")
    setRoleTitle(data.profile?.roleTitle || "")
    setExperienceJson(data.profile?.experienceJson ? JSON.stringify(data.profile.experienceJson, null, 2) : "")
    setSkillsJson(data.profile?.skillsJson ? JSON.stringify(data.profile.skillsJson, null, 2) : "")
  }

  const saveProfile = async () => {
    setSaving(true)
    await fetch(`/api/profiles/${session?.user?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        headline,
        bio,
        location,
        roleTitle,
        experienceJson: experienceJson ? JSON.parse(experienceJson) : undefined,
        skillsJson: skillsJson ? JSON.parse(skillsJson) : undefined,
      }),
    })
    setSaving(false)
    fetchProfile()
  }

  return (
    <DashboardLayout role={(session?.user.role || "EMPLOYEE") as UserRole}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Professional Profile</CardTitle>
            <CardDescription>Keep your work context up to date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Headline</label>
              <Input value={headline} onChange={(e) => setHeadline(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Role Title</label>
              <Input value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Bio</label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
            </div>
            <div>
              <label className="text-sm font-medium">Experience (JSON)</label>
              <Textarea value={experienceJson} onChange={(e) => setExperienceJson(e.target.value)} rows={4} />
            </div>
            <div>
              <label className="text-sm font-medium">Skills (JSON)</label>
              <Textarea value={skillsJson} onChange={(e) => setSkillsJson(e.target.value)} rows={3} />
            </div>
            <Button onClick={saveProfile} disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        {profile?.personalitySnapshot && (
          <Card>
            <CardHeader>
              <CardTitle>Personality Snapshot</CardTitle>
              <CardDescription>DISC scores (read-only)</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {["D", "I", "S", "C"].map((k) => (
                <div key={k} className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">{k}</div>
                  <div className="text-xl font-bold">
                    {Math.round(profile.personalitySnapshot[`${k.toLowerCase()}Score`] || 0)}%
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

