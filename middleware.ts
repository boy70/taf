import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequestWithAuth } from "next-auth/middleware"

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req })
  const isAuthenticated = !!token

  // Public paths that don't require authentication
  const publicPaths = ["/auth/login", "/auth/register"]
  const isPublicPath = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path))

  // Redirect unauthenticated users to login
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  // Redirect authenticated users away from public paths
  if (isAuthenticated && isPublicPath) {
    return redirectBasedOnRole(token.role as string, req.url)
  }

  // Role-based access control
  if (isAuthenticated) {
    const role = token.role as string
    const path = req.nextUrl.pathname

    // Admin paths
    if (path.startsWith("/dashboard/admin") && role !== "SUPERADMIN") {
      return redirectBasedOnRole(role, req.url)
    }

    // HR paths
    if (path.startsWith("/dashboard/hr") && role !== "HR") {
      return redirectBasedOnRole(role, req.url)
    }

    // Employee paths
    if (path.startsWith("/dashboard/employee") && role !== "EMPLOYEE") {
      return redirectBasedOnRole(role, req.url)
    }
  }

  return NextResponse.next()
}

function redirectBasedOnRole(role: string, baseUrl: string) {
  let redirectPath = "/dashboard/employee"

  if (role === "SUPERADMIN") {
    redirectPath = "/dashboard/admin"
  } else if (role === "HR") {
    redirectPath = "/dashboard/hr"
  }

  return NextResponse.redirect(new URL(redirectPath, baseUrl))
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/test/:path*", "/results/:path*"],
}
