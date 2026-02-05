"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import EmployeeLayout from "../../../../components/layout/employee-layout"
import { Card, CardContent } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import {
  CheckCircle,
  Clock,
  X,
  Eye,
  Lock,
  MessageSquare,
  AlertCircle,
  Send,
  Sparkles,
  Zap,
  TrendingUp,
  Filter,
  Lightbulb,
  Calendar,
  Target,
  Users,
  Check,
  Trash2,
} from "lucide-react"

export default function HRProposalsPage() {
  const { data: session } = useSession()
  const [proposals, setProposals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProposal, setSelectedProposal] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [responseMessage, setResponseMessage] = useState("")
  const [actionProposal, setActionProposal] = useState<any>(null)

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    try {
      const response = await fetch("/api/proposals")
      const data = await response.json()
      // Filter to show all proposals for HR review
      setProposals(data)
    } catch (error) {
      console.error("Failed to fetch proposals:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (proposalId: string) => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved", visibility: "ORG" }),
      })
      if (response.ok) {
        // Add comment with response
        if (responseMessage) {
          await fetch(`/api/proposals/${proposalId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ body: responseMessage }),
          })
        }
        fetchProposals()
        setShowDetails(false)
        setResponseMessage("")
      }
    } catch (error) {
      console.error("Failed to approve proposal:", error)
    }
  }

  const handleReject = async (proposalId: string) => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      })
      if (response.ok) {
        if (responseMessage) {
          await fetch(`/api/proposals/${proposalId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ body: responseMessage }),
          })
        }
        fetchProposals()
        setShowDetails(false)
        setResponseMessage("")
      }
    } catch (error) {
      console.error("Failed to reject proposal:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-300"
      case "submitted":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300"
      case "in_review":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "submitted":
        return <Clock className="w-4 h-4" />
      case "rejected":
        return <X className="w-4 h-4" />
      case "in_review":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Lightbulb className="w-4 h-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "idea":
        return <Lightbulb className="w-5 h-5" />
      case "event":
        return <Calendar className="w-5 h-5" />
      case "project":
        return <Target className="w-5 h-5" />
      case "initiative":
        return <TrendingUp className="w-5 h-5" />
      default:
        return <Sparkles className="w-5 h-5" />
    }
  }

  const filteredProposals = proposals.filter(
    (p) => statusFilter === "all" || p.status === statusFilter
  )

  return (
    <EmployeeLayout>
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
            animate={{ y: [0, -30, 0], x: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
            animate={{ y: [0, 30, 0], x: [0, -30, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 flex items-center gap-3">
                <Check className="w-10 h-10 text-purple-600" />
                🎯 Proposal Review Center
              </h1>
              <p className="text-lg text-gray-600">Review and approve employee proposals</p>
            </motion.div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Total Proposals",
                  value: proposals.length,
                  icon: Lightbulb,
                  color: "from-blue-500 to-blue-600",
                },
                {
                  label: "Pending Review",
                  value: proposals.filter((p) => p.status === "submitted").length,
                  icon: Clock,
                  color: "from-yellow-500 to-yellow-600",
                },
                {
                  label: "Approved",
                  value: proposals.filter((p) => p.status === "approved").length,
                  icon: CheckCircle,
                  color: "from-green-500 to-green-600",
                },
                {
                  label: "Rejected",
                  value: proposals.filter((p) => p.status === "rejected").length,
                  icon: X,
                  color: "from-red-500 to-red-600",
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-0 shadow-md overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                          <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div
                          className={`bg-gradient-to-br ${stat.color} p-4 rounded-lg text-white`}
                        >
                          <stat.icon className="w-6 h-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 flex gap-3 flex-wrap"
            >
              <Filter className="w-5 h-5 text-gray-600 my-auto" />
              {["all", "submitted", "approved", "rejected"].map((status) => (
                <Button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  variant={statusFilter === status ? "default" : "outline"}
                  className={`capitalize ${
                    statusFilter === status
                      ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                      : ""
                  }`}
                >
                  {status}
                </Button>
              ))}
            </motion.div>

            {/* Proposals List */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-10 h-10 text-purple-600" />
                </motion.div>
              </div>
            ) : filteredProposals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-600">No proposals to review</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredProposals.map((proposal, index) => (
                    <motion.div
                      key={proposal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                        <CardContent className="p-0">
                          <div className="flex items-center gap-6 p-6 md:p-8">
                            {/* Left bar indicator */}
                            <div
                              className={`w-1 h-full rounded-l-lg bg-gradient-to-b ${
                                proposal.status === "approved"
                                  ? "from-green-500 to-green-600"
                                  : proposal.status === "rejected"
                                    ? "from-red-500 to-red-600"
                                    : "from-yellow-500 to-yellow-600"
                              }`}
                              style={{ minHeight: "80px" }}
                            />

                            {/* Icon */}
                            <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg text-purple-600 flex-shrink-0">
                              {getTypeIcon(proposal.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-black text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                                {proposal.title}
                              </h3>
                              <p className="text-sm text-gray-600 truncate">
                                by {proposal.submittedBy?.name || "Unknown"}
                              </p>
                              {proposal.canvasJson?.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                  {proposal.canvasJson.description}
                                </p>
                              )}
                            </div>

                            {/* Status and Badge */}
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`flex items-center gap-1 px-3 py-1.5 border ${getStatusColor(proposal.status)} whitespace-nowrap`}
                              >
                                {getStatusIcon(proposal.status)}
                                {proposal.status.replace("_", " ")}
                              </Badge>
                            </div>

                            {/* Action Button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedProposal(proposal)
                                setShowDetails(true)
                              }}
                              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-2 px-6 rounded-lg hover:shadow-lg transition-shadow flex-shrink-0"
                            >
                              Review
                            </motion.button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {showDetails && selectedProposal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setShowDetails(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8"
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg text-purple-600">
                        {getTypeIcon(selectedProposal.type)}
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-gray-900">
                          {selectedProposal.title}
                        </h2>
                        <p className="text-gray-600 text-sm">
                          Proposed by {selectedProposal.submittedBy?.name || "Unknown"} •{" "}
                          {new Date(selectedProposal.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Status Bar */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                    <Badge
                      className={`flex items-center gap-1 px-3 py-1.5 border ${getStatusColor(selectedProposal.status)}`}
                    >
                      {getStatusIcon(selectedProposal.status)}
                      {selectedProposal.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-3">📋 Proposal Details</h3>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedProposal.canvasJson?.description ||
                          "No description provided"}
                      </p>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-3">💬 Comments</h3>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto mb-3">
                      {selectedProposal.comments && selectedProposal.comments.length > 0 ? (
                        <div className="space-y-3">
                          {selectedProposal.comments.map((comment: any) => (
                            <div
                              key={comment.id}
                              className="bg-white p-3 rounded-lg border border-gray-200"
                            >
                              <p className="text-sm font-medium text-gray-900">
                                {comment.author?.name || "Unknown"}
                              </p>
                              <p className="text-sm text-gray-700 mt-1">{comment.body}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No comments yet</p>
                      )}
                    </div>

                    {/* Response Input */}
                    {selectedProposal.status === "submitted" && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Your Response/Feedback
                        </label>
                        <textarea
                          value={responseMessage}
                          onChange={(e) => setResponseMessage(e.target.value)}
                          placeholder="Add feedback or reason for approval/rejection..."
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end">
                    <Button
                      onClick={() => setShowDetails(false)}
                      variant="outline"
                      className="px-6 py-3"
                    >
                      Close
                    </Button>
                    {selectedProposal.status === "submitted" && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReject(selectedProposal.id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApprove(selectedProposal.id)}
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 px-6 rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer spacing */}
        <div className="h-12" />
      </div>
    </EmployeeLayout>
  )
}
