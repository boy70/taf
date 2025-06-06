import type { DiscResult } from "./types"

// Enhanced Hugging Face integration with proper error handling and logging
export async function generateInsight(discResult: DiscResult): Promise<string> {
  console.log(`[HF API Request] Generating insight for personality type: ${discResult.dominantType}`)

  try {
    const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `Generate a detailed workplace profile and advice for a person with the following DISC personality assessment:
        Dominance: ${discResult.dScore.toFixed(1)}%
        Influence: ${discResult.iScore.toFixed(1)}%
        Steadiness: ${discResult.sScore.toFixed(1)}%
        Conscientiousness: ${discResult.cScore.toFixed(1)}%
        Dominant Type: ${discResult.dominantType}
        
        Provide a comprehensive workplace profile including:
        1. Work Style
        2. Communication Style
        3. Strengths
        4. Growth Areas
        5. Ideal Work Environment
        
        Workplace Profile:`,
        parameters: {
          max_new_tokens: 800,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        },
      }),
    })

    if (!response.ok) {
      console.error(`[HF API Error] ${response.status}: ${response.statusText}`)
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`[HF API Response] Received response for personality type: ${discResult.dominantType}`)

    if (!data.generated_text) {
      console.error("[HF API Error] No generated text in response")
      return generateFallbackInsight(discResult)
    }

    return data.generated_text
  } catch (error) {
    console.error("[HF API Error]", error)
    return generateFallbackInsight(discResult)
  }
}

// New function to generate training recommendations
export async function generateTrainingPlan(discResult: DiscResult): Promise<string[]> {
  console.log(`[HF API Request] Generating training plan for personality type: ${discResult.dominantType}`)

  try {
    const API_URL = "https://api-inference.huggingface.co/models/google/gemma-7b-it"

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `Based on this DISC personality profile:
        Dominance: ${discResult.dScore.toFixed(1)}%
        Influence: ${discResult.iScore.toFixed(1)}%
        Steadiness: ${discResult.sScore.toFixed(1)}%
        Conscientiousness: ${discResult.cScore.toFixed(1)}%
        Dominant Type: ${discResult.dominantType}
        
        Generate 5 specific training recommendations that would benefit this person's professional development.
        Format each recommendation as a separate paragraph with a title and brief description.
        
        Training Recommendations:`,
        parameters: {
          max_new_tokens: 600,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        },
      }),
    })

    if (!response.ok) {
      console.error(`[HF API Error] ${response.status}: ${response.statusText}`)
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`[HF API Response] Received training plan for personality type: ${discResult.dominantType}`)

    if (!data.generated_text) {
      console.error("[HF API Error] No generated text in response")
      return getFallbackTrainingPlan(castToDiscType(discResult.dominantType))
    }

    // Process the generated text to extract recommendations
    console.log("[Processing] Extracting training recommendations from text")
    const recommendations = processTrainingRecommendations(data.generated_text)
    console.log(`[Processing] Extracted ${recommendations.length} training recommendations`)

    return recommendations.length > 0 ? recommendations : getFallbackTrainingPlan(castToDiscType(discResult.dominantType))
  } catch (error) {
    console.error("[HF API Error]", error)
    return getFallbackTrainingPlan(castToDiscType(discResult.dominantType))
  }
}

// New function to generate communication tips
export async function generateCommunicationTips(discResult: DiscResult): Promise<string[]> {
  console.log(`[HF API Request] Generating communication tips for personality type: ${discResult.dominantType}`)

  try {
    const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `For a person with this DISC personality profile:
        Dominance: ${discResult.dScore.toFixed(1)}%
        Influence: ${discResult.iScore.toFixed(1)}%
        Steadiness: ${discResult.sScore.toFixed(1)}%
        Conscientiousness: ${discResult.cScore.toFixed(1)}%
        Dominant Type: ${discResult.dominantType}
        
        Generate 5 specific communication strategies for effectively interacting with this person.
        Format each strategy as a separate paragraph with a clear title and brief explanation.
        
        Communication Strategies:`,
        parameters: {
          max_new_tokens: 600,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        },
      }),
    })

    if (!response.ok) {
      console.error(`[HF API Error] ${response.status}: ${response.statusText}`)
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`[HF API Response] Received communication tips for personality type: ${discResult.dominantType}`)

    if (!data.generated_text) {
      console.error("[HF API Error] No generated text in response")
      return getFallbackCommunicationTips(castToDiscType(discResult.dominantType))
    }

    // Process the generated text to extract communication tips
    console.log("[Processing] Extracting communication tips from text")
    const tips = processCommunicationTips(data.generated_text)
    console.log(`[Processing] Extracted ${tips.length} communication tips`)

    return tips.length > 0 ? tips : getFallbackCommunicationTips(castToDiscType(discResult.dominantType))
  } catch (error) {
    console.error("[HF API Error]", error)
    return getFallbackCommunicationTips(castToDiscType(discResult.dominantType))
  }
}

// Helper function to process training recommendations from generated text
function processTrainingRecommendations(text: string): string[] {
  // Split text into paragraphs
  const paragraphs = text.split("\n\n").filter((p) => p.trim().length > 0)

  // Extract recommendations (paragraphs that look like recommendations)
  const recommendations = paragraphs
    .filter(
      (p) =>
        // Look for paragraphs that start with numbers or have titles
        /^\d+\.|\*|[A-Z][a-z]+\s+[A-Z][a-z]+:/.test(p) ||
        // Or contain training-related keywords
        /training|skill|development|course|workshop|learning/i.test(p),
    )
    .map((p) => p.trim())
    .slice(0, 5) // Limit to 5 recommendations

  return recommendations
}

// Helper function to process communication tips from generated text
function processCommunicationTips(text: string): string[] {
  // Split text into paragraphs
  const paragraphs = text.split("\n\n").filter((p) => p.trim().length > 0)

  // Extract tips (paragraphs that look like tips)
  const tips = paragraphs
    .filter(
      (p) =>
        // Look for paragraphs that start with numbers or have titles
        /^\d+\.|\*|[A-Z][a-z]+\s+[A-Z][a-z]+:/.test(p) ||
        // Or contain communication-related keywords
        /communicate|speak|listen|approach|interact/i.test(p),
    )
    .map((p) => p.trim())
    .slice(0, 5) // Limit to 5 tips

  return tips
}

// Fallback function for insights
function generateFallbackInsight(discResult: DiscResult): string {
  const dominantType = discResult.dominantType

  const insights = {
    D: `As a dominant "D" personality type, you are direct, decisive, and results-oriented. You thrive in challenging environments and are motivated by achievement and control.

Work Style:
- You're a natural leader who takes charge and makes quick decisions
- You focus on the big picture and delegate details to others
- You're competitive and driven to succeed
- You value efficiency and getting results

Communication Style:
- You're direct and to the point
- You may come across as blunt or impatient
- You prefer brief, focused conversations
- You're not afraid to address conflicts head-on

Strengths:
- Decision-making and problem-solving
- Taking initiative and driving change
- Overcoming obstacles
- Setting and achieving ambitious goals

Growth Areas:
- Practice active listening and patience
- Consider how your decisions impact others
- Develop empathy and emotional intelligence
- Recognize the value of collaboration and teamwork

Ideal Work Environment:
- Fast-paced with minimal constraints
- Opportunities for advancement and challenge
- Freedom to make decisions
- Results-oriented culture that rewards achievement

To be most effective, focus on balancing your natural drive with consideration for others. Your team values your ability to make tough decisions and move projects forward.`,

    I: `As an influential "I" personality type, you are outgoing, enthusiastic, and people-oriented. You thrive in social environments and are motivated by recognition and relationships.

Work Style:
- You're energetic and optimistic
- You enjoy collaboration and teamwork
- You're creative and think outside the box
- You inspire and motivate others

Communication Style:
- You're expressive and animated
- You enjoy storytelling and sharing experiences
- You build rapport easily
- You prefer face-to-face interactions

Strengths:
- Building relationships and networking
- Persuading and influencing others
- Creating enthusiasm for projects
- Thinking creatively

Growth Areas:
- Follow through on commitments
- Pay attention to details
- Manage time effectively
- Balance socializing with task completion

Ideal Work Environment:
- Collaborative and team-oriented
- Recognition for contributions
- Opportunities to interact with others
- Positive and supportive atmosphere

To be most effective, harness your natural charisma while developing more structure and follow-through. Your team values your ability to create positive energy and build connections.`,

    S: `As a steady "S" personality type, you are supportive, patient, and relationship-focused. You thrive in stable environments and are motivated by cooperation and security.

Work Style:
- You're reliable and consistent
- You prefer established routines and procedures
- You're a team player who supports others
- You work methodically and thoroughly

Communication Style:
- You're a good listener
- You're diplomatic and avoid conflict
- You prefer clear, step-by-step instructions
- You build deep, loyal relationships

Strengths:
- Creating harmony in teams
- Following through on commitments
- Supporting colleagues
- Maintaining patience during challenges

Growth Areas:
- Adapt more quickly to change
- Express your opinions more openly
- Make decisions more independently
- Set boundaries when needed

Ideal Work Environment:
- Stable and predictable
- Supportive team atmosphere
- Clear expectations and procedures
- Low conflict and competition

To be most effective, leverage your natural supportiveness while becoming more comfortable with change and speaking up. Your team values your reliability and calming presence.`,

    C: `As a conscientious "C" personality type, you are analytical, detail-oriented, and quality-focused. You thrive in structured environments and are motivated by accuracy and expertise.

Work Style:
- You're methodical and systematic
- You focus on precision and quality
- You analyze problems thoroughly
- You set high standards for yourself and others

Communication Style:
- You're logical and fact-based
- You prefer written communication
- You ask thoughtful questions
- You avoid emotional arguments

Strengths:
- Attention to detail and accuracy
- Critical thinking and analysis
- Planning and organization
- Maintaining high standards

Growth Areas:
- Make decisions more quickly
- Consider the human element in situations
- Express appreciation for others
- Adapt to unexpected changes

Ideal Work Environment:
- Structured with clear processes
- Opportunities for independent work
- Time to analyze before making decisions
- Recognition for expertise and quality

To be most effective, use your analytical strengths while developing more comfort with ambiguity and emotional aspects of work. Your team values your thoroughness and commitment to quality.`,
  }

  return insights[dominantType as keyof typeof insights] || "No insight available for this personality type."
}

type DiscType = "D" | "I" | "S" | "C"

function castToDiscType(value: string): DiscType {
  if (value === "D" || value === "I" || value === "S" || value === "C") {
    return value
  }
  throw new Error(`Invalid DiscType value: ${value}`)
}

// Update all function calls passing string as DiscType to use castToDiscType

// Example fix for getFallbackTrainingPlan and getFallbackCommunicationTips calls:
// return getFallbackTrainingPlan(castToDiscType(discResult.dominantType))
// return getFallbackCommunicationTips(castToDiscType(discResult.dominantType))

// Similarly, update other calls passing string to DiscType parameters accordingly

function getFallbackTrainingPlan(dominantType: DiscType): string[] {
  const recommendations: Record<DiscType, string[]> = {
    D: [
      "Leadership Development: A structured program focusing on strategic leadership, delegation, and team empowerment to channel your natural leadership tendencies more effectively.",
      "Emotional Intelligence Training: Workshops designed to enhance your ability to recognize and respond to others' emotions, improving your interpersonal relationships and team dynamics.",
      "Active Listening Skills: Specialized training to develop patience and attentive listening, helping you gather more information before making decisions.",
      "Collaborative Decision-Making: Courses that teach inclusive decision-making processes, allowing you to leverage team input while maintaining your decisive nature.",
      "Conflict Resolution Techniques: Advanced strategies for resolving conflicts constructively, turning potential confrontations into productive problem-solving sessions.",
    ],
    I: [
      "Project Management Fundamentals: Structured training to enhance your ability to plan, organize, and follow through on projects from inception to completion.",
      "Detail-Oriented Skills Workshop: Focused exercises to improve attention to detail and analytical thinking, complementing your natural big-picture orientation.",
      "Time Management Mastery: Techniques for prioritizing tasks, setting boundaries, and maintaining productivity while still engaging with others.",
      "Data Analysis Fundamentals: Introduction to analytical tools and methodologies to strengthen your decision-making with concrete data.",
      "Presentation Skills Advanced Course: Building on your natural communication abilities to create more structured, content-rich presentations that maintain audience engagement.",
    ],
    S: [
      "Change Management Certification: Comprehensive training to help you navigate and lead others through organizational changes with confidence.",
      "Assertiveness Training: Workshops focused on expressing opinions confidently and setting healthy boundaries while maintaining your supportive nature.",
      "Decision-Making Under Pressure: Practical exercises to strengthen your ability to make timely decisions with limited information.",
      "Innovation and Creative Problem-Solving: Courses designed to expand your comfort zone by exploring new approaches and solutions.",
      "Leadership for Supportive Personalities: Specialized leadership training that leverages your natural strengths in building consensus and supporting team members.",
    ],
    C: [
      "Agile Methodologies Workshop: Training to help you adapt to changing requirements while maintaining quality standards in fast-paced environments.",
      "Interpersonal Communication Skills: Courses focused on enhancing verbal communication and building rapport in professional settings.",
      "Risk Assessment and Management: Advanced techniques for evaluating when perfectionism should be balanced with timely delivery.",
      "Emotional Intelligence in the Workplace: Training to recognize and respond appropriately to emotional cues and interpersonal dynamics.",
      "Executive Decision-Making: Frameworks for making confident decisions with incomplete information, reducing analysis paralysis.",
    ],
  }

  return recommendations[dominantType] || [
    "Professional Development Planning: Personalized assessment and planning for career growth",
    "Communication Skills Workshop: Enhancing clarity and effectiveness in workplace interactions",
    "Time Management Training: Strategies for prioritization and productivity improvement",
    "Conflict Resolution Course: Techniques for addressing and resolving workplace conflicts",
    "Leadership Fundamentals: Core skills for leading teams and projects effectively",
  ]
}

// Fallback function for communication tips
function getFallbackCommunicationTips(dominantType: DiscType): string[] {
  const tips: Record<DiscType, string[]> = {
    D: [
      "Be Direct and Concise: Keep communications brief and focused on results. Avoid unnecessary details and get straight to the point.",
      "Provide Options, Not Orders: Present choices and recommendations rather than directives. This respects their decision-making preference.",
      "Focus on Solutions, Not Problems: When discussing challenges, emphasize potential solutions rather than dwelling on the problems.",
      "Respect Their Time: Be punctual and efficient in meetings. Send agenda items in advance and stick to scheduled timeframes.",
      "Offer the Big Picture: Start with the overall goal or vision before diving into details. Connect specific tasks to broader objectives.",
    ],
    I: [
      "Allow Time for Social Interaction: Build in time for relationship-building and personal connection before diving into business matters.",
      "Use Engaging, Interactive Communication: Incorporate stories, visuals, and interactive elements in presentations to maintain their interest.",
      "Provide Recognition and Appreciation: Regularly acknowledge their contributions and achievements in visible ways.",
      "Balance Enthusiasm with Structure: Respond positively to their energy while gently guiding conversations back to key points when needed.",
      "Follow Up in Writing: After verbal discussions, provide written summaries of key points and action items to ensure follow-through.",
    ],
    S: [
      "Maintain a Calm, Supportive Approach: Create a non-threatening environment for discussions, especially when introducing changes.",
      "Provide Clear, Step-by-Step Information: Break down complex processes into manageable steps with clear instructions.",
      "Give Advance Notice of Changes: Whenever possible, allow time to process and adjust to new ideas or procedures.",
      "Ask for Their Input: Specifically invite their opinions and give them time to formulate responses without pressure.",
      "Show Appreciation for Reliability: Recognize and value their consistency and supportive contributions to the team.",
    ],
    C: [
      "Provide Detailed Information: Share comprehensive data, documentation, and evidence to support proposals or requests.",
      "Allow Processing Time: Give them space to analyze information before expecting decisions or responses.",
      "Focus on Accuracy and Quality: Emphasize the standards and precision of work rather than just speed or relationships.",
      "Use Logical, Structured Communication: Organize thoughts in a logical sequence and avoid emotional or disorganized presentations.",
      "Respect Expertise: Acknowledge their knowledge and skills in their domain, and consult them on matters related to their expertise.",
    ],
  }

    return tips[castToDiscType(dominantType)] || [
    "Practice active listening and confirm understanding",
    "Be clear and specific about expectations and deadlines",
    "Choose appropriate communication channels based on message complexity",
    "Provide constructive feedback focused on specific behaviors",
    "Adapt your communication style to match their preferences",
  ]
}
