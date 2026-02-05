"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  Briefcase,
  ChevronRight,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "../ui/button"

interface HRLayoutProps {
  children: React.ReactNode
  organizationName?: string
}

export function HRLayout({ children, organizationName = "Organization" }: HRLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/")

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard/hr",
      icon: LayoutDashboard,
      description: "Overview & statistics",
    },
    {
      label: "Employees",
      href: "/dashboard/hr/employees",
      icon: Users,
      description: "Manage your team",
    },
    {
      label: "Task Management",
      href: "/dashboard/hr/tasks",
      icon: CheckSquare,
      description: "Create & review tasks",
      children: [
        { label: "Create Tasks", href: "/dashboard/hr/tasks/create" },
        { label: "Review Tasks", href: "/dashboard/hr/tasks/review" },
      ],
    },
    {
      label: "Member Credits",
      href: "/dashboard/hr/members/credits",
      icon: TrendingUp,
      description: "Performance tracking",
    },
    {
      label: "Events",
      href: "/dashboard/hr/events",
      icon: Briefcase,
      description: "Event management",
    },
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="font-bold text-white text-lg">T</span>
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-bold text-gray-900 text-sm">TAFSULA</p>
                <p className="text-xs text-gray-500">HR Suite</p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Organization Info */}
        {sidebarOpen && (
          <div className="px-4 py-4 border-b border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Organization</p>
            <p className="text-sm font-semibold text-gray-900 mt-2 truncate">{organizationName}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <div key={item.href}>
                <Link href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      active
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={20} />
                    {sidebarOpen && (
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    )}
                    {sidebarOpen && active && <ChevronRight size={18} className="text-blue-600" />}
                  </div>
                </Link>
              </div>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-200 p-4">
          <Button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            variant="outline"
            className="w-full justify-start"
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} flex-1`}>
        <div className="min-h-screen p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}
