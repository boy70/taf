"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../..//components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../..//components/ui/input"
import { Label } from "../../../..//components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../..//components/ui/tabs"
import { Checkbox } from "../../../..//components/ui/checkbox"
import { Loader2, Calendar, Users, BookOpen, Download, Printer } from "lucide-react"
import { Badge } from "../../../..//components/ui/badge"

export default function TrainingPlannerPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [trainingPlan, setTrainingPlan] = useState<any>(null)
  const [planName, setPlanName] = useState("Team Development Plan")
  const [planDate, setPlanDate] = useState("")
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/users?role=EMPLOYEE")

        if (!response.ok) {
          throw new Error("Failed to fetch employees")
        }

        const data = await response.json()
        // Filter to only include employees with results
        const employeesWithResults = data.filter((emp: any) => emp.results && emp.results.length > 0)
        setEmployees(employeesWithResults)
      } catch (err) {
        setError("Failed to load employees. Please try again later.")
        console.error("Error fetching employees:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()

    // Set default date to 2 weeks from now
    const twoWeeksFromNow = new Date()
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)
    setPlanDate(twoWeeksFromNow.toISOString().split("T")[0])
  }, [])

  const handleEmployeeToggle = (employeeId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId],
    )
  }

  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(employees.map((emp) => emp.id))
    }
  }

  const generateTrainingPlan = async () => {
    if (selectedEmployees.length === 0) return

    setGenerating(true)

    try {
      // Get selected employees with their DISC types
      const selectedEmployeeData = employees
        .filter((emp) => selectedEmployees.includes(emp.id))
        .map((emp) => ({
          id: emp.id,
          name: emp.name,
          dominantType: emp.results[0].dominantType,
          dScore: emp.results[0].dScore,
          iScore: emp.results[0].iScore,
          sScore: emp.results[0].sScore,
          cScore: emp.results[0].cScore,
        }))

      // Count personality types
      const typeCounts = {
        D: selectedEmployeeData.filter((e) => e.dominantType === "D").length,
        I: selectedEmployeeData.filter((e) => e.dominantType === "I").length,
        S: selectedEmployeeData.filter((e) => e.dominantType === "S").length,
        C: selectedEmployeeData.filter((e) => e.dominantType === "C").length,
      }

      // Generate recommendations based on team composition
      const recommendations = []

      // General recommendations
      recommendations.push({
        title: "Team Communication Workshop",
        description:
          "A workshop focused on improving communication between different DISC types, with practical exercises for real workplace scenarios.",
        forTypes: ["D", "I", "S", "C"],
        priority: "High",
      })

      // Type-specific recommendations
      if (typeCounts.D > 0 && typeCounts.S > 0) {
        recommendations.push({
          title: "Conflict Resolution Training",
          description:
            "Help D-types and S-types understand each other's communication styles and work together more effectively.",
          forTypes: ["D", "S"],
          priority: "Medium",
        })
      }

      if (typeCounts.I > 0 && typeCounts.C > 0) {
        recommendations.push({
          title: "Detail-Oriented Project Planning",
          description:
            "Balance the big-picture thinking of I-types with the detail focus of C-types for better project outcomes.",
          forTypes: ["I", "C"],
          priority: "Medium",
        })
      }

      if (typeCounts.D > 1) {
        recommendations.push({
          title: "Collaborative Leadership",
          description:
            "Help multiple D-types work together without conflict by establishing clear domains of authority.",
          forTypes: ["D"],
          priority: "High",
        })
      }

      if (typeCounts.I > 1) {
        recommendations.push({
          title: "Focus and Follow-Through",
          description: "Help I-types maintain focus on completing tasks while still leveraging their creative energy.",
          forTypes: ["I"],
          priority: "Medium",
        })
      }

      if (typeCounts.S > 1) {
        recommendations.push({
          title: "Change Management and Adaptability",
          description:
            "Support S-types in developing comfort with change and speaking up with their valuable insights.",
          forTypes: ["S"],
          priority: "Medium",
        })
      }

      if (typeCounts.C > 1) {
        recommendations.push({
          title: "Decision-Making Efficiency",
          description: "Help C-types balance their need for perfect information with timely decision-making.",
          forTypes: ["C"],
          priority: "Medium",
        })
      }

      // Add some general team development recommendations
      recommendations.push({
        title: "Strengths-Based Team Building",
        description:
          "A full-day workshop to identify and leverage the unique strengths of each team member based on their DISC profile.",
        forTypes: ["D", "I", "S", "C"],
        priority: "High",
      })

      recommendations.push({
        title: "Emotional Intelligence Development",
        description:
          "Enhance team effectiveness by developing emotional intelligence skills across all personality types.",
        forTypes: ["D", "I", "S", "C"],
        priority: "Medium",
      })

      // Set the training plan
      setTrainingPlan({
        name: planName,
        date: planDate,
        employees: selectedEmployeeData,
        typeCounts,
        recommendations,
      })
    } catch (err) {
      console.error("Error generating training plan:", err)
      setError("Failed to generate training plan. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    if (!trainingPlan) return

    const content = `
# ${trainingPlan.name}
Scheduled for: ${trainingPlan.date}

## Team Composition
Total Participants: ${trainingPlan.employees.length}
- Type D (Dominant): ${trainingPlan.typeCounts.D}
- Type I (Influential): ${trainingPlan.typeCounts.I}
- Type S (Steady): ${trainingPlan.typeCounts.S}
- Type C (Conscientious): ${trainingPlan.typeCounts.C}

## Participants
${trainingPlan.employees.map((emp: any) => `- ${emp.name} (Type ${emp.dominantType})`).join("\n")}

## Recommended Training Activities
${trainingPlan.recommendations
  .map(
    (rec: any) =>
      `### ${rec.title} (Priority: ${rec.priority})
For: ${rec.forTypes.join(", ")} types
${rec.description}
`,
  )
  .join("\n\n")}

Generated by Tafsula - ${new Date().toLocaleDateString()}
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${planName.replace(/\s+/g, "-").toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "D":
        return "bg-red-100 text-red-800 border-red-300"
      case "I":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "S":
        return "bg-green-100 text-green-800 border-green-300"
      case "C":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Training Planner</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Plan Settings</CardTitle>
              <CardDescription>Configure your team training plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input id="plan-name" value={planName} onChange={(e) => setPlanName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan-date">Scheduled Date</Label>
                <Input id="plan-date" type="date" value={planDate} onChange={(e) => setPlanDate(e.target.value)} />
              </div>

              <div className="pt-4">
                <Button
                  onClick={generateTrainingPlan}
                  disabled={selectedEmployees.length === 0 || generating}
                  className="w-full"
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>Generate Training Plan</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Select Participants</CardTitle>
              <CardDescription>Choose employees to include in the training plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedEmployees.length === employees.length && employees.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Select All
                  </label>
                </div>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {employees.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No employees with DISC results found.</p>
                ) : (
                  employees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`employee-${employee.id}`}
                          checked={selectedEmployees.includes(employee.id)}
                          onCheckedChange={() => handleEmployeeToggle(employee.id)}
                        />
                        <label
                          htmlFor={`employee-${employee.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {employee.name}
                        </label>
                      </div>

                      {employee.results && employee.results[0] && (
                        <Badge className={`text-xs ${getTypeColor(employee.results[0].dominantType)}`}>
                          Type {employee.results[0].dominantType}
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                {selectedEmployees.length} of {employees.length} employees selected
              </p>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {trainingPlan ? (
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{trainingPlan.name}</CardTitle>
                  <CardDescription>Scheduled for {new Date(trainingPlan.date).toLocaleDateString()}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePrint} size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button onClick={handleDownload} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Team Composition</span>
                    </TabsTrigger>
                    <TabsTrigger value="recommendations" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Recommendations</span>
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Schedule</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-4">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Team Composition</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Card className="bg-red-50 border-red-200">
                            <CardContent className="p-4 text-center">
                              <p className="text-2xl font-bold text-red-700">{trainingPlan.typeCounts.D}</p>
                              <p className="text-sm text-red-700">Type D</p>
                            </CardContent>
                          </Card>

                          <Card className="bg-yellow-50 border-yellow-200">
                            <CardContent className="p-4 text-center">
                              <p className="text-2xl font-bold text-yellow-700">{trainingPlan.typeCounts.I}</p>
                              <p className="text-sm text-yellow-700">Type I</p>
                            </CardContent>
                          </Card>

                          <Card className="bg-green-50 border-green-200">
                            <CardContent className="p-4 text-center">
                              <p className="text-2xl font-bold text-green-700">{trainingPlan.typeCounts.S}</p>
                              <p className="text-sm text-green-700">Type S</p>
                            </CardContent>
                          </Card>

                          <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4 text-center">
                              <p className="text-2xl font-bold text-blue-700">{trainingPlan.typeCounts.C}</p>
                              <p className="text-sm text-blue-700">Type C</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Participants ({trainingPlan.employees.length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {trainingPlan.employees.map((emp: any) => (
                            <div key={emp.id} className="flex items-center justify-between p-2 border rounded-md">
                              <span>{emp.name}</span>
                              <Badge className={`${getTypeColor(emp.dominantType)}`}>Type {emp.dominantType}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="recommendations" className="mt-4">
                    <div className="space-y-4">
                      {trainingPlan.recommendations.map((rec: any, index: number) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{rec.title}</CardTitle>
                              <Badge variant={rec.priority === "High" ? "default" : "outline"}>
                                {rec.priority} Priority
                              </Badge>
                            </div>
                            <CardDescription>
                              For:{" "}
                              {rec.forTypes.map((type: string) => (
                                <Badge key={type} className={`mr-1 ${getTypeColor(type)}`}>
                                  Type {type}
                                </Badge>
                              ))}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>{rec.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="schedule" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Suggested Schedule</CardTitle>
                        <CardDescription>Proposed timeline for implementing training recommendations</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-3 border rounded-md">
                            <p className="font-medium">Week 1-2: Assessment and Planning</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Review individual DISC profiles and finalize the training plan based on team needs.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md">
                            <p className="font-medium">Week 3-4: Foundation Training</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Conduct the Team Communication Workshop to establish a common understanding of DISC types.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md">
                            <p className="font-medium">Week 5-8: Specialized Training</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Implement type-specific training recommendations based on priority.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md">
                            <p className="font-medium">Week 9-10: Integration Workshop</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Conduct the Strengths-Based Team Building workshop to apply learnings in practice.
                            </p>
                          </div>

                          <div className="p-3 border rounded-md">
                            <p className="font-medium">Week 12: Evaluation and Follow-up</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Assess training effectiveness and plan ongoing development activities.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Training Plan Generated</h3>
                <p className="text-muted-foreground mb-6">
                  Select employees and generate a training plan to see recommendations.
                </p>
                <Button onClick={generateTrainingPlan} disabled={selectedEmployees.length === 0}>
                  Generate Training Plan
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
