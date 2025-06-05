"use client"

import { motion } from "framer-motion"
import { Zap, Sparkles, Heart, Brain, Quote, ArrowRight, BookOpen, Users, History } from "lucide-react"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { UserNav } from "components/user-nav"

export default function Colors() {
  const [activeSection, setActiveSection] = useState("story")

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-gray-800">
      {/* Header with Navigation */}
      <header className="relative z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 to-blue-500 rounded-full"></div>
            <span className="font-semibold text-gray-900">Color Psychology</span>
          </div>
          <UserNav />
        </div>
      </header>
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {colorCards.map((card, index) => (
            <motion.div
              key={`blob-${index}`}
              className={`absolute rounded-full blur-3xl opacity-10`}
              style={{
                backgroundColor: card.color,
                width: `${Math.random() * 30 + 20}%`,
                height: `${Math.random() * 30 + 20}%`,
                top: `${Math.random() * 70}%`,
                left: `${Math.random() * 70}%`,
              }}
              animate={{
                x: [0, 10, 0, -10, 0],
                y: [0, -10, 0, 10, 0],
              }}
              transition={{
                duration: 20 + index * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 px-6 py-24 md:py-32">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight">
                The Psychology Behind the Colors
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore the fascinating journey of how colors became the language of personality — a visual framework
                that transformed how we understand ourselves and connect with others.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex overflow-x-auto scrollbar-hide space-x-8 py-4">
            {[
              { id: "story", label: "The Story", icon: BookOpen },
              { id: "colors", label: "Color Personalities", icon: Users },
              { id: "history", label: "Historical Context", icon: History },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center space-x-2 whitespace-nowrap px-1 py-2 border-b-2 transition-all ${
                  activeSection === tab.id
                    ? "border-gray-800 text-gray-800 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* The Story Section */}
        {activeSection === "story" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-bold mb-12 text-gray-900">The Journey of Color Psychology</h2>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-gray-200 transform md:translate-x-[-0.5px]"></div>

              {storySections.map((section, index) => (
                <motion.div
                  key={index}
                  className="mb-16 relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div
                    className={`flex flex-col md:flex-row items-start ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-[-8px] md:left-1/2 md:transform md:translate-x-[-8px] top-0 w-4 h-4 rounded-full bg-gray-800 border-4 border-white shadow-sm"></div>

                    {/* Date/Era */}
                    <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <div className="bg-gray-800 text-white text-sm font-medium py-1 px-3 rounded-full inline-block mb-2">
                        {section.era}
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`md:w-1/2 pt-1 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2">{section.title}</h3>
                      {section.subtitle && <p className="text-md text-gray-500 italic mb-3">{section.subtitle}</p>}
                      <p className="text-base md:text-lg text-gray-700 leading-relaxed">{section.content}</p>

                      {section.quote && (
                        <div className="mt-6 pl-4 border-l-4 border-gray-300 italic text-gray-600">
                          <Quote className="h-4 w-4 inline mr-2 text-gray-400" />
                          {section.quote}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" onClick={() => setActiveSection("colors")} className="group">
                Discover the Four Colors
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Color Personalities Section */}
        {activeSection === "colors" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">The Four Personality Colors</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Each color represents a distinct personality type with unique strengths, communication styles, and
                approaches to life's challenges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {colorCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card
                    className="overflow-hidden h-full border-t-4 hover:shadow-lg transition-all duration-300"
                    style={{ borderTopColor: card.color }}
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div
                          className={`h-14 w-14 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110`}
                          style={{ backgroundColor: card.color }}
                        >
                          <card.icon className="h-7 w-7" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800">{card.title}</h3>
                      </div>

                      <p className="text-gray-600 leading-relaxed mb-4">{card.description}</p>

                      <div className="mt-6 space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
                            Key Traits
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {card.traits.map((trait, i) => (
                              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
                            Strengths
                          </h4>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {card.strengths.map((strength, i) => (
                              <li key={i}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Understanding Your Color Blend</h3>
              <p className="text-gray-700 mb-4">
                Most people are a combination of multiple colors, with one or two dominant traits. Your unique blend
                shapes how you interact with the world and others around you.
              </p>
              <div className="flex justify-center mt-6">
                <div className="w-full max-w-md h-8 rounded-full overflow-hidden flex">
                  {colorCards.map((card, i) => (
                    <div
                      key={i}
                      className="h-full transition-all duration-500 hover:flex-grow"
                      style={{
                        backgroundColor: card.color,
                        width: `${25 + (i === 1 ? 10 : i === 2 ? 5 : 0)}%`,
                        opacity: 0.8,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                Example: A personality with dominant Yellow, strong Red, moderate Green, and minimal Blue traits
              </p>
            </div>
          </motion.div>
        )}

        {/* Historical Context Section */}
        {activeSection === "history" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Historical Context & Research</h2>

            <div className="space-y-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">William Moulton Marston's Legacy</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <p className="text-gray-700 mb-4">
                      Beyond developing the DISC theory, Marston was a remarkable polymath. He invented an early
                      prototype of the lie detector, wrote self-help books, and even created Wonder Woman, infusing the
                      character with his psychological theories about emotional intelligence and feminine strength.
                    </p>
                    <p className="text-gray-700">
                      His 1928 book "Emotions of Normal People" laid the groundwork for understanding how emotions drive
                      behavior and how different personality types respond to environmental pressures.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">From DISC to Color Psychology</h3>
                <p className="text-gray-700 mb-4">
                  The transformation of Marston's DISC model into the color-based system we know today happened
                  gradually through the work of various psychologists and authors. The color coding made the complex
                  psychological concepts more accessible and memorable.
                </p>
                <p className="text-gray-700 mb-4">
                  Thomas Erikson's bestselling book "Surrounded by Idiots" popularized the four-color system, though
                  similar approaches had been used in corporate training programs for decades.
                </p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {colorCards.map((card, i) => (
                    <div key={i} className="text-center">
                      <div
                        className="w-full aspect-square rounded-full mx-auto mb-2 flex items-center justify-center"
                        style={{ backgroundColor: card.color, opacity: 0.8 }}
                      >
                        <span className="text-white font-bold text-xl">
                          {card.title.split("–")[0].trim().charAt(0)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{card.discType}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Modern Applications</h3>
                <p className="text-gray-700 mb-4">Today, color personality assessments are used in:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Corporate team building and leadership development</li>
                  <li>Conflict resolution and communication training</li>
                  <li>Educational settings to understand learning styles</li>
                  <li>Relationship counseling and personal development</li>
                  <li>Career guidance and professional development</li>
                </ul>
                <p className="text-gray-700">
                  While not as scientifically rigorous as the Big Five personality traits or Myers-Briggs Type
                  Indicator, the color system offers an intuitive entry point into understanding personality
                  differences.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer / Call to Action */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Discover Your Color Profile</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Understanding your dominant color can help you leverage your strengths, improve your relationships, and
            navigate challenges more effectively.
          </p>
          <Button className="bg-white text-gray-900 hover:bg-gray-100">Take the Assessment</Button>
        </div>
      </div>
    </div>
  )
}

const storySections = [
  {
    era: "1920s",
    title: "The Birth of DISC Theory",
    subtitle: "William Moulton Marston's breakthrough",
    content:
      "William Moulton Marston, a Harvard-trained psychologist with a passion for understanding normal human behavior, developed a groundbreaking theory. Unlike his contemporaries who focused on disorders, Marston was fascinated by how everyday people respond to their environment. His research led him to identify four primary behavioral patterns that would later become the foundation of the DISC model.",
    quote: "Emotions drive behavior, and understanding these emotional patterns is the key to understanding people.",
  },
  {
    era: "1950s-1970s",
    title: "From Theory to Practice",
    content:
      "After Marston's death, industrial psychologists began applying his theories to workplace dynamics. The DISC assessment was developed as a practical tool for understanding how people behave in professional settings. Organizations discovered that teams with diverse behavioral styles often performed better when members understood each other's natural tendencies.",
  },
  {
    era: "1980s-1990s",
    title: "The Visual Revolution",
    subtitle: "Making psychology accessible through color",
    content:
      "As personality assessments gained popularity, practitioners sought ways to make complex psychological concepts more accessible. Colors—red, yellow, green, and blue—were introduced as visual shorthand for the four DISC types. This simple but powerful innovation transformed how people understood and remembered personality differences.",
  },
  {
    era: "2000s-Present",
    title: "Global Phenomenon",
    content:
      "Author Thomas Erikson's bestselling books popularized the color personality system worldwide. The visual framework resonated with millions because it simplified complex human dynamics without oversimplifying human nature. Today, the four-color model is used in corporate training, education, relationship counseling, and personal development across cultures.",
    quote:
      "The beauty of the color system is that it gives us a language to discuss our differences without judgment or hierarchy.",
  },
]

const colorCards = [
  {
    title: "Red – The Driver",
    description:
      "Reds are natural leaders who thrive on challenges and results. They make decisions quickly, take risks confidently, and pursue goals with unwavering determination. Direct and straightforward, they value efficiency and achievement above all else.",
    icon: Zap,
    color: "#e53e3e",
    iconBg: "bg-red-500",
    traits: ["Decisive", "Direct", "Competitive", "Results-oriented", "Bold"],
    strengths: [
      "Taking initiative and driving projects forward",
      "Making tough decisions under pressure",
      "Cutting through obstacles to achieve goals",
      "Leading teams through challenges",
    ],
    discType: "Dominance",
  },
  {
    title: "Yellow – The Influencer",
    description:
      "Yellows bring energy and enthusiasm to everything they do. Natural networkers with charismatic personalities, they excel at inspiring others and generating creative ideas. They're optimistic, expressive, and thrive in social environments where they can share their vision.",
    icon: Sparkles,
    color: "#ecc94b",
    iconBg: "bg-yellow-400",
    traits: ["Enthusiastic", "Persuasive", "Optimistic", "Creative", "Social"],
    strengths: [
      "Building relationships and networks",
      "Generating innovative ideas and solutions",
      "Motivating and inspiring team members",
      "Creating positive energy in groups",
    ],
    discType: "Influence",
  },
  {
    title: "Green – The Supporter",
    description:
      "Greens are the compassionate peacemakers who prioritize harmony and connection. Patient, empathetic, and reliable, they create stable environments where everyone feels valued. They listen deeply, offer consistent support, and excel at building trusting relationships.",
    icon: Heart,
    color: "#48bb78",
    iconBg: "bg-green-500",
    traits: ["Patient", "Empathetic", "Reliable", "Diplomatic", "Calm"],
    strengths: [
      "Creating harmony and reducing conflict",
      "Listening and understanding others' needs",
      "Building stable, trusting relationships",
      "Supporting team members through challenges",
    ],
    discType: "Steadiness",
  },
  {
    title: "Blue – The Analyzer",
    description:
      "Blues approach life with precision and thoughtfulness. Detail-oriented and analytical, they value accuracy, quality, and logical processes. They excel at solving complex problems, creating systems, and ensuring everything meets the highest standards.",
    icon: Brain,
    color: "#3182ce",
    iconBg: "bg-blue-500",
    traits: ["Analytical", "Detail-oriented", "Precise", "Methodical", "Logical"],
    strengths: [
      "Analyzing complex problems and finding solutions",
      "Creating systems and processes that work",
      "Ensuring quality and accuracy in all work",
      "Planning thoroughly before taking action",
    ],
    discType: "Conscientiousness",
  },
]
