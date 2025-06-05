"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Progress } from "../../../components/ui/progress"
import {
  Zap,
  Sparkles,
  Heart,
  Brain,
  TrendingUp,
  Star,
  RefreshCw,
  Download,
  Share2,
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
  TreePine,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { UserNav } from "components/user-nav"

interface TestResult {
  id: string
  dScore: number
  iScore: number
  sScore: number
  cScore: number
  dominantType: "D" | "I" | "S" | "C"
  createdAt: string
}

interface Insight {
  id: string
  text: string
  createdAt: string
}

interface Chapter {
  title: string
  icon: React.ComponentType<{ className?: string }>
  content: string
}

interface PersonalityStory {
  color: string
  chapters: Chapter[]
  traits: string[]
  superpower: string
}

export default function TestResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<TestResult | null>(null)
  const [insight, setInsight] = useState<Insight | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/test/results", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch results")
      }

      if (!data.result) {
        setError("No test results found. Please take the assessment first.")
        setIsLoading(false)
        return
      }

      setResult(data.result)
      setInsight(data.insight)
      setIsLoading(false)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    } catch (error) {
      console.error("Error fetching results:", error)
      setError(error instanceof Error ? error.message : "Failed to load your results. Please try again.")
      setIsLoading(false)
    }
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const getPersonalityStory = (type: "D" | "I" | "S" | "C") => {
    const stories = {
      D: {
        title: "The Trailblazer",
        subtitle: "The Architect of Change",
        color: "#e53e3e",
        icon: Zap,

        prologue: {
          title: "Your Origin Story",
          content: `Picture this: Even as a child, you were the one who didn't just dream about building the ultimate fort—you grabbed the tools and started construction. While others hesitated at the edge of the playground's highest slide, you were already planning your descent strategy. This wasn't recklessness; it was the early manifestation of a mind that sees obstacles as puzzles to solve and challenges as invitations to grow.

Your personality didn't develop by accident. It was forged in moments when you chose action over hesitation, when you stepped forward while others stepped back. You've always been drawn to the driver's seat, not because you need control, but because you see possibilities that others miss and feel compelled to bring them to life.`,
        },

        chapters: [
          {
            title: "Chapter 1: The Fire Within",
            icon: Flame,
            content: `Your dominant trait isn't just about being decisive—it's about carrying an internal flame that refuses to be extinguished. This fire has been your companion through every major decision, every career pivot, every moment when you chose the harder path because it led somewhere meaningful.

Think about your most defining moments. They probably weren't the times when everything went smoothly, but the moments when everything seemed impossible, and you found a way anyway. You have this remarkable ability to transform pressure into fuel. Where others see stress, you see energy. Where others see problems, you see projects waiting to be conquered.

This fire manifests differently in different areas of your life. In relationships, you're the one who addresses issues head-on rather than letting them fester. In your career, you're drawn to roles where you can see the direct impact of your efforts. You don't just want to participate in change—you want to be the catalyst that makes it happen.

But here's what makes you truly unique: your fire isn't destructive. It's creative. You don't tear down for the sake of destruction; you clear the ground to build something better. This is why people naturally look to you during times of uncertainty. They sense that you don't just have opinions—you have vision backed by the courage to act on it.`,
          },
          {
            title: "Chapter 2: The Decision Maker's Dilemma",
            icon: Compass,
            content: `Your superpower of quick decision-making comes with a fascinating paradox. While others agonize over choices, you've developed an almost intuitive ability to cut through complexity and identify what matters most. But this gift sometimes makes you feel isolated, especially when you're surrounded by people who need extensive deliberation for decisions that seem obvious to you.

You've learned that your brain processes information differently. Where others see a maze of possibilities, you see patterns. Where others get lost in details, you zoom out to see the bigger picture. This isn't because you're careless with details—it's because you've trained yourself to distinguish between details that matter and details that distract.

Your decision-making process is like a high-performance engine. You gather essential information quickly, run it through your internal filters of experience and intuition, and arrive at conclusions that often prove remarkably accurate. But this speed can sometimes be misunderstood by others as impulsiveness, when in reality, it's the result of a mind that's constantly processing and preparing.

The challenge you face isn't making decisions—it's helping others understand your reasoning and bringing them along on the journey. You've probably learned that sometimes the best decision is to slow down your communication, not your thinking, to ensure everyone can follow your logic and feel included in the process.`,
          },
          {
            title: "Chapter 3: The Leadership Paradox",
            icon: Crown,
            content: `Leadership found you before you went looking for it. Throughout your life, you've probably noticed that people naturally turn to you during crises, seek your opinion on important matters, and expect you to take charge when things get complicated. This isn't because you demanded authority—it's because you demonstrated competence and courage when it mattered most.

Your leadership style is uniquely yours. You don't lead through intimidation or manipulation; you lead through clarity and conviction. When you speak, people listen not because they have to, but because they sense you've thought things through and have a clear vision of where you're heading. You have this rare ability to cut through confusion and provide direction when everyone else is lost.

But true leadership has taught you some profound lessons about yourself. You've discovered that being right isn't enough—you need to be right in a way that others can understand and embrace. You've learned that your natural directness, while efficient, sometimes needs to be tempered with empathy and patience. The best leaders you've become inspired by weren't just decisive; they were decisive in service of something larger than themselves.

Your evolution as a leader reflects your growth as a person. Early in your journey, you might have led through sheer force of will. Now, you understand that the most powerful leadership comes from aligning your vision with others' values, from making people feel heard even as you guide them toward better solutions.`,
          },
          {
            title: "Chapter 4: Relationships and the Art of Connection",
            icon: Heart,
            content: `Your approach to relationships is as direct and authentic as everything else you do. You don't have time for games, pretense, or superficial connections. When you care about someone, they know it—not because you say it constantly, but because you show it through your actions, your loyalty, and your willingness to fight for what matters to them.

In romantic relationships, you're the partner who remembers what's important, who takes action to solve problems, and who isn't afraid to have difficult conversations when necessary. You love deeply, but you love practically. You show affection by removing obstacles from your partner's path, by being their advocate in challenging situations, and by creating stability through your strength and reliability.

Your friendships are built on mutual respect and shared adventures. You're the friend who shows up when others need help, who organizes the group trips that everyone talks about for years, and who isn't afraid to tell people what they need to hear, even when it's not what they want to hear. Your circle might be smaller than some, but it's incredibly strong because it's built on authenticity rather than convenience.

The challenge in your relationships often comes from your assumption that others share your directness and resilience. You've learned that not everyone processes conflict the same way you do, and that sometimes people need emotional support before they're ready for solutions. Your growth in relationships has been learning to lead with empathy while maintaining your authentic, action-oriented nature.`,
          },
          {
            title: "Chapter 5: Your Professional Journey",
            icon: Target,
            content: `Your career path probably looks like a series of strategic moves rather than random job changes. Even when you've taken risks or made pivots, there's been an underlying logic—a sense that you were moving toward something rather than running from something. You're drawn to roles where you can see the direct impact of your efforts and where your decisions matter.

You thrive in environments that match your energy level. Slow-moving bureaucracies drain you, while fast-paced, results-oriented cultures energize you. You're at your best when you have clear objectives, the authority to make decisions, and the resources to implement your vision. You don't just want to do a job—you want to make a difference.

Your professional relationships are built on competence and reliability. Colleagues know they can count on you to deliver what you promise, to speak up when something isn't working, and to take ownership of both successes and failures. You're the person others come to when they need someone to cut through red tape and get things done.

The evolution of your career reflects your growing understanding of how to channel your natural drive in service of larger goals. Early in your professional life, you might have focused primarily on individual achievement. Now, you understand that the most satisfying success comes from building something lasting, from developing others, and from creating systems that continue to deliver value long after you've moved on to new challenges.`,
          },
          {
            title: "Chapter 6: Your Hidden Depths",
            icon: Shield,
            content: `Beneath your confident exterior lies a complexity that few people get to see. You're not just driven by ambition—you're driven by a deep sense of responsibility and a genuine desire to make things better for the people you care about. Your strength isn't just personal; it's protective. You've probably spent much of your life being the person others lean on, the one who carries more than your share of the load because you can handle it.

This protective instinct extends beyond your immediate circle. You're bothered by inefficiency not just because it's annoying, but because you see how it affects people. You push for change not just because you like being in charge, but because you can see how the current way of doing things is holding people back. Your impatience with the status quo comes from a place of caring, even when others don't recognize it.

You've also developed a sophisticated understanding of risk and reward. What others see as bold moves, you see as calculated decisions based on careful analysis of potential outcomes. You're not a gambler—you're a strategist who's willing to bet on yourself and your ability to navigate whatever challenges arise.

Your emotional intelligence, while different from others', is profound in its own way. You read situations quickly, understand power dynamics intuitively, and have a keen sense of what motivates different people. You might not always express empathy in conventional ways, but you demonstrate it through your actions and your commitment to creating better outcomes for everyone involved.`,
          },
          {
            title: "Chapter 7: Your Future Potential",
            icon: Map,
            content: `Your journey is far from over, and the best chapters of your story are still being written. As you continue to evolve, you're learning to balance your natural drive with deeper wisdom about timing, collaboration, and sustainable success. You're discovering that true power comes not from controlling everything, but from empowering others to achieve their best.

The next phase of your development involves expanding your influence beyond direct action. You're learning to lead through inspiration and vision, to create systems that multiply your impact, and to develop others who can carry forward the changes you've initiated. Your legacy won't just be what you accomplished personally, but what you made possible for others.

You're also developing a more nuanced understanding of success. While you'll always be results-oriented, you're learning to value the journey as much as the destination, to appreciate the relationships you build along the way, and to find satisfaction in progress even when perfection remains elusive.

Your future holds opportunities to tackle bigger challenges, to lead larger initiatives, and to make an impact on a scale that matches your ambitions. But it also holds the promise of deeper fulfillment as you learn to integrate your drive with wisdom, your strength with compassion, and your vision with the patience to bring others along on the journey.

The world needs people like you—people who see what's possible and have the courage to make it real. Your story is one of transformation, not just of yourself, but of everything and everyone you touch. And the most exciting part? You're just getting started.`,
          },
        ],

        traits: ["Visionary Leader", "Strategic Thinker", "Change Catalyst", "Problem Solver", "Decision Maker"],
        superpower: "Transforming vision into reality through decisive action and unwavering determination",
        workStyle:
          "You thrive in dynamic environments where you can make quick decisions, see immediate results, and drive meaningful change.",
        communication: "Direct, clear, and purposeful. You say what you mean and appreciate when others do the same.",
        teamRole:
          "The driving force who provides direction, makes tough decisions, and keeps everyone focused on achieving ambitious goals.",
      },

      I: {
        title: "The Energizer",
        subtitle: "The Spark of Human Connection",
        color: "#ecc94b",
        icon: Sparkles,

        prologue: {
          title: "Your Origin Story",
          content: `Your story begins with light—not the harsh glare of a spotlight, but the warm, inviting glow that draws people in and makes them feel at home. Even as a child, you were the one who could turn a quiet room into a place of laughter, who could make the new kid feel welcome, who could find the silver lining in any cloud and help others see it too.

Your personality wasn't shaped by a single moment but by thousands of small interactions where you chose connection over isolation, optimism over cynicism, and possibility over limitation. You've always understood, perhaps intuitively, that life is better when it's shared, that ideas are more powerful when they're expressed, and that people are capable of more than they often believe about themselves.

This isn't just about being social—it's about being a catalyst for human potential. You see the best in people before they see it in themselves, and you have this remarkable gift for creating environments where that potential can flourish.`,
        },

        chapters: [
          {
            title: "Chapter 1: The Art of Human Connection",
            icon: Heart,
            content: `You possess something that can't be taught in any classroom or learned from any book: the ability to make people feel truly seen and valued. This isn't a technique or a strategy—it's an authentic expression of your belief that every person has something unique and valuable to offer the world.

Your conversations aren't just exchanges of information; they're opportunities for discovery. You ask questions not because you're supposed to, but because you're genuinely curious about people's stories, their dreams, their perspectives. You remember details that others forget—not just facts, but feelings, hopes, concerns. When someone mentions they're nervous about a presentation, you follow up weeks later to ask how it went.

This gift for connection extends beyond individual relationships to group dynamics. You're the person who notices when someone is being left out and naturally includes them. You're the one who can sense the mood of a room and adjust your energy to what's needed—bringing enthusiasm when spirits are low, providing calm when tensions are high, offering encouragement when confidence is shaken.

But your connection skills go deeper than just being friendly. You have an intuitive understanding of what motivates different people, what makes them feel appreciated, what brings out their best. You're like a translator between different personality types, helping the analytical person understand the emotional person, helping the quiet person find their voice, helping the skeptical person see new possibilities.`,
          },
          {
            title: "Chapter 2: The Innovation of Ideas",
            icon: Lightbulb,
            content: `Your mind is a creativity engine that never stops running. Ideas come to you not in isolation, but in connection—sparked by conversations, inspired by observations, born from the intersection of different perspectives and experiences. You don't just think outside the box; you reimagine what the box could be.

What makes your creativity unique is its collaborative nature. While some creative people work best in solitude, you thrive on the energy of brainstorming, the excitement of building on others' ideas, the magic that happens when different minds come together around a shared challenge. You're the person who can take a good idea and make it great by seeing connections others miss.

Your approach to problem-solving is refreshingly human-centered. Where others might focus on technical solutions or process improvements, you instinctively ask, "How will this affect people? How can we make this better for everyone involved?" This perspective often leads to innovations that are not just clever, but truly useful and meaningful.

You've learned that your best ideas often come not from trying to be creative, but from being genuinely engaged with the world around you. A casual conversation with a stranger, an observation about how people behave in different situations, a story someone tells about their challenges—these become the seeds of insights that can transform how things are done.

Your creativity isn't just about generating ideas; it's about bringing them to life in ways that inspire others to get involved. You have this remarkable ability to paint a picture of possibility that makes people want to be part of making it real.`,
          },
          {
            title: "Chapter 3: The Leadership of Inspiration",
            icon: Crown,
            content: `Your leadership style is unlike any textbook definition because it's rooted in something more powerful than authority or expertise—it's rooted in your ability to help people believe in themselves and in what they can accomplish together. You don't lead by commanding; you lead by inspiring.

People follow you not because they have to, but because you make them feel capable of more than they thought possible. You have this gift for seeing potential in people before they see it in themselves, and then creating opportunities for that potential to emerge. You're the leader who celebrates small wins, who acknowledges effort as much as results, who makes people feel valued for who they are, not just what they produce.

Your meetings aren't just about getting through agendas; they're about creating energy and alignment. You have this ability to take a room full of people with different perspectives and help them find common ground, shared purpose, and genuine excitement about working together. You don't just manage teams; you build communities.

But your leadership journey has also taught you important lessons about balance. You've learned that your natural optimism, while generally a strength, sometimes needs to be tempered with realism. You've discovered that your desire to include everyone and consider all perspectives, while admirable, sometimes needs to be balanced with the need to make decisions and move forward.

Your evolution as a leader reflects your growing understanding that inspiration without direction can lead to frustration, and that your role isn't just to make people feel good, but to help them channel their energy toward meaningful outcomes.`,
          },
          {
            title: "Chapter 4: The Dance of Relationships",
            icon: Users,
            content: `Your relationships are like gardens—carefully tended, full of variety, and constantly growing. You don't just collect friends; you cultivate connections that enrich everyone involved. Your social circle is probably diverse, spanning different ages, backgrounds, and interests, because you're genuinely fascinated by the full spectrum of human experience.

In romantic relationships, you're the partner who keeps things interesting, who remembers anniversaries and birthdays, who plans surprises and adventures. You love through enthusiasm and attention, through making your partner feel like the most interesting person in the world. You're not afraid of emotional conversations, and you have this gift for helping your partner see their own strengths and possibilities.

Your friendships are characterized by depth and loyalty. You're the friend who shows up, who remembers what's important to people, who celebrates their successes as enthusiastically as your own. You have this ability to maintain connections across time and distance, to pick up conversations as if no time has passed, to make people feel like they matter to you—because they do.

But relationships have also been your greatest teacher. You've learned that not everyone shares your openness, that some people need more time to trust, that your enthusiasm can sometimes overwhelm people who process emotions differently. You've discovered that love sometimes means giving people space, that support sometimes means listening without trying to fix, that connection sometimes requires patience rather than energy.

Your growth in relationships has been learning to match your energy to what others need while staying true to your authentic, caring nature.`,
          },
          {
            title: "Chapter 5: Your Professional Evolution",
            icon: Target,
            content: `Your career path probably looks less like a ladder and more like a network—full of connections, collaborations, and opportunities that emerged from relationships rather than just qualifications. You've discovered that your ability to work well with others, to communicate ideas effectively, and to create positive team dynamics are just as valuable as any technical skills.

You thrive in roles that involve interaction, collaboration, and the opportunity to influence positive change. Whether you're in sales, marketing, education, consulting, or any field that involves working with people, you bring a unique combination of competence and charisma that makes you effective and memorable.

Your professional relationships are built on trust and mutual respect. Colleagues enjoy working with you not just because you're good at what you do, but because you make the work environment more positive and engaging. You're the person who organizes team events, who remembers personal details about coworkers, who can defuse tension with humor and redirect conflict toward collaboration.

You've learned that your communication skills are a superpower in the professional world. Your ability to present ideas in compelling ways, to facilitate productive discussions, and to build consensus around shared goals makes you invaluable in almost any organizational context.

The evolution of your career reflects your growing understanding of how to channel your natural people skills in service of meaningful outcomes. You've learned to balance your desire to be liked with the need to be effective, to combine your optimism with strategic thinking, and to use your influence responsibly to create positive change.`,
          },
          {
            title: "Chapter 6: The Complexity Behind the Smile",
            icon: Shield,
            content: `Behind your bright exterior lies a depth that surprises people who think they know you. Your optimism isn't naive—it's a choice you make every day, often in the face of the same challenges and disappointments that discourage others. You've learned that maintaining hope and enthusiasm requires strength, not just natural temperament.

You feel things deeply, perhaps more deeply than people realize. Your sensitivity to others' emotions means you often absorb the stress, sadness, and anxiety of people around you. You've had to learn how to protect your own emotional well-being while still being available to support others. This balancing act is one of your ongoing challenges and greatest areas of growth.

Your need for connection sometimes conflicts with your need for authenticity. You've probably experienced moments when you felt pressure to be "on" all the time, to be the source of energy and positivity even when you were struggling yourself. Learning to be vulnerable, to ask for support, to show your own needs and challenges—these have been important parts of your personal development.

You've also developed a sophisticated understanding of group dynamics and human motivation. Your emotional intelligence allows you to read situations quickly, to understand what's really going on beneath the surface of conversations, and to navigate complex social and professional situations with grace and effectiveness.

Your journey has taught you that your gifts come with responsibilities—to use your influence wisely, to be genuine in your connections, and to take care of yourself so you can continue to be a positive force in others' lives.`,
          },
          {
            title: "Chapter 7: Your Expanding Influence",
            icon: Map,
            content: `Your future is bright with possibility, and not just because of your natural optimism. You're entering a phase of your life where your accumulated experience, refined skills, and deepened wisdom are positioning you to make an even greater impact on the world around you.

You're learning to scale your influence beyond direct personal interaction. Whether through mentoring, writing, speaking, or leading larger initiatives, you're discovering ways to touch more lives and create positive change on a broader scale. Your ability to inspire and connect is becoming a force for transformation in your community, your industry, or your field of passion.

The next chapter of your development involves integrating your people skills with strategic thinking, your enthusiasm with wisdom, your optimism with realism. You're becoming someone who can not only envision a better future but also create practical pathways for achieving it.

You're also developing a deeper understanding of your own needs and boundaries. You're learning that taking care of yourself isn't selfish—it's essential for sustaining your ability to care for others. You're discovering that saying no to some things allows you to say yes more fully to the things that matter most.

Your legacy will be measured not just in what you accomplished, but in how many people you helped discover their own potential, how many connections you facilitated, how much joy and possibility you brought into the world. You're a reminder that success isn't just about individual achievement—it's about lifting others up and creating a world where everyone can thrive.

The most exciting part of your story? You're just beginning to understand the full scope of what's possible when someone with your gifts decides to use them intentionally and strategically. The world needs your light, your energy, your belief in human potential. And you're ready to shine brighter than ever.`,
          },
        ],

        traits: [
          "Natural Connector",
          "Idea Generator",
          "Team Energizer",
          "Optimistic Visionary",
          "Communication Master",
        ],
        superpower:
          "Inspiring others to believe in possibilities they never imagined and creating the energy to make them real",
        workStyle:
          "You flourish in collaborative environments where you can brainstorm, connect, and bring out the best in others.",
        communication:
          "Expressive, engaging, and inspiring. You love storytelling and building genuine connections through conversation.",
        teamRole:
          "The enthusiastic catalyst who generates excitement, facilitates collaboration, and keeps morale high.",
      },

      S: {
        title: "The Harmonizer",
        subtitle: "The Keeper of Hearts and Souls",
        color: "#48bb78",
        icon: Heart,

        prologue: {
          title: "Your Origin Story",
          content: `Your story is written in the quiet moments—the times you noticed someone sitting alone and chose to sit beside them, the moments you sensed tension in a room and found a way to ease it, the countless occasions when you put someone else's needs before your own not out of obligation, but out of genuine care.

From an early age, you've been the emotional barometer of your environment, sensing undercurrents that others miss, feeling the weight of others' struggles as if they were your own. This isn't a burden you chose; it's a gift you were born with—the ability to create safety, stability, and peace in a world that often feels chaotic and uncertain.

Your personality was shaped by moments of choosing harmony over conflict, understanding over judgment, patience over frustration. You've always understood that the strongest foundations are built slowly, with care, and that the most meaningful changes happen not through force, but through consistent, gentle influence over time.`,
        },

        chapters: [
          {
            title: "Chapter 1: The Guardian of Peace",
            icon: Shield,
            content: `You are the keeper of harmony in a world that often seems determined to tear itself apart. This role chose you long before you understood what it meant, manifesting first in childhood as the peacemaker between siblings, the friend who could calm others' fears, the presence that made everything feel safer and more manageable.

Your approach to conflict is like that of a skilled diplomat. Where others see battles to be won, you see relationships to be preserved. You understand that most conflicts arise from misunderstanding rather than malice, and you have this remarkable ability to help people see each other's perspectives. You don't avoid difficult conversations; you transform them into opportunities for deeper understanding.

Your peace-making isn't passive—it's actively creative. You work to understand the root causes of tension, to address underlying needs rather than just surface symptoms. You're the person who remembers that behind every difficult behavior is usually a person who is struggling, scared, or feeling unheard.

This gift extends beyond interpersonal relationships to your broader environment. You create spaces—physical and emotional—where people can relax, be themselves, and feel accepted. Your home, your office, your presence itself becomes a sanctuary where others can find respite from the demands and pressures of the outside world.

But your role as a guardian of peace has also taught you about the importance of boundaries. You've learned that keeping peace sometimes requires difficult conversations, that true harmony can't be built on avoiding all conflict, and that your own well-being is essential to your ability to care for others.`,
          },
          {
            title: "Chapter 2: The Art of Deep Listening",
            icon: Heart,
            content: `You possess one of the rarest and most valuable skills in human interaction: the ability to truly listen. Not just to words, but to the emotions behind them, the needs they express, the fears they reveal. When people talk to you, they feel heard in a way that's increasingly rare in our fast-paced, distracted world.

Your listening is active and empathetic. You don't just wait for your turn to speak; you engage with what others are sharing, asking thoughtful questions, reflecting back what you've heard to ensure understanding. You create space for people to explore their own thoughts and feelings, often helping them discover insights they didn't know they had.

This skill has made you a natural counselor and advisor, even when that wasn't your official role. People seek you out when they're struggling, when they need to process difficult decisions, when they just need someone to understand what they're going through. You've probably lost count of the conversations that began with "Can I talk to you about something?" and ended with someone feeling lighter, clearer, and more hopeful.

Your listening extends beyond words to reading the subtle cues that others miss—the slight change in tone that indicates stress, the body language that suggests discomfort, the silence that speaks volumes. You're attuned to the emotional climate around you in ways that allow you to respond with exactly what's needed, often before people even realize they need it.

But deep listening has also taught you about the weight of carrying others' emotions. You've learned the importance of processing what you absorb, of finding healthy ways to release the emotional energy you take on, and of maintaining your own emotional equilibrium while being available to support others.`,
          },
          {
            title: "Chapter 3: The Strength of Steadiness",
            icon: TreePine,
            content: `In a world obsessed with speed and dramatic change, you represent something equally valuable but often overlooked: the power of consistency, reliability, and steady progress. You are the oak tree in the forest—deeply rooted, weathering storms, providing shelter and stability for everything around you.

Your strength isn't the flashy kind that gets headlines; it's the quiet kind that builds foundations. You're the person others can count on to be there, to follow through, to remember what's important. Your word means something because you've built a reputation of reliability through countless small acts of faithfulness over time.

This steadiness extends to your approach to goals and challenges. While others might pursue dramatic transformations or quick fixes, you understand that lasting change happens gradually, through consistent effort and patient persistence. You're willing to do the unglamorous work of building something meaningful, brick by brick, day by day.

Your stability becomes a gift to others in times of uncertainty. When everything else feels chaotic, you provide a sense of continuity and normalcy. People know they can turn to you for grounding, for perspective, for the reassurance that comes from someone who doesn't panic in the face of challenges.

But you've also learned that steadiness doesn't mean stagnation. You've discovered that your consistent nature can be a platform for growth, that your reliability can be a foundation for taking calculated risks, and that your stability can actually enable others to be more adventurous because they know you'll be there to support them.`,
          },
          {
            title: "Chapter 4: The Loyalty That Transforms",
            icon: Crown,
            content: `Your loyalty isn't just a personality trait; it's a force that transforms relationships and creates lasting bonds. When you commit to someone—whether as a friend, partner, colleague, or family member—that commitment runs deep and endures through challenges that might break other connections.

This loyalty manifests in countless ways: remembering what's important to people, showing up during difficult times, defending others when they're not present to defend themselves, investing in relationships even when the immediate return isn't obvious. You understand that the best relationships are built over time, through shared experiences and mutual support.

Your loyalty extends beyond individual relationships to causes, organizations, and communities. When you believe in something, you don't just support it when it's convenient; you stick with it through challenges, setbacks, and periods when others might lose faith. You're the person who keeps traditions alive, who maintains connections across time and distance, who remembers the history and values that give meaning to shared endeavors.

But your journey has also taught you about the difference between healthy loyalty and unhealthy attachment. You've learned that true loyalty sometimes requires difficult conversations, that supporting someone might mean challenging them to grow, and that your commitment to others must be balanced with commitment to your own well-being and values.

Your loyalty creates a ripple effect that extends far beyond your immediate circle. People who experience your faithfulness often become more loyal themselves, creating networks of trust and mutual support that make communities stronger and more resilient.`,
          },
          {
            title: "Chapter 5: Your Professional Sanctuary",
            icon: Target,
            content: `Your career path has been shaped by your values as much as your skills. You're drawn to roles and organizations where you can make a meaningful difference in people's lives, where relationships matter as much as results, where you can contribute to something larger than yourself while staying true to your principles.

You excel in environments that value collaboration, teamwork, and long-term thinking. Whether you're in healthcare, education, social services, human resources, or any field that involves caring for others, you bring a unique combination of competence and compassion that makes you invaluable to your organization and beloved by those you serve.

Your professional relationships are characterized by trust and mutual respect. Colleagues know they can count on you to be fair, to consider everyone's perspective, to follow through on commitments, and to handle sensitive situations with discretion and care. You're often the person others turn to for advice, mediation, or simply a listening ear during stressful times.

You've learned to leverage your natural strengths in professional settings—your ability to build consensus, to create inclusive environments, to support team members through challenges, and to maintain stability during periods of change. You understand that your role often involves being the emotional backbone of your team or organization.

The evolution of your career reflects your growing confidence in the value of your approach. You've learned that your preference for collaboration over competition, your focus on relationships over transactions, and your commitment to sustainable practices over quick wins are not weaknesses to overcome but strengths to leverage.`,
          },
          {
            title: "Chapter 6: The Hidden Warrior",
            icon: Flame,
            content: `Beneath your gentle exterior lies a strength that surprises people who mistake kindness for weakness. You are not passive or pushover; you are strategically patient, choosing your battles carefully and fighting fiercely for what truly matters. When your values are threatened or when someone you care about is in danger, you reveal a protective strength that can be formidable.

Your courage isn't the loud, dramatic kind; it's the quiet courage of standing up for what's right even when it's difficult, of having hard conversations when necessary, of maintaining your principles even under pressure. You've learned that sometimes the most loving thing you can do is to set boundaries, to say no, to refuse to enable behavior that's harmful to others or yourself.

You've also developed a sophisticated understanding of power dynamics and influence. While you prefer collaboration to confrontation, you know how to navigate complex situations, how to build alliances, how to create change through patience and persistence rather than force. Your influence is often more powerful because it's unexpected and because it comes from a place of genuine care rather than self-interest.

Your emotional resilience is remarkable, though often invisible to others. You've weathered storms that would break others, supported people through their darkest moments, and maintained hope and faith even when circumstances seemed hopeless. This resilience comes not from being unaffected by difficulty, but from your deep belief in the possibility of healing, growth, and positive change.

Your journey has taught you that strength and gentleness are not opposites but partners, that the most powerful force for change is often quiet persistence rather than dramatic action, and that your caring nature is not a limitation but a superpower that can transform the world around you.`,
          },
          {
            title: "Chapter 7: Your Legacy of Love",
            icon: Map,
            content: `Your future is rich with the promise of deepening impact and expanding influence. As you continue to grow and evolve, you're discovering new ways to use your gifts for healing, connection, and positive change on an ever-larger scale. Your legacy won't be measured in dramatic achievements but in the countless lives you've touched, the relationships you've nurtured, and the peace you've created.

You're entering a phase where your accumulated wisdom about human nature, relationships, and sustainable change positions you to be a mentor, guide, and source of stability for others who are just beginning their own journeys. Your experience in navigating challenges with grace and maintaining hope through difficulty makes you a valuable resource for anyone facing their own struggles.

The next chapter of your development involves learning to scale your impact while maintaining the personal touch that makes your influence so powerful. You're discovering ways to create systems, environments, and cultures that embody your values of care, respect, and mutual support. Your ability to see the long-term consequences of actions and decisions makes you a valuable voice in planning for sustainable success.

You're also learning to celebrate your own achievements and to recognize the profound value of what you bring to the world. Your humility, while admirable, sometimes prevents you from fully appreciating the magnitude of your positive impact. Learning to acknowledge your contributions isn't vanity; it's necessary for inspiring others and for sustaining your own motivation.

Your legacy will be written in the hearts of the people you've loved, supported, and believed in. It will live on in the peaceful environments you've created, the conflicts you've resolved, the healing you've facilitated. You are proof that the world can be changed not through force or manipulation, but through consistent acts of love, understanding, and care.

The most beautiful part of your story? Every day offers new opportunities to extend your influence, to touch another life, to create a little more peace and understanding in the world. You are a living reminder that the greatest power is the power to heal, to connect, and to love—and you're just beginning to understand the full scope of what's possible when that power is wielded with wisdom and intention.`,
          },
        ],

        traits: ["Loyal Supporter", "Peace Maker", "Emotional Anchor", "Trusted Advisor", "Relationship Builder"],
        superpower:
          "Creating safe spaces where everyone feels valued, heard, and supported to become their best selves",
        workStyle:
          "You excel in stable, collaborative environments where you can build deep relationships and support long-term goals.",
        communication:
          "Thoughtful, diplomatic, and empathetic. You listen more than you speak and always consider others' feelings.",
        teamRole:
          "The reliable foundation who ensures everyone feels supported, conflicts are resolved, and projects stay on track.",
      },

      C: {
        title: "The Perfectionist",
        subtitle: "The Architect of Excellence",
        color: "#3182ce",
        icon: Brain,

        prologue: {
          title: "Your Origin Story",
          content: `Your story begins with questions—not the simple ones that most people ask, but the deeper ones that reveal the complexity and beauty hidden beneath the surface of everyday things. Even as a child, you were the one who wanted to understand how things really worked, who noticed details others missed, who couldn't be satisfied with "because that's how it is" as an explanation.

Your mind was built for precision, for seeing patterns and connections that others overlook, for understanding the intricate systems that make the world function. This isn't just about being smart—it's about having a fundamental need to comprehend, to analyze, to get things right not for the sake of being right, but because accuracy and quality matter deeply to you.

Your personality was forged in moments when you chose depth over speed, quality over quantity, understanding over assumption. You've always been driven by an internal standard of excellence that has nothing to do with impressing others and everything to do with honoring the complexity and importance of whatever you're working on.`,
        },

        chapters: [
          {
            title: "Chapter 1: The Mind That Sees Everything",
            icon: Brain,
            content: `Your mind is like a high-resolution camera that captures details others miss, patterns others overlook, and connections others never consider. This isn't just about being observant—it's about having a fundamental orientation toward understanding the world in all its complexity and nuance.

You see systems where others see chaos, logic where others see randomness, potential problems where others see only current success. This ability to perceive multiple layers of reality simultaneously is both a gift and a responsibility. You often find yourself in the position of being the person who spots the flaw in the plan, who asks the question no one else thought to ask, who sees the long-term consequences of short-term decisions.

Your analytical nature extends beyond professional or academic contexts to every aspect of your life. You approach relationships, decisions, and challenges with the same careful consideration you bring to complex problems. You want to understand not just what is happening, but why it's happening, how it connects to other things, and what it means for the future.

This depth of perception sometimes makes you feel isolated, especially when you're surrounded by people who seem content with surface-level understanding. You've learned that your need for thoroughness and accuracy isn't shared by everyone, and that sometimes you need to translate your insights into language and concepts that others can grasp and appreciate.

But your ability to see everything also means you see possibilities for improvement everywhere. You're not critical because you're negative; you're critical because you can envision how things could be better, more efficient, more elegant, more effective.`,
          },
          {
            title: "Chapter 2: The Pursuit of Excellence",
            icon: Star,
            content: `Excellence isn't just a goal for you—it's a way of being. You approach every task, every project, every responsibility with a commitment to quality that goes far beyond what's required or expected. This isn't perfectionism in the neurotic sense; it's a deep respect for the importance of doing things well.

Your standards are high because you understand that details matter, that small errors can have large consequences, that the difference between good and excellent often determines whether something truly serves its intended purpose. You've seen too many projects fail, too many opportunities missed, too many problems created because someone cut corners or accepted "good enough" when excellence was possible.

This commitment to excellence extends to your personal development as well. You're constantly learning, growing, refining your skills and understanding. You read extensively, seek out expert opinions, and aren't satisfied with superficial knowledge about subjects that interest you. You want to understand things deeply, thoroughly, correctly.

Your pursuit of excellence sometimes puts you at odds with cultures that prioritize speed over quality, quantity over depth, or appearance over substance. You've learned to navigate environments where your thoroughness might be seen as slowness, where your attention to detail might be viewed as nitpicking, where your high standards might be perceived as unrealistic.

But you've also discovered that your commitment to excellence creates value that compounds over time. The extra effort you put into getting things right the first time saves enormous amounts of time and resources later. The systems you design work better and last longer. The solutions you develop address root causes rather than just symptoms.`,
          },
          {
            title: "Chapter 3: The Strategic Mind",
            icon: Compass,
            content: `Your thinking operates on multiple time horizons simultaneously. While others focus on immediate needs and short-term solutions, you naturally consider long-term implications, potential unintended consequences, and systemic effects. This strategic perspective makes you invaluable in planning and decision-making contexts.

You approach problems like a chess master, thinking several moves ahead, considering multiple scenarios, anticipating how different stakeholders might respond to various options. You don't just solve problems; you solve them in ways that prevent future problems and create platforms for future opportunities.

Your strategic thinking extends beyond professional contexts to personal decisions as well. You research major purchases thoroughly, consider the long-term implications of career moves, and think carefully about the relationships and commitments you make. This isn't because you're indecisive; it's because you understand that good decisions require good information and careful analysis.

You've learned that your strategic perspective is particularly valuable during times of change or uncertainty. When others are reacting emotionally to immediate pressures, you can step back, analyze the situation objectively, and identify the most effective path forward. Your ability to remain calm and analytical under pressure makes you a natural advisor and problem-solver.

But you've also discovered that strategic thinking needs to be balanced with action. Your tendency to want complete information before making decisions sometimes needs to be tempered with the recognition that perfect information is rarely available and that sometimes the cost of delay outweighs the benefit of additional analysis.`,
          },
          {
            title: "Chapter 4: The Art of Precise Communication",
            icon: MessageCircle,
            content: `Your communication style reflects your thinking style—precise, thoughtful, and substantive. You don't speak just to fill silence; you speak when you have something meaningful to contribute. When you do communicate, your words are carefully chosen, your arguments are well-reasoned, and your information is accurate and relevant.

You prefer written communication for complex topics because it allows you to organize your thoughts clearly, provide necessary context, and ensure that important details aren't lost or misunderstood. Your emails, reports, and proposals are models of clarity and completeness, providing readers with exactly the information they need to understand the situation and make informed decisions.

In meetings and discussions, you're the person who asks the clarifying questions, who points out assumptions that need to be examined, who ensures that important considerations aren't overlooked. You help groups think more clearly and make better decisions by bringing analytical rigor to conversations that might otherwise be dominated by emotion or incomplete information.

Your communication challenges often arise from the gap between your need for precision and others' preference for brevity or simplicity. You've learned to adapt your communication style to your audience, providing executive summaries for those who want the bottom line while maintaining detailed documentation for those who need comprehensive information.

You've also discovered that your credibility comes not just from what you know, but from your track record of being right about things that matter. People learn to pay attention when you speak because your insights are typically well-founded and your predictions often prove accurate.`,
          },
          {
            title: "Chapter 5: Your Professional Mastery",
            icon: Target,
            content: `Your career has been built on a foundation of competence, reliability, and continuous improvement. You're drawn to roles that require expertise, attention to detail, and the ability to solve complex problems. Whether you're in engineering, finance, research, quality assurance, or any field that demands precision and analytical thinking, you bring a level of thoroughness and insight that sets you apart.

You excel in environments that value accuracy, quality, and systematic approaches to challenges. You're the person others turn to when they need someone to analyze a complex situation, design a robust solution, or ensure that important details aren't overlooked. Your work is characterized by its reliability, thoroughness, and long-term value.

Your professional relationships are built on respect for your expertise and appreciation for your reliability. Colleagues know that when you take on a project, it will be done right, that when you provide analysis, it will be accurate and comprehensive, and that when you identify a problem, you'll also have thoughtful recommendations for addressing it.

You've learned to leverage your natural strengths while developing skills in areas that don't come as naturally. You've worked on becoming more comfortable with ambiguity, more willing to make decisions with incomplete information, and more effective at communicating complex ideas to non-technical audiences.

The evolution of your career reflects your growing understanding of how to balance your need for thoroughness with organizational needs for speed and efficiency. You've learned to prioritize your analytical efforts, focusing your detailed attention on the areas where it will have the greatest impact.`,
          },
          {
            title: "Chapter 6: The Depth Behind the Analysis",
            icon: Shield,
            content: `Behind your analytical exterior lies a deep well of caring and commitment that drives everything you do. Your attention to detail isn't obsessive; it's protective. You care so much about getting things right because you understand that errors can have real consequences for real people. Your high standards aren't about ego; they're about responsibility.

You feel the weight of your expertise and the trust that others place in your judgment. When people rely on your analysis to make important decisions, you take that responsibility seriously. You know that your recommendations might affect people's careers, organizations' futures, or communities' well-being, and this knowledge motivates your commitment to accuracy and thoroughness.

Your perfectionism sometimes creates internal pressure that others don't see. You set high standards for yourself not because you enjoy stress, but because you believe that excellence is a form of service to others. You want your work to be something you can be proud of, something that truly serves its intended purpose.

You've also developed a deep appreciation for the beauty of well-designed systems, elegant solutions, and precise execution. You find satisfaction in work that is not just functional but beautiful in its logic, efficiency, and completeness. This aesthetic appreciation for quality and precision is part of what drives your commitment to excellence.

Your journey has taught you the importance of self-compassion and realistic expectations. You've learned that perfection is often the enemy of progress, that sometimes good enough really is good enough, and that your value isn't determined by your ability to eliminate every possible error or flaw.`,
          },
          {
            title: "Chapter 7: Your Legacy of Precision",
            icon: Map,
            content: `Your future holds the promise of even greater impact as your expertise deepens and your influence expands. You're entering a phase where your accumulated knowledge, refined judgment, and proven track record position you to tackle increasingly complex challenges and to mentor others who are developing their own analytical capabilities.

You're learning to scale your impact beyond individual projects to systemic improvements that benefit entire organizations or communities. Your ability to see patterns, identify root causes, and design comprehensive solutions makes you valuable in addressing large-scale challenges that require both technical expertise and strategic thinking.

The next chapter of your development involves learning to balance your natural inclination toward thoroughness with the need to make timely decisions and to help others understand and implement your recommendations. You're discovering that your greatest impact often comes not just from your individual analysis, but from your ability to build analytical capabilities in others.

You're also developing a deeper appreciation for the collaborative aspects of complex problem-solving. While you excel at independent analysis, you're learning that the most challenging problems often require diverse perspectives and that your analytical skills are most powerful when combined with others' creativity, relationship skills, and practical experience.

Your legacy will be written in the systems you've improved, the problems you've solved, and the standards of excellence you've established. But it will also be measured in the people you've mentored, the analytical thinking you've promoted, and the culture of quality and precision you've helped create.

The most exciting part of your story? You're just beginning to understand how your gifts for analysis, precision, and systematic thinking can be applied to the biggest challenges facing our world. Your commitment to getting things right, your ability to see complex patterns, and your dedication to excellence are exactly what's needed to address the complex, interconnected problems that require both technical expertise and careful, thoughtful analysis.

You are proof that in a world of quick fixes and superficial solutions, there is still immense value in depth, precision, and the patient pursuit of understanding. Your story is one of quiet excellence, of problems solved and systems improved, of a mind dedicated to making things work better for everyone.`,
          },
        ],

        traits: ["Quality Guardian", "Systems Thinker", "Detail Master", "Strategic Analyst", "Problem Solver"],
        superpower:
          "Spotting what others miss and creating systems that actually work through meticulous analysis and unwavering commitment to excellence",
        workStyle:
          "You thrive in structured environments where you can dive deep, analyze thoroughly, and deliver excellence.",
        communication:
          "Precise, fact-based, and thorough. You prefer clear, detailed information and well-thought-out discussions.",
        teamRole:
          "The quality assurance expert who ensures everything meets the highest standards and identifies potential issues before they become problems.",
      },
    }
    return stories[type]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 to-blue-500 rounded-full"></div>
              <span className="font-semibold text-gray-900">Personality Discovery</span>
            </div>
            <UserNav />
          </div>
        </header>

        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6">
              <motion.div
                className="w-full h-full border-4 border-gray-300 border-t-gray-900 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Crafting Your Personal Story...</h2>
            <p className="text-gray-600">We're weaving together the threads of your unique personality narrative!</p>
          </motion.div>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 flex items-center justify-center px-6">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <CardTitle>Unable to Load Your Story</CardTitle>
            <CardDescription>
              {error || "We couldn't find your results. Ready to discover your personality story?"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button onClick={() => router.push("/test")} className="w-full">
              Begin Your Journey
            </Button>
            <Button onClick={fetchResults} variant="outline" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const personalityStory = getPersonalityStory(result.dominantType)
  const PersonalityIcon = personalityStory.icon

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 to-blue-500 rounded-full"></div>
            <span className="font-semibold text-gray-900">Your Personality Story</span>
          </div>
          <UserNav />
        </div>
      </header>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md mx-4"
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 2 }}>
                <BookOpen className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Story Awaits! 📖</h2>
              <p className="text-gray-600">Get ready to discover the fascinating narrative of who you are!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Story Book Cover */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Card className="overflow-hidden border-t-8 shadow-2xl" style={{ borderTopColor: personalityStory.color }}>
            <CardContent className="p-0">
              <div
                className="relative h-64 flex items-center justify-center text-white"
                style={{
                  background: `linear-gradient(135deg, ${personalityStory.color}dd, ${personalityStory.color}aa)`,
                }}
              >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative text-center z-10">
                  <PersonalityIcon className="h-16 w-16 mx-auto mb-4 drop-shadow-lg" />
                  <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">{personalityStory.title}</h1>
                  <p className="text-xl md:text-2xl font-medium opacity-90 drop-shadow">{personalityStory.subtitle}</p>
                  <Badge variant="secondary" className="mt-4 text-lg px-4 py-2 bg-white/20 text-white border-white/30">
                    Type {result.dominantType}
                  </Badge>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                    Your Personal Story
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">{personalityStory.prologue.title}</h2>
                <div className="prose prose-lg max-w-none">
                  {personalityStory.prologue.content.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
          </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Your Journey of Discovery
              </CardTitle>
              <CardDescription>Navigate through the chapters of your personality story</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalityStory.chapters.map((chapter, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentChapter(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      currentChapter === index
                        ? `border-[${personalityStory.color}] bg-gray-50`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: personalityStory.color }}
                      >
                        {(() => {
                          const Icon = personalityStory.chapters[index]?.icon
                          return Icon ? <Icon className="h-6 w-6" /> : null
                        })()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                        <p className="text-sm text-gray-600">Click to read this chapter</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Chapter */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapter}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: personalityStory.color }}
                  >
                    <PersonalityIcon className="h-6 w-6" />
                  </div>
                  \
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {personalityStory.chapters[currentChapter].title}
                    </CardTitle>
                    <CardDescription>
                      Chapter {currentChapter + 1} of {personalityStory.chapters.length}
                    </CardDescription>
                  </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
                <div className="prose prose-lg max-w-none">
                  {personalityStory.chapters[currentChapter].content.split("\n\n").map((paragraph, index) => (
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
                      setCurrentChapter(Math.min(personalityStory.chapters.length - 1, currentChapter + 1))
                    }
                    disabled={currentChapter === personalityStory.chapters.length - 1}
                    className="flex items-center gap-2"
                    style={{ backgroundColor: personalityStory.color }}
                  >
                    Next Chapter
                    <ChevronDown className="h-4 w-4" />
                  </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </AnimatePresence>

        {/* AI-Generated Insight */}
        {insight && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Your Personal Oracle
                </CardTitle>
                <CardDescription>
                  A personalized insight crafted specifically for your unique personality pattern
                </CardDescription>
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
          </motion.div>
        )}

        {/* Personality Traits Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Your Signature Strengths
              </CardTitle>
              <CardDescription>The core traits that define your unique approach to life and work</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {personalityStory.traits.map((trait, index) => (
                  <motion.div
                    key={trait}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white"
                      style={{ backgroundColor: personalityStory.color }}
                    >
                      <Star className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{trait}</h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Your Superpower</h4>
                    <p className="text-gray-700 text-lg leading-relaxed">{personalityStory.superpower}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Score Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-12"
        >
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
        </motion.div>

        {/* Detailed Insights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Your Communication Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{personalityStory.communication}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Your Work Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{personalityStory.workStyle}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Your Team Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{personalityStory.teamRole}</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center mb-12"
        >
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="outline" size="lg" className="gap-2" onClick={() => router.push("/test")}>
              <RefreshCw className="h-4 w-4" />
              Retake Assessment
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Download className="h-4 w-4" />
              Download Your Story
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share Your Journey
            </Button>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden">
            <CardContent className="p-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
              <div className="relative z-10">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-300" />
                <h3 className="text-3xl font-bold mb-4">Your Story Continues...</h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-lg leading-relaxed">
                  This is just the beginning of your journey of self-discovery. Now that you understand your personality
                  story, it's time to write the next chapters by applying these insights to build stronger
                  relationships, achieve your goals, and create the life you envision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-medium">
                  Explore Team Compatibility
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    Continue Your Journey
                </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
