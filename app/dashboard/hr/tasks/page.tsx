"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Filter,
  ArrowRight,
  Zap,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { format } from "date-fns"

interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: string
  createdAt: string
  assignedTo?: {
    id: string
    name: string
    email: string
  }
  createdBy: {
    id: string
    name: string
  }
  team?: {
    id: string
    name: string
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "URGENT":
      return "bg-red-100 text-red-800 border-red-300"
    case "HIGH":
      return "bg-orange-100 text-orange-800 border-orange-300"
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-300"
    default:
      return "bg-green-100 text-green-800 border-green-300"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-50 border-green-200"
    case "IN_PROGRESS":
      return "bg-blue-50 border-blue-200"
    case "OPEN":
      return "bg-white border-gray-200"
    case "BLOCKED":
      return "bg-red-50 border-red-200"
    default:
      return "bg-gray-50 border-gray-200"
  }
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

export default function HRTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    filterTasks()
  }, [tasks, selectedStatus, selectedPriority])

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks?limit=100")
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterTasks = () => {
    let filtered = tasks

    if (selectedStatus) {
      filtered = filtered.filter((t) => t.status === selectedStatus)
    }

    if (selectedPriority) {
      filtered = filtered.filter((t) => t.priority === selectedPriority)
    }

    setFilteredTasks(filtered)
  }

  const taskStats = {
    total: tasks.length,
    open: tasks.filter((t) => t.status === "OPEN").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    urgent: tasks.filter((t) => t.priority === "URGENT").length,
  }

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
      {/* Header */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Zap className="w-8 h-8 text-yellow-500" />
              Task Management
            </h1>
            <p className="text-gray-600 mt-1">Track and manage team tasks across your organization</p>
          </div>
          <Link href="/dashboard/hr/tasks/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create New Task
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Stats Cards */}
      <motion.section variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-3xl font-bold mt-2">{taskStats.total}</p>
                </div>
                <Zap className="w-12 h-12 text-blue-500/20" />
              </motion.div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Open</p>
                  <p className="text-3xl font-bold mt-2">{taskStats.open}</p>
                </div>
                <Clock className="w-12 h-12 text-gray-500/20" />
              </motion.div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold mt-2">{taskStats.inProgress}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-yellow-500/20" />
              </motion.div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold mt-2">{taskStats.completed}</p>
                </div>
                <CheckCircle2 className="w-12 h-12 text-green-500/20" />
              </motion.div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Urgent</p>
                  <p className="text-3xl font-bold mt-2 text-red-600">{taskStats.urgent}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-red-500/20" />
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Filters */}
      <motion.section variants={itemVariants}>
        <Card className="bg-gradient-to-r from-gray-50 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {["OPEN", "IN_PROGRESS", "COMPLETED", "BLOCKED"].map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    setSelectedStatus(selectedStatus === status ? null : status)
                  }
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedStatus === status
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}

              <div className="w-full border-t border-gray-200 pt-2 mt-2" />

              {["URGENT", "HIGH", "MEDIUM", "LOW"].map((priority) => (
                <button
                  key={priority}
                  onClick={() =>
                    setSelectedPriority(selectedPriority === priority ? null : priority)
                  }
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedPriority === priority
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-orange-300"
                  }`}
                >
                  {priority} Priority
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Tasks List */}
      <motion.section variants={itemVariants}>
        <Card className="border-2">
          <CardHeader>
            <CardTitle>
              Tasks ({filteredTasks.length})
            </CardTitle>
            <CardDescription>
              {selectedStatus && selectedPriority
                ? `Showing ${selectedStatus} ${selectedPriority} priority tasks`
                : selectedStatus
                  ? `Showing ${selectedStatus} tasks`
                  : selectedPriority
                    ? `Showing ${selectedPriority} priority tasks`
                    : "Showing all tasks"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No tasks found</p>
                <p className="text-sm text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={itemVariants}
                  className={`p-4 border-2 rounded-lg hover:shadow-md transition-all ${getStatusColor(
                    task.status
                  )}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline">{task.status}</Badge>
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-700 mb-3">{task.description}</p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                        {task.team && (
                          <span>
                            👥 Team: <strong>{task.team.name}</strong>
                          </span>
                        )}
                        {task.assignedTo && (
                          <span>
                            👤 Assigned: <strong>{task.assignedTo.name}</strong>
                          </span>
                        )}
                        {task.dueDate && (
                          <span>
                            📅 Due: <strong>{format(new Date(task.dueDate), "MMM d, yyyy")}</strong>
                          </span>
                        )}
                        <span>
                          📝 Created by <strong>{task.createdBy.name}</strong>
                        </span>
                      </div>
                    </div>
                    <Link href={`/dashboard/hr/tasks/${task.id}`}>
                      <Button size="sm" variant="ghost">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  )
}
