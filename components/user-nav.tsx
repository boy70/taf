"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { useSession, signIn } from "next-auth/react"
import { useSignOut } from "../hooks/useSignOut"

export function UserNav() {
  const { data: session, status } = useSession()
  const { signOut, isSigningOut } = useSignOut()

  if (status === "loading") return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors">
          <Avatar className="h-9 w-9 border border-gray-200">
            <AvatarFallback className="bg-gray-100 text-gray-700 font-medium text-sm">
              {session?.user?.name ? session.user.name.split(" ").map(n => n[0]).join("") : "?"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-white border border-gray-200 shadow-lg" align="end" forceMount>
        {session ? (
          <>
            <DropdownMenuLabel className="font-normal p-4 border-b border-gray-100">
              <div className="text-sm font-semibold text-gray-900 leading-none">{session.user?.name || "User"}</div>
              <div className="text-xs text-gray-500 leading-none mt-1">{session.user?.email}</div>
              {session.user?.role && (
                <div className="text-xs text-gray-500 leading-none mt-1 px-2 py-1 bg-gray-100 rounded-full inline-block">
                  {session.user.role}
                </div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 transition-colors">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 transition-colors">
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 transition-colors">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer hover:bg-red-50 text-red-600 font-medium py-2 px-4 transition-colors"
              onClick={() => signOut()}
              disabled={isSigningOut}
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            className="cursor-pointer hover:bg-blue-50 text-blue-600 font-medium py-2 px-4 transition-colors"
            onClick={() => signIn()}
          >
            Login
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
