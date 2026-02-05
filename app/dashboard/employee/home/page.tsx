"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  Lightbulb,
  Users,
  TrendingUp,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { format } from "date-fns"

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: string;
  dueDate?: string;
  status: string;
  createdAt: string;
  team: {
    id: string;
    name: string;
    eventId?: string;
    projectId?: string;
  };
  createdBy: {
    name: string;
  };
}

interface TaskAssignment {
  id: string;
  status: string;
  approvalStatus: string;
  submittedAt?: string;
  approvedAt?: string;
  approvalComment?: string;
  creditsAwarded: number;
  task: Task;
}
interface DashboardStats {
  testsCompleted: boolean
  disc: {
    dominantType: string
    dScore: number
    iScore: number
    sScore: number
    cScore: number
  } | null
  upcomingEvents: Array<{
    id: string
    title: string
    startAt: string
    format: string
    description: string
  }>
  approvedProposals: number
  pendingProposals: number
  teamSize: number
  recentPosts: Array<{
    id: string
    title: string
    content: string
    author: string
    comments: number
    likes: number
    createdAt: string
  }>
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

const getDISCColor = (type: string) => {
  const colors: Record<string, string> = {
    D: "bg-red-500/10 text-red-700 border-red-200",
    I: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
    S: "bg-green-500/10 text-green-700 border-green-200",
    C: "bg-blue-500/10 text-blue-700 border-blue-200",
  }
  return colors[type] || "bg-gray-500/10 text-gray-700 border-gray-200"
}

const getDISCLabel = (type: string) => {
  const labels: Record<string, string> = {
    D: "Dominant",
    I: "Influencer",
    S: "Supporter",
    C: "Conscientious",
  }
  return labels[type] || "Unknown"
}

export default function EmployeeDashboardHome() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/employees/dashboard-stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full" />
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.section variants={itemVariants}>
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
          <p className="text-blue-100">
            Here's your team compatibility dashboard and recent activity
          </p>
        </div>
      </motion.section>

      {/* DISC Profile Card */}
      {stats?.disc && (
        <motion.section variants={itemVariants}>
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your DISC Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Primary Type</p>
                  <Badge className={`mt-2 text-lg px-4 py-2 ${getDISCColor(stats.disc.dominantType)}`}>
                    {getDISCLabel(stats.disc.dominantType)}
                  </Badge>
                </div>
                <Link href="/dashboard/employee/results">
                  <Button variant="outline">View Full Report</Button>
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-3 mt-6">
                {[
                  { type: "D", score: stats.disc.dScore },
                  { type: "I", score: stats.disc.iScore },
                  { type: "S", score: stats.disc.sScore },
                  { type: "C", score: stats.disc.cScore },
                ].map((item) => (
                  <div key={item.type} className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="font-semibold text-lg">{item.score}%</p>
                    <p className="text-xs text-gray-600 mt-1">{item.type}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      )}

      {/* Quick Stats Grid */}
      <motion.section variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-gray-600">Team Members</p>
                  <p className="text-3xl font-bold mt-2">{stats?.teamSize || 0}</p>
                </div>
                <Users className="w-12 h-12 text-blue-500/20" />
              </motion.div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-gray-600">Pending Proposals</p>
                  <p className="text-3xl font-bold mt-2">{stats?.pendingProposals || 0}</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-500/20" />
              </motion.div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-gray-600">Approved Proposals</p>
                  <p className="text-3xl font-bold mt-2">{stats?.approvedProposals || 0}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500/20" />
              </motion.div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-gray-600">Upcoming Events</p>
                  <p className="text-3xl font-bold mt-2">{stats?.upcomingEvents.length || 0}</p>
                </div>
                <Calendar className="w-12 h-12 text-purple-500/20" />
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Upcoming Events */}
      {stats?.upcomingEvents.length ? (
        <motion.section variants={itemVariants}>
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.upcomingEvents.slice(0, 5).map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className="p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <Badge variant="outline">{event.format}</Badge>
                        <span className="text-xs text-gray-500">
                          {format(new Date(event.startAt), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                    </div>
                    <Link href={`/events/${event.id}`}>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.section>
      ) : null}

      {/* Quick Actions */}
      <motion.section variants={itemVariants}>
        <Card className="border-2 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/dashboard/employee/proposals">
                <Button className="w-full" variant="outline">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Submit Proposal
                </Button>
              </Link>
              <Link href="/dashboard/employee/teams">
                <Button className="w-full" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  View Teams
                </Button>
              </Link>
              <Link href="/dashboard/employee/feed">
                <Button className="w-full" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Team Feed
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Recent Posts */}
      {stats?.recentPosts.length ? (
        <motion.section variants={itemVariants}>
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Recent Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.recentPosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <p className="text-xs text-gray-500 mb-2">Posted by {post.author}</p>
                  <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-3">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>💬 {post.comments}</span>
                    <span>❤️ {post.likes}</span>
                    <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.section>
      ) : null}
    </motion.div>
  )
}

