"use client"
import { useState } from "react"
import { Button } from "./ui/button"

export function HRInviteEmployee() {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState("")
  const [inviteSuccess, setInviteSuccess] = useState("")

  return (
    <>
      <Button onClick={() => setShowInvite(true)}>
        Invite Employee
      </Button>
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Invite Employee</h2>
            <p className="mb-4 text-sm text-gray-600">Enter the employee's email. They will receive an email with their credentials.</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setInviteLoading(true)
                setInviteError("")
                setInviteSuccess("")
                try {
                  const res = await fetch("/api/users/invite", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: inviteEmail }),
                  })
                  const data = await res.json()
                  if (!res.ok) throw new Error(data.error || "Failed to invite employee")
                  setInviteSuccess("Invitation sent! The employee will receive an email with their credentials.")
                  setInviteEmail("")
                } catch (err: any) {
                  setInviteError(err.message || "Failed to invite employee")
                } finally {
                  setInviteLoading(false)
                }
              }}
              className="space-y-4"
            >
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                placeholder="employee@email.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                required
                disabled={inviteLoading}
              />
              {inviteError && <div className="text-red-500 text-sm">{inviteError}</div>}
              {inviteSuccess && <div className="text-green-600 text-sm">{inviteSuccess}</div>}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowInvite(false)} disabled={inviteLoading}>Cancel</Button>
                <Button type="submit" disabled={inviteLoading || !inviteEmail}>{inviteLoading ? "Inviting..." : "Send Invite"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
