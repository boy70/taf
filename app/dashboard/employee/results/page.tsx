"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

import { DashboardLayout } from "../../../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Button } from "../../../../components/ui/button"
import { UserRole } from "../../../../types/user"

export default function ResultsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [result, setResult] = useState<any>(null)
  const [insight, setInsight] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (isLoading) {
    return (
      <DashboardLayout role={(session?.user.role || "EMPLOYEE") as UserRole}>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !result) {
    return (
      <DashboardLayout role={(session?.user.role || "EMPLOYEE") as UserRole}>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || "No results found. Have you taken the DISC test?"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/test")}>Take the Test</Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  const getTypeDescription = (type: string) => {
    switch (type) {
      case "D":
        return "Dominance: Direct, Results-oriented, Firm, Strong-willed, Forceful"
      case "I":
        return "Influence: Outgoing, Enthusiastic, Optimistic, High-spirited, Lively"
      case "S":
        return "Steadiness: Even-tempered, Accommodating, Patient, Humble, Tactful"
      case "C":
        return "Conscientiousness: Analytical, Reserved, Precise, Private, Systematic"
      default:
        return ""
    }
  }

  return (
    <DashboardLayout role={(session?.user.role || "EMPLOYEE") as UserRole}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your DISC Results</h1>
          <Button onClick={() => router.push("/test")}>Retake Test</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Dominant Type: {result.dominantType}</CardTitle>
            <CardDescription>{getTypeDescription(result.dominantType)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold text-red-500">D</div>
                <div className="text-lg">{Math.round(result.dScore)}%</div>
                <div className="h-24 w-full bg-gray-200 mt-2">
                  <div className="bg-red-500 h-full" style={{ height: `${result.dScore}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold text-yellow-500">I</div>
                <div className="text-lg">{Math.round(result.iScore)}%</div>
                <div className="h-24 w-full bg-gray-200 mt-2">
                  <div className="bg-yellow-500 h-full" style={{ height: `${result.iScore}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold text-green-500">S</div>
                <div className="text-lg">{Math.round(result.sScore)}%</div>
                <div className="h-24 w-full bg-gray-200 mt-2">
                  <div className="bg-green-500 h-full" style={{ height: `${result.sScore}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold text-blue-500">C</div>
                <div className="text-lg">{Math.round(result.cScore)}%</div>
                <div className="h-24 w-full bg-gray-200 mt-2">
                  <div className="bg-blue-500 h-full" style={{ height: `${result.cScore}%` }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Work Profile</TabsTrigger>
            <TabsTrigger value="strengths">Strengths & Challenges</TabsTrigger>
            <TabsTrigger value="teamwork">Teamwork Style</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Work Profile</CardTitle>
                <CardDescription>How you approach work and communication</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {insight ? (
                    <div className="whitespace-pre-line">{insight.text}</div>
                  ) : (
                    <p>No insight available. Please retake the test.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="strengths" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Strengths & Challenges</CardTitle>
                <CardDescription>Your natural talents and potential growth areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Strengths</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {result.dominantType === "D" && (
                        <>
                          <li>Direct and decisive</li>
                          <li>Results-oriented</li>
                          <li>Strong problem-solving skills</li>
                          <li>Willing to take risks</li>
                          <li>Embraces challenges</li>
                        </>
                      )}
                      {result.dominantType === "I" && (
                        <>
                          <li>Enthusiastic and optimistic</li>
                          <li>Persuasive communicator</li>
                          <li>Creative and innovative</li>
                          <li>Builds relationships easily</li>
                          <li>Motivates and inspires others</li>
                        </>
                      )}
                      {result.dominantType === "S" && (
                        <>
                          <li>Patient and supportive</li>
                          <li>Reliable team player</li>
                          <li>Good listener</li>
                          <li>Creates harmony</li>
                          <li>Follows through on commitments</li>
                        </>
                      )}
                      {result.dominantType === "C" && (
                        <>
                          <li>Analytical and detail-oriented</li>
                          <li>High standards for quality</li>
                          <li>Systematic approach</li>
                          <li>Thorough research skills</li>
                          <li>Logical problem-solving</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Growth Areas</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {result.dominantType === "D" && (
                        <>
                          <li>May appear too forceful or impatient</li>
                          <li>Could overlook details</li>
                          <li>Might not listen well to others</li>
                          <li>Can be perceived as insensitive</li>
                          <li>May struggle with routine tasks</li>
                        </>
                      )}
                      {result.dominantType === "I" && (
                        <>
                          <li>May talk more than listen</li>
                          <li>Could lack follow-through</li>
                          <li>Might be disorganized</li>
                          <li>Can be impulsive</li>
                          <li>May avoid detailed work</li>
                        </>
                      )}
                      {result.dominantType === "S" && (
                        <>
                          <li>May resist change</li>
                          <li>Could be too accommodating</li>
                          <li>Might avoid conflict</li>
                          <li>Can be indecisive</li>
                          <li>May take criticism personally</li>
                        </>
                      )}
                      {result.dominantType === "C" && (
                        <>
                          <li>May be overly critical</li>
                          <li>Could be too perfectionistic</li>
                          <li>Might avoid social interaction</li>
                          <li>Can be slow to make decisions</li>
                          <li>May struggle with ambiguity</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="teamwork" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Teamwork Style</CardTitle>
                <CardDescription>How you collaborate with others</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Communication Style</h3>
                    <p>
                      {result.dominantType === "D" &&
                        "Direct, straightforward, and to the point. You focus on results and may come across as blunt."}
                      {result.dominantType === "I" &&
                        "Enthusiastic, expressive, and people-focused. You enjoy storytelling and building rapport."}
                      {result.dominantType === "S" &&
                        "Patient, thoughtful, and diplomatic. You listen well and avoid conflict when possible."}
                      {result.dominantType === "C" &&
                        "Precise, logical, and fact-based. You prefer written communication with clear details."}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Ideal Team Role</h3>
                    <p>
                      {result.dominantType === "D" &&
                        "Leader, decision-maker, or project driver who keeps the team focused on goals and results."}
                      {result.dominantType === "I" &&
                        "Motivator, spokesperson, or creative contributor who generates enthusiasm and new ideas."}
                      {result.dominantType === "S" &&
                        "Mediator, supporter, or implementer who creates stability and follows through on plans."}
                      {result.dominantType === "C" &&
                        "Analyst, quality controller, or researcher who ensures accuracy and thoroughness."}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Working with Others</h3>
                    <p>
                      {result.dominantType === "D" &&
                        "You work best with people who are direct, efficient, and focused on results. You may clash with those who are indecisive or overly cautious."}
                      {result.dominantType === "I" &&
                        "You work best with people who are positive, collaborative, and open to new ideas. You may find it challenging to work with those who are critical or reserved."}
                      {result.dominantType === "S" &&
                        "You work best with people who are sincere, patient, and consistent. You may struggle with those who are aggressive or frequently change direction."}
                      {result.dominantType === "C" &&
                        "You work best with people who are logical, detail-oriented, and focused on quality. You may find it difficult to work with those who are disorganized or emotional in their approach."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
