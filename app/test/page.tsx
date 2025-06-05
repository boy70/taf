"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../..//components/ui/progress"
import { Badge } from "../../components/ui/badge"
import {
  Brain,
  Clock,
  Target,
  Lightbulb,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  Zap,
  Sparkles,
  Heart,
  AlertTriangle,
  RotateCcw,
} from "lucide-react"
import { UserNav } from "components/user-nav"
import { cn } from "../../lib/utils"

interface Question {
  id: string
  questionText: string
  type: "AGREEMENT_SCALE" | "MULTIPLE_CHOICE"
  discMapping: {
    [key: string]: {
      d?: number
      i?: number
      s?: number
      c?: number
    }
  }
}

interface Answer {
  questionId: string
  agreementLevel: number
}

const agreementOptions = [
  { value: 1, label: "Strongly Disagree", color: "bg-red-500", description: "This doesn't describe me at all" },
  { value: 2, label: "Disagree", color: "bg-red-300", description: "This rarely describes me" },
  { value: 3, label: "Neutral", color: "bg-gray-400", description: "I'm neutral about this" },
  { value: 4, label: "Agree", color: "bg-green-300", description: "This often describes me" },
  { value: 5, label: "Strongly Agree", color: "bg-green-500", description: "This describes me perfectly" },
]

export default function TestPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (hasStarted && !isPaused && !isSubmitting) {
      interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [hasStarted, isPaused, isSubmitting])

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/test/questions")

      if (!response.ok) {
        throw new Error("Failed to fetch questions")
      }

      const data = await response.json()

      // Limit to 15 questions as requested
      const limitedQuestions = data.slice(0, 15)
      setQuestions(limitedQuestions)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching questions:", error)
      setError("Failed to load questions. Please try again.")
      setIsLoading(false)
    }
  }

  const handleAnswer = (selectedOption: number) => {
    if (!questions[currentQuestion]) return

    const questionId = questions[currentQuestion].id
    const agreementLevel = selectedOption

    // Update answers array
    const newAnswers = [...answers]
    const existingAnswerIndex = newAnswers.findIndex((a) => a.questionId === questionId)

    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex].agreementLevel = agreementLevel
    } else {
      newAnswers.push({ questionId, agreementLevel })
    }

    setAnswers(newAnswers)

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      }
    }, 500)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (answers.length < questions.length) {
      setError("Please answer all questions before submitting.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Transform answers to match server expectations
      const serverAnswers = answers.map(({ questionId, agreementLevel }) => ({
        questionId,
        agreementLevel
      }))

      const response = await fetch("/api/test/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: serverAnswers }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit test")
      }

      const data = await response.json()

      // Navigate to results
      router.push("/test/results")
    } catch (error) {
      console.error("Error submitting test:", error)
      setError(error instanceof Error ? error.message : "Failed to submit test. Please try again.")
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getAnsweredCount = () => answers.length
  const getCompletionPercentage = () => ((currentQuestion + 1) / questions.length) * 100
  const getCurrentAnswer = () => {
    if (!questions[currentQuestion]) return null
    return answers.find((a) => a.questionId === questions[currentQuestion].id)?.agreementLevel || null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 to-blue-500 rounded-full"></div>
              <span className="font-semibold text-gray-900">Personality Assessment</span>
            </div>
            <UserNav />
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[80vh] px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 mx-auto mb-6">
              <motion.div
                className="w-full h-full border-4 border-gray-300 border-t-blue-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Preparing Your Assessment</h2>
            <p className="text-gray-600 mb-4">
              We're loading your personalized questions that will reveal the unique patterns of your personality...
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Brain className="h-4 w-4" />
              <span>Scientifically validated questions</span>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 flex items-center justify-center px-6">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <CardTitle>Unable to Load Questions</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{error}</p>
            <Button onClick={fetchQuestions} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 to-blue-500 rounded-full"></div>
              <span className="font-semibold text-gray-900">Personality Assessment</span>
            </div>
            <UserNav />
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Discover Your{" "}
              <span className="bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 to-blue-500 bg-clip-text text-transparent">
                True Colors
              </span>
              ?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              You're about to embark on a fascinating journey of self-discovery. This scientifically-backed assessment
              will reveal the unique personality patterns that make you who you are.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    What to Expect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Quick & Focused</h4>
                      <p className="text-gray-600 text-sm">Just {questions.length} carefully selected statements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Agreement Scale</h4>
                      <p className="text-gray-600 text-sm">Rate how much you agree with each statement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Instant Results</h4>
                      <p className="text-gray-600 text-sm">Get your detailed personality profile immediately</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    You'll Discover
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-red-500" />
                    <span className="text-gray-700">Your natural leadership style</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-700">How you communicate best</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Your ideal work environment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">Your decision-making patterns</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-8">
                <Lightbulb className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Pro Tip for Best Results</h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  Answer based on your natural instincts and how you typically behave, not how you think you should
                  behave. Be honest about your preferences and tendencies for the most accurate results!
                </p>
                <Button size="lg" onClick={() => setHasStarted(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Play className="mr-2 h-4 w-4" />
                  Start My Assessment
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  const currentQuestionData = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentAnswer = getCurrentAnswer()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 to-blue-500 rounded-full"></div>
              <div>
                <span className="font-semibold text-gray-900">Personality Assessment</span>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span>•</span>
                  <span>{formatTime(timeSpent)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <UserNav />
            </div>
          </div>
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{Math.round(progress)}% complete</span>
              <span>
                {getAnsweredCount()}/{questions.length} answered
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        Question {currentQuestion + 1}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                      {currentQuestionData.questionText}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-gray-600 mb-6">How much do you agree with this statement?</p>

                    {/* Agreement Scale Circles */}
                    <div className="flex justify-center items-center space-x-4 md:space-x-8 mb-6">
                      {agreementOptions.map((option, index) => (
                        <motion.button
                          key={option.value}
                          onClick={() => handleAnswer(option.value)}
                          onMouseEnter={() => setHoveredOption(option.value.toString())}
                          onMouseLeave={() => setHoveredOption(null)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "relative w-12 h-12 md:w-16 md:h-16 rounded-full border-4 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300",
                            currentAnswer === option.value
                              ? `${option.color} border-gray-800 shadow-lg`
                              : "bg-gray-200 border-gray-300 hover:border-gray-400",
                          )}
                        >
                          {currentAnswer === option.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8 text-white" />
                            </motion.div>
                          )}

                          {/* Tooltip */}
                          <AnimatePresence>
                            {hoveredOption === option.value.toString() && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10"
                              >
                                {option.label}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      ))}
                    </div>

                    {/* Labels */}
                    <div className="flex justify-between text-xs text-gray-500 max-w-md mx-auto">
                      <span>Strongly Disagree</span>
                      <span>Neutral</span>
                      <span>Strongly Agree</span>
                    </div>

                    {/* Current Selection Display */}
                    {currentAnswer && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
                      >
                        <p className="text-blue-800 font-medium">
                          {agreementOptions.find((opt) => opt.value === currentAnswer)?.label}
                        </p>
                        <p className="text-blue-600 text-sm">
                          {agreementOptions.find((opt) => opt.value === currentAnswer)?.description}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-red-700 text-sm">{error}</p>
                  </motion.div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {currentQuestion < questions.length - 1 ? (
                    <Button
                      onClick={handleNext}
                      disabled={!currentAnswer}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || answers.length < questions.length}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </motion.div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Complete Assessment
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-gray-50 to-white border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">You're doing great!</h3>
                  <p className="text-gray-600 text-sm">
                    {currentQuestion < questions.length - 1
                      ? `Just ${questions.length - currentQuestion - 1} more questions to go`
                      : "Ready to see your results!"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
                  <div className="text-xs text-gray-500">Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
