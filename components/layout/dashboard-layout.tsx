import type { ReactNode } from "react"
import Link from "next/link"
import { UserNav } from "../../components/user-nav"
import { UserRole } from "../../types/user"

interface DashboardLayoutProps {
  children: ReactNode
  role: UserRole
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="font-bold text-xl">
              Tafsula
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {role === UserRole.SUPERADMIN && (
                <>
                  <Link href="/dashboard/admin" className="text-sm font-medium transition-colors hover:text-primary">
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/admin/startups"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Startups
                  </Link>
                  <Link
                    href="/dashboard/admin/users"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Users
                  </Link>
                </>
              )}
              {role === UserRole.HR && (
                <>
                  <Link href="/dashboard/hr" className="text-sm font-medium transition-colors hover:text-primary">
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/hr/employees"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Employees
                  </Link>
                  <Link
                    href="/dashboard/hr/compatibility"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Team Compatibility
                  </Link>
                </>
              )}
              {role === UserRole.EMPLOYEE && (
                <>
                  <Link href="/dashboard/employee" className="text-sm font-medium transition-colors hover:text-primary">
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/employee/results"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    My Results
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Tafsula. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
