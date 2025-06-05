import type { TeamMember, TeamCompatibility } from "./types"

export function calculateTeamCompatibility(teamMembers: TeamMember[]): TeamCompatibility {
  // Count the number of each DISC type
  const typeCounts = {
    D: teamMembers.filter((m) => m.dominantType === "D").length,
    I: teamMembers.filter((m) => m.dominantType === "I").length,
    S: teamMembers.filter((m) => m.dominantType === "S").length,
    C: teamMembers.filter((m) => m.dominantType === "C").length,
  }

  // Calculate average scores
  const avgScores = {
    D: teamMembers.reduce((sum, m) => sum + m.dScore, 0) / teamMembers.length,
    I: teamMembers.reduce((sum, m) => sum + m.iScore, 0) / teamMembers.length,
    S: teamMembers.reduce((sum, m) => sum + m.sScore, 0) / teamMembers.length,
    C: teamMembers.reduce((sum, m) => sum + m.cScore, 0) / teamMembers.length,
  }

  // Calculate balance score (0-100)
  // A perfectly balanced team would have equal representation of all types
  const totalMembers = teamMembers.length
  const expectedPerType = totalMembers / 4
  const typeDeviation =
    Math.abs(typeCounts.D - expectedPerType) +
    Math.abs(typeCounts.I - expectedPerType) +
    Math.abs(typeCounts.S - expectedPerType) +
    Math.abs(typeCounts.C - expectedPerType)

  // Convert to a 0-100 scale where 100 is perfectly balanced
  const maxDeviation = totalMembers * 2 // Worst case: all members are of one type
  const balance = Math.max(0, 100 - (typeDeviation / maxDeviation) * 100)

  // Determine strengths
  const strengths = []
  if (typeCounts.D > 0) strengths.push("Decision-making and leadership")
  if (typeCounts.I > 0) strengths.push("Communication and enthusiasm")
  if (typeCounts.S > 0) strengths.push("Stability and teamwork")
  if (typeCounts.C > 0) strengths.push("Analysis and attention to detail")

  // Determine weaknesses
  const weaknesses = []
  if (typeCounts.D === 0) weaknesses.push("May lack decisive leadership")
  if (typeCounts.I === 0) weaknesses.push("May struggle with team morale and external communication")
  if (typeCounts.S === 0) weaknesses.push("May lack patience and stability during changes")
  if (typeCounts.C === 0) weaknesses.push("May overlook important details and quality control")

  // Generate recommendations
  const recommendations = []

  // Recommend adding underrepresented types
  const threshold = expectedPerType * 0.5
  if (typeCounts.D < threshold)
    recommendations.push("Consider adding more 'D' personalities for stronger leadership and decision-making")
  if (typeCounts.I < threshold)
    recommendations.push("Consider adding more 'I' personalities to improve team energy and communication")
  if (typeCounts.S < threshold)
    recommendations.push("Consider adding more 'S' personalities to enhance team stability and cooperation")
  if (typeCounts.C < threshold)
    recommendations.push("Consider adding more 'C' personalities to improve analysis and quality control")

  // Recommend addressing potential conflicts
  if (typeCounts.D > expectedPerType * 1.5 && typeCounts.C > expectedPerType * 1.5) {
    recommendations.push(
      "Watch for potential conflicts between 'D' and 'C' types - 'D' types may push for quick decisions while 'C' types need time for analysis",
    )
  }

  if (typeCounts.D > expectedPerType * 1.5 && typeCounts.S > expectedPerType * 1.5) {
    recommendations.push(
      "Be aware that 'D' types may overwhelm 'S' types - encourage open communication and mutual respect",
    )
  }

  return {
    balance,
    strengths,
    weaknesses,
    recommendations,
  }
}
