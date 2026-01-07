"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import { useSignOut } from "../hooks/useSignOut"

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
]

export default function ResponsiveNav() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const { signOut, isSigningOut } = useSignOut()
  const router = useRouter()

  const toggleMenu = () => setMenuOpen(!menuOpen)

  const handleSignOut = async () => {
    await signOut()
    setMenuOpen(false)
  }

  const handleSignIn = () => {
    router.push("/auth/login")
    setMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/">
              <a className="text-xl font-bold text-gray-800">MyApp</a>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
            {status === "loading" ? null : session ? (
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {isSigningOut ? "Signing out..." : "Logout"}
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </button>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
              >
                {link.label}
              </a>
            ))}
            {status === "loading" ? null : session ? (
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium disabled:opacity-50"
              >
                {isSigningOut ? "Signing out..." : "Logout"}
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
