"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import EmployeeLayout from "../../../../components/layout/employee-layout"
import { UserNav } from "../../../../components/user-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import {
  Lightbulb,
  Plus,
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
  Users,
  Calendar,
  Target,
} from "lucide-react"

// Interactive Guide Component - Book Design
const ProposalGuide = ({ onClose }: { onClose: () => void }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)

  const pages = [
    {
      title: "Welcome to Proposal Studio",
      subtitle: "✨ Turn Your Ideas Into Impact",
      icon: "📖",
      bgGradient: "from-blue-600 to-indigo-600",
      content: (
        <div className="space-y-6">
          <p className="text-lg leading-relaxed text-gray-700">
            You're about to create something amazing. This guide will help you structure your proposal like a pro – no business jargon, just smart thinking.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm font-bold text-gray-700">Clear Thinking</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">💪</div>
              <p className="text-sm font-bold text-gray-700">Strong Ideas</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">🚀</div>
              <p className="text-sm font-bold text-gray-700">Real Impact</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm font-bold text-gray-700">Get Approved</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 italic text-center mt-6">
            You have 4 pages of guidance ahead. Let's make your idea shine! ⭐
          </p>
        </div>
      ),
    },
    {
      title: "Understanding SWOT",
      subtitle: "🎯 Know Your Landscape",
      icon: "🎯",
      bgGradient: "from-green-600 to-emerald-600",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-l-4 border-green-500">
            <div className="flex items-start gap-3">
              <span className="text-3xl">💪</span>
              <div className="flex-1">
                <h4 className="font-black text-lg text-gray-900">Strengths 💚</h4>
                <p className="text-xs text-gray-600 mt-1 font-semibold italic">"What are we GOOD at?"</p>
                <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                  Write down your superpowers! Skills, resources, experience, or talents that help your idea succeed.
                </p>
                <div className="bg-white p-3 rounded-lg mt-3 border border-green-200">
                  <p className="text-xs font-bold text-gray-700 mb-1">✅ Easy Example:</p>
                  <p className="text-xs text-gray-600">"Our team has 5 years of event experience" or "We have great social media skills"</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 rounded-xl border-l-4 border-yellow-500">
            <div className="flex items-start gap-3">
              <span className="text-3xl">⚠️</span>
              <div className="flex-1">
                <h4 className="font-black text-lg text-gray-900">Weaknesses 💛</h4>
                <p className="text-xs text-gray-600 mt-1 font-semibold italic">"What needs HELP?"</p>
                <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                  Be honest about gaps. What do you need more of? Budget, team, tools, or knowledge? It's SMART!
                </p>
                <div className="bg-white p-3 rounded-lg mt-3 border border-yellow-200">
                  <p className="text-xs font-bold text-gray-700 mb-1">✅ Easy Example:</p>
                  <p className="text-xs text-gray-600">"We need bigger budget" or "Our team is small - only 2 people"</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-5 rounded-xl border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🌟</span>
              <div className="flex-1">
                <h4 className="font-black text-lg text-gray-900">Opportunities 💙</h4>
                <p className="text-xs text-gray-600 mt-1 font-semibold italic">"What LUCK do we have?"</p>
                <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                  Look around! Trends, partnerships, timing, or things in the world that could help your idea WIN.
                </p>
                <div className="bg-white p-3 rounded-lg mt-3 border border-blue-200">
                  <p className="text-xs font-bold text-gray-700 mb-1">✅ Easy Example:</p>
                  <p className="text-xs text-gray-600">"People care more about environment now" or "We could partner with Company X"</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-xl border-l-4 border-red-500">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🚨</span>
              <div className="flex-1">
                <h4 className="font-black text-lg text-gray-900">Threats ❤️</h4>
                <p className="text-xs text-gray-600 mt-1 font-semibold italic">"What COULD GO WRONG?"</p>
                <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                  Plan ahead! What problems or obstacles might stop you? Money issues, competition, or timing?
                </p>
                <div className="bg-white p-3 rounded-lg mt-3 border border-red-200">
                  <p className="text-xs font-bold text-gray-700 mb-1">✅ Easy Example:</p>
                  <p className="text-xs text-gray-600">"Tight deadline" or "Another group is doing something similar"</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-xl mt-2">
            <p className="text-xs font-bold text-gray-800">💡 Remember:</p>
            <p className="text-xs text-gray-700 mt-1">SWOT helps HR understand if your idea is REAL and DOABLE. Be honest!</p>
          </div>
        </div>
      ),
    },
    {
      title: "Mastering SMART",
      subtitle: "🎪 Create Achievable Goals",
      icon: "🎪",
      bgGradient: "from-purple-600 to-pink-600",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 text-sm font-bold mb-2">
            💡 SMART = Goals that are CLEAR, DOABLE & TRACKABLE!
          </p>

          <div className="bg-indigo-50 p-5 rounded-lg border-l-4 border-indigo-500">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div className="flex-1">
                <h4 className="font-black text-gray-900">Specific</h4>
                <p className="text-xs text-gray-600 font-semibold italic mt-1">"Be CLEAR & DETAILED"</p>
                <p className="text-sm text-gray-700 mt-2">Don't say "do something." Say EXACTLY what you'll do.</p>
                <div className="bg-white p-3 rounded-lg mt-3 border border-indigo-200">
                  <p className="text-xs font-bold text-gray-700 mb-1">❌ Too Vague:</p>
                  <p className="text-xs text-gray-600 mb-2">"Improve community"</p>
                  <p className="text-xs font-bold text-gray-700 mb-1">✅ Perfect:</p>
                  <p className="text-xs text-gray-600">"Organize 2 community clean-up events"</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div className="flex-1">
                <h4 className="font-black text-gray-900">Measurable</h4>
                <p className="text-xs text-gray-600 font-semibold italic mt-1">"Add NUMBERS & PROOF"</p>
                <p className="text-sm text-gray-700 mt-2">How will you KNOW it worked? Use numbers, dates, or stats!</p>
                <div className="bg-white p-3 rounded-lg mt-3 border border-blue-200">
                  <p className="text-xs font-bold text-gray-700 mb-1">❌ Too Soft:</p>
                  <p className="text-xs text-gray-600 mb-2">"Reach many people"</p>
                  <p className="text-xs font-bold text-gray-700 mb-1">✅ Perfect:</p>
                  <p className="text-xs text-gray-600">"Reach 500 people in the first month"</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cyan-50 p-5 rounded-lg border-l-4 border-cyan-500">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div className="flex-1">
                <h4 className="font-black text-gray-900">Achievable</h4>
                <p className="text-xs text-gray-600 font-semibold italic mt-1">"BE REALISTIC"</p>
                <p className="text-sm text-gray-700 mt-2">Dream big BUT be real. Can you actually DO this with your resources?</p>
                <div className="bg-white p-3 rounded-lg mt-3 border border-cyan-200">
                  <p className="text-xs font-bold text-gray-700 mb-1">❌ Too Crazy:</p>
                  <p className="text-xs text-gray-600 mb-2">"Become world famous in 1 week"</p>
                  <p className="text-xs font-bold text-gray-700 mb-1">✅ Perfect:</p>
                  <p className="text-xs text-gray-600">"Get 100 followers on our social media in 2 months"</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-500">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎪</span>
              <div className="flex-1">
                <h4 className="font-black text-gray-900">Relevant</h4>
                <p className="text-xs text-gray-600 font-semibold italic mt-1">"DOES IT MATTER?"</p>
                <p className="text-sm text-gray-700 mt-2">Does this goal connect to your MAIN IDEA? Stay on track!</p>
                <div className="bg-white p-3 rounded-lg mt-3 border border-purple-200">
                  <p className="text-xs font-bold text-gray-700 mb-1">❌ Not Relevant:</p>
                  <p className="text-xs text-gray-600 mb-2">If your idea is "teach math" but goal is "paint the building"</p>
                  <p className="text-xs font-bold text-gray-700 mb-1">✅ Perfect:</p>
                  <p className="text-xs text-gray-600">Your goal directly supports your main idea</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-pink-50 p-5 rounded-lg border-l-4 border-pink-500">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⏰</span>
              <div className="flex-1">
                <h4 className="font-black text-gray-900">Time-bound</h4>
                <p className="text-xs text-gray-600 font-semibold italic mt-1">"SET A DEADLINE"</p>
                <p className="text-sm text-gray-700 mt-2">When will this happen? A deadline keeps you FOCUSED!</p>
                <div className="bg-white p-3 rounded-lg mt-3 border border-pink-200">
                  <p className="text-xs font-bold text-gray-700 mb-1">❌ No Deadline:</p>
                  <p className="text-xs text-gray-600 mb-2">"Eventually reach 100 people"</p>
                  <p className="text-xs font-bold text-gray-700 mb-1">✅ Perfect:</p>
                  <p className="text-xs text-gray-600">"Reach 100 people by end of March 2026"</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border-2 border-purple-300">
            <p className="text-sm font-black text-gray-900">🏆 Full SMART Example:</p>
            <p className="text-xs text-gray-700 mt-2 leading-relaxed font-semibold">
              "Teach coding to <strong>50 high school students</strong> (Specific), measuring progress with <strong>quiz scores</strong> (Measurable), using our <strong>existing volunteers</strong> (Achievable), which supports <strong>our education mission</strong> (Relevant), <strong>completed by June 2026</strong> (Time-bound)"
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Ready to Create?",
      subtitle: "💫 Let's Make Magic",
      icon: "✨",
      bgGradient: "from-amber-600 to-orange-600",
      content: (
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl">
            <h4 className="font-bold text-gray-900 mb-3 text-lg">🎨 Form Tips & Tricks</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-lg">✍️</span>
                <span className="text-gray-700">
                  <strong>Write naturally</strong> – Imagine explaining your idea to a friend
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">🎯</span>
                <span className="text-gray-700">
                  <strong>Keep it short</strong> – 2-3 sentences per box is perfect
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">🔄</span>
                <span className="text-gray-700">
                  <strong>Be honest</strong> – Weaknesses and threats are strengths in disguise
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">🚀</span>
                <span className="text-gray-700">
                  <strong>Own your vision</strong> – Let your passion shine through
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl text-center">
            <p className="text-lg font-bold mb-2">You've Got This! 💪</p>
            <p className="text-sm opacity-90">
              Your idea matters. Let's show the world what you can do.
            </p>
          </div>

          <p className="text-xs text-gray-500 text-center italic">
            Questions? Wondering if you missed something? Go back and re-read any page anytime.
          </p>
        </div>
      ),
    },
  ]

  const handlePageChange = (newPage: number) => {
    setIsFlipping(true)
    setTimeout(() => {
      setCurrentPage(newPage)
      setIsFlipping(false)
    }, 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-gradient-to-br from-black/50 to-black/30 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Book Container with 3D effect */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ rotateY: -90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: 90, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="w-full max-w-2xl"
        style={{ perspective: 1200 }}
      >
        {/* Book wrapper with shadow */}
        <div className="relative">
          {/* Book Shadow */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-full h-4 bg-black/20 blur-2xl rounded-full" />

          {/* Actual Book */}
          <motion.div
            animate={{ rotateZ: isFlipping ? 5 : 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Book Header with gradient */}
            <motion.div
              animate={{ backgroundPosition: isFlipping ? "100% 0" : "0% 0" }}
              transition={{ duration: 0.3 }}
              className={`bg-gradient-to-r ${pages[currentPage].bgGradient} text-white p-8 relative overflow-hidden`}
            >
              {/* Animated background pattern */}
              <motion.div
                animate={{ rotate: isFlipping ? 360 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"
              />
              <motion.div
                animate={{ rotate: isFlipping ? -360 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"
              />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-5xl mb-3"
                >
                  {pages[currentPage].icon}
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-black"
                >
                  {pages[currentPage].title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-white/80 text-sm mt-2 font-semibold"
                >
                  {pages[currentPage].subtitle}
                </motion.p>
              </div>

              {/* Page indicator */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                {currentPage + 1} / {pages.length}
              </div>
            </motion.div>

            {/* Book Content */}
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-8 min-h-96 bg-gradient-to-br from-white to-gray-50 overflow-y-auto max-h-96"
            >
              {pages[currentPage].content}
            </motion.div>

            {/* Book Footer Navigation */}
            <div className="bg-white border-t border-gray-200 p-6 flex items-center justify-between">
              {/* Progress bar */}
              <div className="absolute left-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }} />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                ← Back
              </motion.button>

              {/* Dot indicators */}
              <div className="flex gap-2">
                {pages.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handlePageChange(idx)}
                    animate={{
                      scale: idx === currentPage ? 1.2 : 1,
                      backgroundColor: idx === currentPage ? "#3b82f6" : "#e5e7eb",
                    }}
                    className="w-2 h-2 rounded-full transition-all cursor-pointer"
                  />
                ))}
              </div>

              {currentPage < pages.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
                >
                  Next →
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:shadow-lg transition-all"
                >
                  Start Creating 🚀
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ProposalsPage() {
  const { data: session } = useSession()
  const [proposals, setProposals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [hasOpenedFormBefore, setHasOpenedFormBefore] = useState(false)
  const [formData, setFormData] = useState({
    type: "idea",
    title: "",
    visibility: "ORG",
    swot: {
      strengths: "",
      weaknesses: "",
      opportunities: "",
      threats: "",
    },
    smart: {
      specific: "",
      measurable: "",
      achievable: "",
      relevant: "",
      timeBound: "",
    },
  })

  useEffect(() => {
    fetchProposals()
  }, [])

  const handleOpenForm = () => {
    setShowForm(true)
    // Auto-show guide on first form open
    if (!hasOpenedFormBefore) {
      setShowGuide(true)
      setHasOpenedFormBefore(true)
    }
  }

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    try {
      const response = await fetch("/api/proposals")
      const data = await response.json()
      setProposals(data)
    } catch (error) {
      console.error("Failed to fetch proposals:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          title: formData.title,
          visibility: formData.visibility,
          canvasJson: {
            swot: formData.swot,
            smart: formData.smart,
          },
          swotJson: formData.swot,
        }),
      })
      if (response.ok) {
        setFormData({
          type: "idea",
          title: "",
          visibility: "ORG",
          swot: {
            strengths: "",
            weaknesses: "",
            opportunities: "",
            threats: "",
          },
          smart: {
            specific: "",
            measurable: "",
            achievable: "",
            relevant: "",
            timeBound: "",
          },
        })
        setShowForm(false)
        fetchProposals()
      }
    } catch (error) {
      console.error("Failed to submit proposal:", error)
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

  const getVisibilityIcon = (visibility: string) => {
    return visibility === "PRIVATE" ? (
      <Lock className="w-4 h-4" />
    ) : (
      <Eye className="w-4 h-4" />
    )
  }

  return (
    <EmployeeLayout>
      <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-white relative overflow-hidden">
        {/* Header with TAFSULA branding - Same as Homepage */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-10 h-10 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md"
              >
                <span className="font-bold text-white text-lg">T</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link href="/" className="flex flex-col">
                  <span className="font-bold text-2xl text-gray-900">TAFSULA</span>
                  <p className="text-xs text-gray-500 -mt-1">Team Compatibility</p>
                </Link>
              </motion.div>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  Home
                </Button>
              </Link>
              <Link href="/dashboard/employee">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                  Dashboard
                </Button>
              </Link>
              <UserNav />
            </nav>
          </div>
        </header>

        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
            animate={{ y: [0, -30, 0], x: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
            animate={{ y: [0, 30, 0], x: [0, -30, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex items-center justify-between"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 flex items-center gap-3">
                  <Lightbulb className="w-10 h-10 text-amber-500" />
                  💡 My Proposals
                </h1>
                <p className="text-lg text-gray-600">Share your ideas, events, and initiatives with the team</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenForm}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Proposal
              </motion.button>
            </motion.div>

            {/* Form Modal */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
                  onClick={() => setShowForm(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 my-8"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-3xl font-black text-gray-900">Create New Proposal</h2>
                        <p className="text-gray-600 text-sm mt-1">Build a structured proposal with SWOT & SMART</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowGuide(true)}
                          className="text-sm px-4 py-2 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2"
                        >
                          📖 Need Help?
                        </button>
                        <button
                          onClick={() => setShowForm(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleSubmitProposal} className="space-y-8">
                      {/* Proposal Type & Title */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Proposal Type</label>
                          <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          >
                            <option value="idea">💡 Idea</option>
                            <option value="event">📅 Event</option>
                            <option value="project">🎯 Project</option>
                            <option value="initiative">📈 Initiative</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Keep it clear and catchy"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      {/* SWOT Analysis Section */}
                      <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 p-6 md:p-8 rounded-2xl border-2 border-green-200">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                              🎯 SWOT Analysis
                            </h3>
                            <p className="text-sm text-gray-600 mt-2">
                              Be honest about your idea – what's great, what could improve, and what's around you
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowGuide(true)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-all whitespace-nowrap"
                          >
                            📖 What is this?
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Strengths */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative"
                          >
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                              💚 Strengths - What are we GOOD at?
                            </label>
                            <textarea
                              value={formData.swot.strengths}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  swot: { ...formData.swot, strengths: e.target.value },
                                })
                              }
                              placeholder="Our team has great experience... We know this community well..."
                              rows={5}
                              className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 resize-none bg-white"
                            />
                          </motion.div>

                          {/* Weaknesses */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="relative"
                          >
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                              💛 Weaknesses - What needs HELP?
                            </label>
                            <textarea
                              value={formData.swot.weaknesses}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  swot: { ...formData.swot, weaknesses: e.target.value },
                                })
                              }
                              placeholder="We need more budget... Our team is small... We lack experience in..."
                              rows={5}
                              className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200 resize-none bg-white"
                            />
                          </motion.div>

                          {/* Opportunities */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                          >
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                              💙 Opportunities - What LUCK do we have?
                            </label>
                            <textarea
                              value={formData.swot.opportunities}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  swot: { ...formData.swot, opportunities: e.target.value },
                                })
                              }
                              placeholder="People care about this topic now... We could partner with... There's a trend we can use..."
                              rows={5}
                              className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none bg-white"
                            />
                          </motion.div>

                          {/* Threats */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="relative"
                          >
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                              ❤️ Threats - What COULD GO WRONG?
                            </label>
                            <textarea
                              value={formData.swot.threats}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  swot: { ...formData.swot, threats: e.target.value },
                                })
                              }
                              placeholder="Tight deadline... Another group is doing this... Limited resources..."
                              rows={5}
                              className="w-full px-4 py-3 border-2 border-red-300 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 resize-none bg-white"
                            />
                          </motion.div>
                        </div>
                      </div>

                      {/* SMART Objectives Section */}
                      <div className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50 p-6 md:p-8 rounded-2xl border-2 border-purple-200">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                              🎪 SMART Objective
                            </h3>
                            <p className="text-sm text-gray-600 mt-2">
                              Describe your goal in simple, clear terms. Be specific about WHAT, HOW MUCH, WHEN & PROOF
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowGuide(true)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-all whitespace-nowrap"
                          >
                            📖 What is this?
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Specific */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                              ✓ Specific - What will you DO?
                            </label>
                            <input
                              type="text"
                              value={formData.smart.specific}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  smart: { ...formData.smart, specific: e.target.value },
                                })
                              }
                              placeholder="e.g., Organize 2 community clean-up events"
                              className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
                            />
                          </motion.div>

                          {/* Measurable */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                          >
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                              📊 Measurable - How MUCH or HOW MANY?
                            </label>
                            <input
                              type="text"
                              value={formData.smart.measurable}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  smart: { ...formData.smart, measurable: e.target.value },
                                })
                              }
                              placeholder="e.g., Reach 500 people, Increase by 25%, Complete 10 sessions"
                              className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
                            />
                          </motion.div>

                          {/* Achievable */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                              🎯 Achievable - Can we actually DO this?
                            </label>
                            <input
                              type="text"
                              value={formData.smart.achievable}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  smart: { ...formData.smart, achievable: e.target.value },
                                })
                              }
                              placeholder="e.g., We have 5 volunteers and existing tools"
                              className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
                            />
                          </motion.div>

                          {/* Relevant */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                          >
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                              🎪 Relevant - DOES IT FIT our mission?
                            </label>
                            <input
                              type="text"
                              value={formData.smart.relevant}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  smart: { ...formData.smart, relevant: e.target.value },
                                })
                              }
                              placeholder="e.g., This supports our sustainability goal"
                              className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
                            />
                          </motion.div>

                          {/* Time-bound */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="md:col-span-2"
                          >
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                              ⏰ Time-bound - WHEN will this happen?
                            </label>
                            <input
                              type="text"
                              value={formData.smart.timeBound}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  smart: { ...formData.smart, timeBound: e.target.value },
                                })
                              }
                              placeholder="e.g., By June 30, 2026 OR In 3 months OR Next quarter"
                              className="w-full px-4 py-3 border-2 border-indigo-300 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
                            />
                          </motion.div>
                        </div>
                      </div>

                      {/* Visibility */}
                      <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 p-6 md:p-8 rounded-2xl border-2 border-blue-200">
                        <label className="block text-lg font-bold text-gray-900 mb-4">👥 Who can see this?</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { value: "ORG", label: "👥 Organization", desc: "All members see it (if approved)" },
                            { value: "HR_ONLY", label: "🔐 HR Only", desc: "Only HR can review" },
                            { value: "PRIVATE", label: "🔒 Private", desc: "Just you can see it" },
                          ].map((opt) => (
                            <motion.button
                              key={opt.value}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setFormData({ ...formData, visibility: opt.value })}
                              className={`p-5 rounded-xl border-3 text-left transition-all font-semibold ${
                                formData.visibility === opt.value
                                  ? "border-blue-500 bg-blue-100 text-gray-900 shadow-md"
                                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                              }`}
                            >
                              <div className="text-lg font-black mb-1">{opt.label}</div>
                              <div className="text-xs text-gray-600">{opt.desc}</div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 justify-end border-t pt-8">
                        <Button
                          type="button"
                          onClick={() => setShowForm(false)}
                          variant="outline"
                          className="px-6 py-3"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 font-bold"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Submit Proposal
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Guide Modal */}
            <AnimatePresence>{showGuide && <ProposalGuide onClose={() => setShowGuide(false)} />}</AnimatePresence>

            {/* Proposals Grid */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-10 h-10 text-indigo-600" />
                </motion.div>
              </div>
            ) : proposals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-6">No proposals yet</p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                >
                  Create Your First Proposal
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                  {proposals.map((proposal, index) => (
                    <motion.div
                      key={proposal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {/* Left accent bar */}
                            <div
                              className="w-1 md:w-2 bg-gradient-to-b from-blue-500 to-indigo-600"
                            />

                            {/* Main content */}
                            <div className="flex-1 p-6 md:p-8">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                    {getTypeIcon(proposal.type)}
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                                      {proposal.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                      by {proposal.submittedBy?.name || "Unknown"}
                                    </p>
                                  </div>
                                </div>

                                <Badge
                                  className={`flex items-center gap-1 px-3 py-1.5 border ${getStatusColor(proposal.status)}`}
                                >
                                  {getStatusIcon(proposal.status)}
                                  {proposal.status.replace("_", " ").toUpperCase()}
                                </Badge>
                              </div>

                              {proposal.canvasJson?.description && (
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                  {proposal.canvasJson.description}
                                </p>
                              )}

                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  {getVisibilityIcon(proposal.visibility)}
                                  <span>{proposal.visibility === "PRIVATE" ? "Private" : "Organization"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>{proposal.comments?.length || 0} Comments</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(proposal.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Action button */}
                            <div className="p-6 md:p-8 flex items-center justify-center border-l border-gray-200">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setSelectedProposal(proposal)
                                  setShowDetails(true)
                                }}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg transition-shadow"
                              >
                                View Details
                              </motion.button>
                            </div>
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
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                        {getTypeIcon(selectedProposal.type)}
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-gray-900">{selectedProposal.title}</h2>
                        <p className="text-gray-600">
                          by {selectedProposal.submittedBy?.name || "Unknown"}
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

                  <div className="flex items-center gap-4 mb-6">
                    <Badge
                      className={`flex items-center gap-1 px-3 py-1.5 border ${getStatusColor(selectedProposal.status)}`}
                    >
                      {getStatusIcon(selectedProposal.status)}
                      {selectedProposal.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <Badge className="flex items-center gap-1 px-3 py-1.5 border bg-gray-100 text-gray-800">
                      {getVisibilityIcon(selectedProposal.visibility)}
                      {selectedProposal.visibility === "PRIVATE" ? "Private" : "Organization"}
                    </Badge>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedProposal.canvasJson?.description || "No description provided"}
                    </p>
                  </div>

                  {selectedProposal.reviewer && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                      <p className="font-bold text-green-900 mb-2">HR Response:</p>
                      <p className="text-green-800">Reviewed by {selectedProposal.reviewer?.name}</p>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end">
                    <Button
                      onClick={() => setShowDetails(false)}
                      variant="outline"
                      className="px-6 py-3"
                    >
                      Close
                    </Button>
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
