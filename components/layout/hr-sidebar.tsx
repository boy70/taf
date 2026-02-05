"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  Settings,
  LogOut,
  ChevronDown,
  NetworkIcon,
  Megaphone,
  TrendingUp,
  Menu,
  X,
  MessageSquare,
  Briefcase,
} from "lucide-react"
import { signOut } from "next-auth/react"

interface HRSidebarProps {
  organizationName: string
}

export function HRSidebar({ organizationName }: HRSidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(["main"])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  const isActive = (href: string) => pathname.startsWith(href)

  const NavLink = ({
    href,
    icon: Icon,
    label,
    badge,
  }: {
    href: string
    icon: any
    label: string
    badge?: string
  }) => (
    <Link
      href={href}
      onClick={() => setIsMobileOpen(false)}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group ${
        isActive(href)
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isActive(href) ? "bg-blue-400" : "bg-red-100 text-red-700"}`}>
          {badge}
        </span>
      )}
    </Link>
  )

  const NavSection = ({
    title,
    icon: Icon,
    id,
    children,
  }: {
    title: string
    icon: any
    id: string
    children: React.ReactNode
  }) => (
    <div>
      <button
        onClick={() => toggleSection(id)}
        className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg transition-all duration-200 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Icon className="w-5 h-5" />
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${expandedSections.includes(id) ? "rotate-180" : ""}`}
        />
      </button>
      {expandedSections.includes(id) && <div className="mt-2 space-y-1 pl-2 border-l-2 border-gray-200 dark:border-gray-700 ml-2">{children}</div>}
    </div>
  )

  const sidebarContent = (
    <>
      {/* Logo & Organization Name */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <Link href="/dashboard/hr" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
              {organizationName || "Organization"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">HR Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Core Section */}
        <div className="space-y-2 pb-4">
          <NavLink href="/dashboard/hr" icon={LayoutDashboard} label="Dashboard" />
          <NavLink href="/dashboard/hr/home" icon={MessageSquare} label="Home Feed" badge="NEW" />
        </div>

        {/* Team & Events */}
        <NavSection title="Teams & Events" icon={NetworkIcon} id="teams">
          <div className="space-y-1 ml-2">
            <NavLink href="/dashboard/hr/teams" icon={Users} label="Create Teams" />
            <NavLink href="/dashboard/hr/teams/groups" icon={NetworkIcon} label="Team Groups" badge="PRO" />
            <NavLink href="/dashboard/hr/events" icon={Calendar} label="Events" />
            <NavLink href="/dashboard/hr/events/new" icon={Calendar} label="Create Event" />
          </div>
        </NavSection>

        {/* Task Management */}
        <NavSection title="Task Management" icon={Briefcase} id="tasks">
          <div className="space-y-1 ml-2">
            <NavLink href="/dashboard/hr/tasks/create" icon={Briefcase} label="Create Tasks" />
            <NavLink href="/dashboard/hr/tasks/review" icon={MessageSquare} label="Review Tasks" badge="NEW" />
          </div>
        </NavSection>

        {/* People Management */}
        <NavSection title="People" icon={Users} id="people">
          <div className="space-y-1 ml-2">
            <NavLink href="/dashboard/hr/employees" icon={Users} label="All Employees" />
            <NavLink href="/dashboard/hr/employees/invite" icon={Users} label="Invite Team" />
          </div>
        </NavSection>

        {/* Development & Analysis */}
        <NavSection title="Development" icon={TrendingUp} id="development">
          <div className="space-y-1 ml-2">
            <NavLink href="/dashboard/hr/training-planner" icon={BookOpen} label="Training Plans" />
            <NavLink href="/dashboard/hr/compatibility" icon={TrendingUp} label="Team Analysis" />
            <NavLink href="/dashboard/hr/members/credits" icon={TrendingUp} label="Member Credits" badge="NEW" />
          </div>
        </NavSection>

        {/* Organization */}
        <NavLink href="/dashboard/hr/organization" icon={Briefcase} label="Organization" />

        {/* Divider */}
        <div className="my-4 border-t border-gray-200 dark:border-gray-800"></div>

        {/* Settings */}
        <NavLink href="/dashboard/hr/settings" icon={Settings} label="Settings" />
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:flex-col md:bg-white md:dark:bg-gray-900 md:border-r md:border-gray-200 md:dark:border-gray-800 md:shadow-sm">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />

          {/* Sidebar */}
          <aside className="absolute left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
