"use client"

import React from "react"
import "./globals.css"
import { SessionProvider } from "next-auth/react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="">
      <body style={{ colorScheme: "light" }}>
        {/* Default to light theme to match the color psychology page design
        Users can still toggle to dark mode if needed */}
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
