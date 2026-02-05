"use client"

import React from "react"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { TopNavbar } from "@/components/top-navbar"

// NOTE: Only import global styles from app/globals.css. Do NOT use styles/globals.css to avoid conflicts.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[hsl(var(--background))] font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProvider>
            <TopNavbar />
            <div className="relative flex min-h-screen flex-col">
              <main className="flex-1">
                <div className="container relative">
                  {children}
                </div>
              </main>
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
