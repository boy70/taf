import type { user_role, result_dominantType } from "@prisma/client"

// Auth types
export interface UserSession {
  id: string
  name: string
  email: string
  role: user_role
  startupId: string | null
}

// DISC test types
export interface QuestionOption {
  id: string
  text: string
}

export interface DiscMapping {
  [optionId: string]: {
    d: number
    i: number
    s: number
    c: number
  }
}

export interface Question {
  id: string
  questionText: string
  options: QuestionOption[]
  discMapping: DiscMapping
}

export interface Answer {
  questionId: string
  selectedOption: string
}

export interface DiscResult {
  dScore: number
  iScore: number
  sScore: number
  cScore: number
  dominantType: result_dominantType
}

// Team compatibility types
export interface TeamMember {
  id: string
  name: string
  dominantType: result_dominantType
  dScore: number
  iScore: number
  sScore: number
  cScore: number
}

export interface TeamCompatibility {
  balance: number // 0-100
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}

// Dashboard types
export interface StartupData {
  id: string
  name: string
  employeeCount: number
  hrCount: number
}

export interface EmployeeData {
  id: string
  name: string
  email: string
  dominantType: result_dominantType | null
  testCompleted: boolean
}
