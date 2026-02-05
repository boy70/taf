"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"

import EmployeeLayout from "../../../../components/layout/employee-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { Progress } from "../../../../components/ui/progress"
import {
  Zap,
  Sparkles,
  Heart,
  Brain,
  TrendingUp,
  Star,
  Lightbulb,
  AlertTriangle,
  MessageCircle,
  Users,
  Target,
  BookOpen,
  Compass,
  Map,
  Crown,
  Shield,
  Flame,
  ChevronDown,
  ChevronUp,
  Trophy,
  Radar,
} from "lucide-react"

export default function ResultsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [result, setResult] = useState<any>(null)
  const [insight, setInsight] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentChapter, setCurrentChapter] = useState(0)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    if (status === "authenticated") {
      fetchResults()
    }
  }, [status, router])

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/results/${session?.user.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch results")
      }
      const data = await response.json()
      setResult(data.result)
      setInsight(data.insight)
      setIsLoading(false)
    } catch (error) {
      setError("Failed to load your results. Please try again.")
      setIsLoading(false)
    }
  }

  const getPersonalityStory = (type: "D" | "I" | "S" | "C") => {
    const stories: Record<"D" | "I" | "S" | "C", any> = {
      D: {
        title: "The Trailblazer",
        subtitle: "The Architect of Change",
        icon: Crown,
        color: "#e53e3e",
        colorGradient: "from-red-500 to-orange-500",
        accentColor: "bg-red-500",
        borderColor: "border-red-200",
        textColor: "text-red-700",
        prologue: {
          title: "Your Origin Story",
          content:
            "Your story is one of boldness and determination. You are driven by the desire to achieve, to lead, and to make things happen. Like a blazing comet crossing the night sky, you bring energy, direction, and purpose wherever you go.\n\nYou see challenges as opportunities. While others hesitate, you charge forward. Your confidence isn't arrogance—it's the deep knowing that you have what it takes to succeed and move mountains.",
        },
        chapters: [
          {
            id: "fire",
            title: "The Fire Within",
            icon: Flame,
            content:
              "Your natural confidence and competitive spirit fuel your drive to succeed. This inner fire keeps you motivated even when obstacles appear insurmountable.\n\nYou're not afraid of challenges—you embrace them as opportunities to prove your worth and move forward. Your determination is contagious. When people are around you, they feel the urgency to act, to create, to achieve.",
          },
          {
            id: "decision",
            title: "Decision Maker",
            icon: Target,
            content:
              "You make decisions quickly and decisively. While others may still be analyzing options, you've already identified the best path forward and are moving with purpose.\n\nThis directness is both a tremendous strength and something to be mindful of in team settings. Your ability to see through complexity and make bold calls is what propels organizations forward. Yet, learning to explain your reasoning to others can transform you from a good leader into a great one.",
          },
          {
            id: "leadership",
            title: "Natural Leader",
            icon: Zap,
            content:
              "People naturally turn to you for direction and answers. You have the ability to inspire action and move teams toward goals with unwavering focus and determination.\n\nYour leadership style is straightforward and results-focused. You set clear expectations, hold people accountable, and celebrate wins. The legacy you leave is one of progress, achievement, and the knowledge that anything is possible when you refuse to back down.",
          },
        ],
        traits: ["Direct Communication", "Results-Driven", "Decisive", "Confident", "Competitive", "Bold"],
        superpower:
          "Your superpower is the ability to see what needs to be done and have the courage and determination to do it. You move mountains through sheer will and vision.",
      },
      I: {
        title: "The Communicator",
        subtitle: "The Connector of Hearts",
        icon: Sparkles,
        color: "#ecc94b",
        colorGradient: "from-yellow-400 to-orange-400",
        accentColor: "bg-yellow-400",
        borderColor: "border-yellow-200",
        textColor: "text-yellow-700",
        prologue: {
          title: "Your Origin Story",
          content:
            "Your story is one of connection and inspiration. You bring warmth, enthusiasm, and optimism wherever you go. Like a bright flame that draws people near, you have the gift of making others feel valued and energized.\n\nYou see life through the lens of relationships and possibilities. People are energized by your presence. Your natural enthusiasm is infectious, and your ability to find the silver lining in any situation makes you a beacon of hope for those around you.",
        },
        chapters: [
          {
            id: "enthusiasm",
            title: "Infectious Enthusiasm",
            icon: Heart,
            content:
              "Your positive energy is contagious. You see possibilities where others see obstacles, and your optimism inspires those around you to believe in better outcomes.\n\nYou light up rooms. Your genuine excitement about ideas, projects, and people draws others in. This isn't superficial positivity—it's a deep belief that life is full of opportunities and connections waiting to be made.",
          },
          {
            id: "communication",
            title: "Master Communicator",
            icon: MessageCircle,
            content:
              "You have a natural gift for bringing people together through words and genuine interest. Your ability to listen and connect makes others feel heard and valued.\n\nYou understand that communication is about more than words—it's about making people feel seen. You remember details, you ask follow-up questions, and you celebrate others' wins as if they were your own. This emotional intelligence is what makes you a trusted confidant and beloved team member.",
          },
          {
            id: "creativity",
            title: "Creative Innovator",
            icon: Lightbulb,
            content:
              "Your imaginative mind generates new ideas and sees connections others miss. You're not bound by convention—you thrive in environments where creativity and innovation are valued.\n\nYour ideas flow like a river. You brainstorm energetically, combine seemingly unrelated concepts into brilliant solutions, and inspire others to think beyond limitations. Your creative spark ignites innovation throughout entire organizations.",
          },
        ],
        traits: ["Enthusiastic", "Persuasive", "Creative", "Optimistic", "Relationship-Focused", "Inspiring"],
        superpower:
          "Your superpower is the ability to inspire people and bring them together around a shared vision. You make people feel alive, valued, and capable of anything.",
      },
      S: {
        title: "The Harmonizer",
        subtitle: "The Steady Hand",
        icon: Shield,
        color: "#48bb78",
        colorGradient: "from-green-500 to-emerald-500",
        accentColor: "bg-green-500",
        borderColor: "border-green-200",
        textColor: "text-green-700",
        prologue: {
          title: "Your Origin Story",
          content:
            "Your story is one of stability and compassion. You are the calm in the storm, the steady presence that others can rely on. Like a strong foundation beneath a building, you provide stability and support to those around you.\n\nYou understand that true strength lies in being present for others. Your consistency is a gift. People know they can count on you, and that reliability forms the bedrock of trust that holds teams and relationships together.",
        },
        chapters: [
          {
            id: "loyalty",
            title: "Devoted Loyalist",
            icon: Users,
            content:
              "Your loyalty and dedication are unwavering. You build deep, meaningful relationships and are committed to supporting your team through both good times and challenges.\n\nWhen you commit to something or someone, you're all in. Your loyalty isn't transactional—it comes from genuine care. You're the friend who remembers the hard times and shows up even when it's inconvenient.",
          },
          {
            id: "patience",
            title: "Patient Listener",
            icon: Brain,
            content:
              "You listen with genuine interest and patience. People feel safe opening up to you because they know you won't judge them. Your empathy is a gift that strengthens every relationship.\n\nYou create safe spaces where people can be vulnerable. Your willingness to listen without interrupting, to understand without criticizing, and to support without controlling—these are rare gifts in today's world.",
          },
          {
            id: "harmony",
            title: "Harmony Builder",
            icon: TrendingUp,
            content:
              "You have a natural ability to create peaceful environments and resolve conflicts with grace. You see all perspectives and work to find solutions that benefit everyone.\n\nYou're the peacemaker, the mediator, the one who brings balance. Where there's discord, you bring understanding. Where there's conflict, you find common ground. Your gift for harmony makes organizations healthier and relationships stronger.",
          },
        ],
        traits: ["Patient", "Loyal", "Supportive", "Reliable", "Empathetic", "Calm"],
        superpower:
          "Your superpower is the ability to create stability and trust. You make people feel safe, supported, and valued, building foundations that last.",
      },
      C: {
        title: "The Analyst",
        subtitle: "The Seeker of Truth",
        icon: Radar,
        color: "#3182ce",
        colorGradient: "from-blue-500 to-indigo-500",
        accentColor: "bg-blue-500",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        prologue: {
          title: "Your Origin Story",
          content:
            "Your story is one of precision and depth. You are driven by the desire to understand, to analyze, and to ensure excellence. Like a master craftsperson, you pay attention to every detail and refuse to settle for anything less than your best.\n\nYou see the world through the lens of systems and quality. Where others see chaos, you see patterns waiting to be understood. Your thoroughness and commitment to excellence create work that stands the test of time.",
        },
        chapters: [
          {
            id: "analytical",
            title: "Analytical Mind",
            icon: Star,
            content:
              "Your ability to break down complex problems into manageable parts is remarkable. You see patterns others miss and can identify root causes with precision.\n\nYour analytical approach to challenges is a superpower. You don't accept surface-level explanations or quick fixes. You dig deeper, question assumptions, and find the elegant solutions that address the real problem, not just the symptoms.",
          },
          {
            id: "quality",
            title: "Quality Guardian",
            icon: Trophy,
            content:
              "You have high standards and won't compromise on quality. Your attention to detail ensures that work meets rigorous standards and stands up to scrutiny.\n\nYou're the quality control, the detail detective, the one who catches what others miss. Your meticulous nature isn't perfectionism for its own sake—it's a commitment to excellence and respect for the impact of your work on others.",
          },
          {
            id: "reflection",
            title: "Deep Thinker",
            icon: Compass,
            content:
              "You take time to reflect before acting, ensuring decisions are well-considered. Your thoughtfulness and prudence lead to solutions that are both effective and sustainable.\n\nYou're comfortable with silence and solitude. You need time to process, analyze, and think things through completely. This reflective nature gives you wisdom and insight that impulsive people often lack.",
          },
        ],
        traits: ["Analytical", "Detail-Oriented", "Systematic", "Precise", "Thoughtful", "Quality-Focused"],
        superpower:
          "Your superpower is the ability to see through complexity to find truth and create excellence. You build systems and solutions that last.",
      },
    }
    return stories[type]
  }

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="flex flex-col items-center justify-center min-h-screen px-6 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" animate={{ y: [0, -20, 0], x: [0, 20, 0] }} transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }} />
              <motion.div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" animate={{ y: [0, 20, 0], x: [0, -20, 0] }} transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }} />
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              className="text-center relative z-10"
            >
              {/* Animated loading circle */}
              <div className="w-24 h-24 mx-auto mb-8 relative">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 border-r-pink-400"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-400 border-l-purple-400"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }} className="text-3xl">✨</motion.div>
                </div>
              </div>

              <motion.h2 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-3" animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
                Unlocking Your Story...
              </motion.h2>
              <p className="text-lg text-purple-200 mb-6">Crafting your personalized personality journey</p>

              <div className="flex gap-2 justify-center mb-6">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div key={i} className="h-2 w-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" animate={{ scaleX: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }} />
                ))}
              </div>

              <p className="text-sm text-purple-300">Discovering your unique personality constellation...</p>
            </motion.div>
          </div>
        </div>
      </EmployeeLayout>
    )
  }

  if (error || !result) {
    return (
      <EmployeeLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 flex items-center justify-center px-6 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" animate={{ y: [0, -30, 0] }} transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }} />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md w-full relative z-10">
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
              <CardHeader className="text-center pt-8">
                <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }} className="text-6xl mx-auto mb-4">
                  🚀
                </motion.div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Ready to Discover?</CardTitle>
                <CardDescription className="text-base mt-3">
                  {error || "Unlock your personality story and discover what makes you unique"}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4 pb-8">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={() => router.push("/test")} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg py-6 rounded-lg shadow-lg">
                    Begin Your Journey ✨
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={fetchResults} variant="outline" className="w-full border-2 border-orange-400 text-orange-600 hover:bg-orange-50 font-bold text-base py-6 rounded-lg">
                    Try Again
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </EmployeeLayout>
    )
  }

  const story = getPersonalityStory(result.dominantType as "D" | "I" | "S" | "C")
  const StoryIcon = story.icon

  return (
    <EmployeeLayout>
      <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10" animate={{ y: [0, -30, 0], x: [0, 30, 0] }} transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }} />
          <motion.div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10" animate={{ y: [0, 30, 0], x: [0, -30, 0] }} transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }} />
        </div>

        <div className="relative z-10">
        {/* Story Book Cover */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="px-6 sm:px-8 lg:px-12 py-16"
        >
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden border-0 shadow-2xl relative group">
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="p-0">
                <div
                  className="relative h-72 flex items-center justify-center text-white overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${story.color}dd, ${story.color}aa)`,
                  }}
                >
                  {/* Animated background pattern */}
                  <motion.div className="absolute inset-0 opacity-20" animate={{ backgroundPosition: ["0px 0px", "50px 50px"] }} transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  <div className="relative text-center z-10 px-6">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-6xl mb-6 drop-shadow-xl">
                      <StoryIcon className="h-20 w-20 mx-auto drop-shadow-lg" />
                    </motion.div>
                    
                    <motion.h1 className="text-5xl md:text-6xl font-black mb-3 drop-shadow-lg leading-tight" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                      {story.title}
                    </motion.h1>
                    
                    <motion.p className="text-2xl md:text-3xl font-semibold opacity-95 drop-shadow mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                      {story.subtitle}
                    </motion.p>
                    
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex gap-3 justify-center flex-wrap">
                      <Badge className="text-lg px-5 py-2.5 bg-white/25 text-white border-white/40 border-2 backdrop-blur font-bold">
                        Type {result.dominantType}
                      </Badge>
                      <Badge className="text-lg px-5 py-2.5 bg-white/25 text-white border-white/40 border-2 backdrop-blur font-bold">
                        ⭐ {Math.max(Math.round(result.dScore), Math.round(result.iScore), Math.round(result.sScore), Math.round(result.cScore))}%
                      </Badge>
                    </motion.div>
                  </div>
                </div>

                <div className="p-8 md:p-10 bg-gradient-to-br from-white via-white to-gray-50">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${story.color}20` }}>
                      <BookOpen className="h-5 w-5" style={{ color: story.color }} />
                    </div>
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">📖 Your Personal Story</span>
                  </motion.div>

                  <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
                    {story.prologue.title}
                  </motion.h2>
                  
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="space-y-6">
                    {story.prologue.content.split("\n\n").map((paragraph: string, index: number) => (
                      <motion.p key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + index * 0.1 }} className="text-lg text-gray-700 leading-relaxed font-medium">
                        {paragraph}
                      </motion.p>
                    ))}
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Journey of Discovery */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="px-6 sm:px-8 lg:px-12 py-16"
        >
          <div className="max-w-5xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
              <CardHeader className="pb-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br" style={{ background: `linear-gradient(135deg, ${story.color}, ${story.color}aa)` }}>
                    <Map className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-black text-gray-900">🗺️ Your Journey</CardTitle>
                </motion.div>
                <CardDescription className="text-base text-gray-600">Navigate through the chapters of your unique story</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {story.chapters.map((chapter: any, index: number) => {
                    const Icon = chapter.icon
                    return (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentChapter(index)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-5 rounded-xl border-2 text-left transition-all duration-300 group ${
                          currentChapter === index
                            ? `shadow-lg`
                            : "hover:shadow-md"
                        }`}
                        style={{
                          borderColor: currentChapter === index ? story.color : "#e5e7eb",
                          backgroundColor: currentChapter === index ? `${story.color}08` : "#f9fafb",
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: story.color }}
                          >
                            {Icon && <Icon className="h-7 w-7" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-800">{chapter.title}</h3>
                            <p className="text-sm text-gray-500 group-hover:text-gray-600">Chapter {index + 1} of {story.chapters.length}</p>
                          </div>
                          {currentChapter === index && (
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }} className="text-2xl">✨</motion.div>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Current Chapter */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="px-6 sm:px-8 lg:px-12 py-12"
        >
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapter}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-white via-white to-gray-50 pb-6">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: story.color }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <StoryIcon className="h-7 w-7" />
                      </motion.div>
                      <div className="flex-1">
                        <CardTitle className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                          {story.chapters[currentChapter].title}
                        </CardTitle>
                        <motion.div className="flex items-center gap-2 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <div className="h-2 flex gap-1">
                            {[...Array(story.chapters.length)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="h-2 rounded-full bg-gray-300"
                                style={{ width: currentChapter === i ? "24px" : "8px", backgroundColor: currentChapter === i ? story.color : "#d1d5db" }}
                                layoutId="indicator"
                              />
                            ))}
                          </div>
                          <CardDescription className="font-semibold text-gray-600 ml-2">
                            Chapter {currentChapter + 1} of {story.chapters.length}
                          </CardDescription>
                        </motion.div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="prose prose-lg max-w-none">
                      {story.chapters[currentChapter].content.split("\n\n").map((paragraph: string, index: number) => (
                        <p key={index} className="text-gray-700 leading-relaxed mb-6">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                        disabled={currentChapter === 0}
                        className="flex items-center gap-2"
                      >
                        <ChevronUp className="h-4 w-4" />
                        Previous Chapter
                      </Button>

                      <Button
                        onClick={() =>
                          setCurrentChapter(Math.min(story.chapters.length - 1, currentChapter + 1))
                        }
                        disabled={currentChapter === story.chapters.length - 1}
                        className="flex items-center gap-2 text-white"
                        style={{ backgroundColor: story.color }}
                      >
                        Next Chapter
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>

        {/* AI Insight */}
        {insight && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="px-6 sm:px-8 lg:px-12 py-12"
          >
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Your Personal Oracle
                  </CardTitle>
                  <CardDescription>A personalized insight crafted specifically for your unique personality pattern</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-lg text-gray-800 leading-relaxed italic font-medium">"{insight.text}"</p>
                        <p className="text-sm text-purple-600 mt-3 font-medium">
                          — Generated by AI analysis of your unique response patterns
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        )}

        {/* Signature Strengths */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="px-6 sm:px-8 lg:px-12 py-16"
        >
          <div className="max-w-5xl mx-auto">
            <Card className="border-0 shadow-2xl">
              <CardHeader className="pb-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-black text-gray-900">Your Signature Strengths</CardTitle>
                </motion.div>
                <CardDescription className="text-base text-gray-600">The core traits that define your unique approach to life and work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                  {story.traits.map((trait: string, index: number) => (
                    <motion.div
                      key={trait}
                      initial={{ opacity: 0, y: 20, rotate: -5 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index, type: "spring" }}
                      whileHover={{ y: -8, scale: 1.05 }}
                      className="text-center p-7 rounded-2xl bg-gradient-to-br from-white via-white to-gray-50 border-2 border-gray-100 hover:border-gray-300 shadow-md hover:shadow-xl transition-all duration-300 cursor-default group"
                    >
                      <div className="relative">
                        <motion.div
                          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: story.color }}
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
                        >
                          <Star className="h-8 w-8" />
                        </motion.div>
                      </div>
                      <h3 className="font-black text-lg text-gray-900 mb-3">{trait}</h3>
                      <motion.div className="w-14 h-0.5 rounded-full mx-auto" style={{ backgroundColor: story.color }} layoutId={`divider-${index}`} />
                    </motion.div>
                  ))}
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="p-8 bg-gradient-to-br from-purple-100 via-blue-100 to-purple-100 rounded-2xl border-2 border-purple-300 shadow-lg relative overflow-hidden group">
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-start space-x-4">
                      <motion.div animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }} className="flex-shrink-0">
                        <Lightbulb className="h-8 w-8 text-purple-600 mt-1" />
                      </motion.div>
                      <div>
                        <h4 className="font-black text-xl text-gray-900 mb-3">✨ Your Superpower</h4>
                        <p className="text-gray-800 text-lg leading-relaxed font-semibold">\"{story.superpower}\"</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Personality Constellation */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="px-6 sm:px-8 lg:px-12 py-12"
        >
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Your Personality Constellation
                </CardTitle>
                <CardDescription>
                  The unique blend of traits that creates your distinctive personality pattern
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    {
                      type: "D",
                      score: Math.round(result.dScore),
                      color: "#e53e3e",
                      icon: Zap,
                      label: "Dominance",
                      description: "Drive & Determination",
                    },
                    {
                      type: "I",
                      score: Math.round(result.iScore),
                      color: "#ecc94b",
                      icon: Sparkles,
                      label: "Influence",
                      description: "Inspiration & Interaction",
                    },
                    {
                      type: "S",
                      score: Math.round(result.sScore),
                      color: "#48bb78",
                      icon: Heart,
                      label: "Steadiness",
                      description: "Stability & Support",
                    },
                    {
                      type: "C",
                      score: Math.round(result.cScore),
                      color: "#3182ce",
                      icon: Brain,
                      label: "Conscientiousness",
                      description: "Precision & Quality",
                    },
                  ].map((item, index) => {
                    const Icon = item.icon
                    const isHighest = item.type === result.dominantType

                    return (
                      <motion.div
                        key={item.type}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className={`text-center p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                          isHighest
                            ? "border-gray-400 bg-gradient-to-br from-gray-50 to-white shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg"
                          style={{ backgroundColor: item.color }}
                        >
                          <Icon className="h-8 w-8" />
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 mb-1">{item.type}</h3>
                        <p className="text-sm font-medium text-gray-600 mb-2">{item.label}</p>
                        <p className="text-xs text-gray-500 mb-4">{item.description}</p>
                        <div className="space-y-3">
                          <div className="text-3xl font-bold" style={{ color: item.color }}>
                            {item.score}%
                          </div>
                          <Progress value={item.score} className="h-3 bg-gray-100" />
                        </div>
                        {isHighest && (
                          <Badge variant="secondary" className="mt-3 text-xs font-medium bg-amber-100 text-amber-800">
                            ⭐ Dominant
                          </Badge>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="px-6 sm:px-8 lg:px-12 py-12"
        >
          <div className="max-w-4xl mx-auto">
            <div
              className={`rounded-xl bg-gradient-to-r ${story.colorGradient} p-8 text-white shadow-lg text-center`}
            >
              <h3 className="text-2xl font-bold mb-3">Ready to Explore More?</h3>
              <p className="mb-6 text-white/90">
                Your personality story is unique. Share it with your team or retake the assessment to see how you evolve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold">Share My Story</Button>
                <Button
                  onClick={() => router.push("/test")}
                  className="bg-white/20 text-white hover:bg-white/30 border border-white/30 font-bold"
                >
                  Retake Assessment
                </Button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer spacing */}
        <div className="h-12" />
        </div>
      </div>
    </EmployeeLayout>
  )
}
