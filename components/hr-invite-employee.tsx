"use client"
import { useState } from "react"
import { Button } from "./ui/button"

export function HRInviteEmployee() {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState("")
  const [inviteSuccess, setInviteSuccess] = useState("")
  const [tempPassword, setTempPassword] = useState<string | null>(null)

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
                setTempPassword(null)
                try {
                  const res = await fetch("/api/users/invite", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: inviteEmail }),
                  })
                  const data = await res.json()
                  if (!res.ok) throw new Error(data.error || "Failed to invite employee")
                  setInviteSuccess("✅ Invitation sent! Account created for: " + inviteEmail)
                  setTempPassword(data.tempPassword)
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
              {inviteError && <div className="text-red-500 text-sm font-medium">{inviteError}</div>}
              {inviteSuccess && (
                <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                  <div className="text-green-700 font-medium mb-2">{inviteSuccess}</div>
                  {tempPassword && (
                    <div className="bg-white rounded p-2 border border-green-100">
                      <p className="text-gray-600 text-xs mb-1">Temporary Credentials:</p>
                      <p className="text-gray-900 font-mono text-sm mb-1"><strong>Email:</strong> {inviteEmail || 'employee@email.com'}</p>
                      <p className="text-gray-900 font-mono text-sm mb-2"><strong>Password:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{tempPassword}</code></p>
                      <p className="text-gray-600 text-xs italic">⚠️ In development mode, share these credentials with the employee. In production, they'll receive them via email.</p>
                    </div>
                  )}
                </div>
              )}
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
