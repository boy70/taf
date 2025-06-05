"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs"
import { Button } from "../../../../../components/ui/button"
import { Loader2, ArrowLeft, User, BarChart2, BookOpen } from "lucide-react"
import { TrainingRecommendations } from "../../../../../components/training-recommendations"

interface EmployeeDetailsProps {
  params: {
    id: string
  }
}

export default function EmployeeDetailsPage({ params }: EmployeeDetailsProps) {
  const router = useRouter()
  const [employee, setEmployee] = useState<any>(null)
  const [result, setResult] = useState<any>(null)
  const [insight, setInsight] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true)

        // Fetch employee data
        const employeeResponse = await fetch(`/api/users?userId=${params.id}`)
        if (!employeeResponse.ok) {
          throw new Error("Failed to fetch employee data")
        }
        const employeeData = await employeeResponse.json()

        if (!employeeData || employeeData.length === 0) {
          throw new Error("Employee not found")
        }

        setEmployee(employeeData[0])

        // Fetch results data
        const resultsResponse = await fetch(`/api/results/${params.id}`)
        if (!resultsResponse.ok) {
          throw new Error("Failed to fetch results data")
        }

        const resultsData = await resultsResponse.json()
        setResult(resultsData.result)
        setInsight(resultsData.insight?.text || "")
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load employee data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchEmployeeData()
  }, [params.id])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "D":
        return "text-red-600"
      case "I":
        return "text-yellow-600"
      case "S":
        return "text-green-600"
      case "C":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Employees
      </Button>

      <div className="grid gap-6">
        {/* Employee Profile Card */}
        <Card className="bg-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold flex items-center">
              <User className="mr-2 h-6 w-6 text-primary" />
              {employee?.name}
            </CardTitle>
            <CardDescription>{employee?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${getTypeColor(result?.dominantType || "")} rounded-md p-2`}>
                <p className="text-sm font-medium text-white">Role</p>
                <p className="text-white">{employee?.role}</p>
              </div>
              <div className={`${getTypeColor(result?.dominantType || "")} rounded-md p-2`}>
                <p className="text-sm font-medium text-white">Assessment Status</p>
                <p className="text-white">{result ? "Completed" : "Not Completed"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {result ? (
          <Tabs defaultValue="results" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="results" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>DISC Results</span>
              </TabsTrigger>
              <TabsTrigger value="insight" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Personality Insight</span>
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Development Plan</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>DISC Assessment Results</CardTitle>
                  <CardDescription>
                    Dominant Type:{" "}
                    <span className={`font-bold ${getTypeColor(result.dominantType)}`}>{result.dominantType}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* DISC Score Bars */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-red-700">Dominance (D)</span>
                        <span className="text-sm font-medium">{result.dScore.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${result.dScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-yellow-700">Influence (I)</span>
                        <span className="text-sm font-medium">{result.iScore.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${result.iScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-green-700">Steadiness (S)</span>
                        <span className="text-sm font-medium">{result.sScore.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${result.sScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-blue-700">Conscientiousness (C)</span>
                        <span className="text-sm font-medium">{result.cScore.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${result.cScore}%` }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insight" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personality Insight</CardTitle>
                  <CardDescription>AI-generated workplace profile based on DISC assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-line">{insight}</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-6">
              <TrainingRecommendations
                userId={params.id}
                userName={employee?.name || "Employee"}
                dominantType={result.dominantType}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">This employee has not completed the DISC assessment yet.</p>
                <Button onClick={() => router.push("/dashboard/hr/employees/invite")}>
                  Send Assessment Invitation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
