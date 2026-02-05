"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { ArrowRight, Sparkles, Brain, Zap, Heart, CheckCircle, Users, TrendingUp, Building2 } from "lucide-react"
import { UserNav } from "components/user-nav"

// Predefined blob positions and sizes
const blobConfigs = [
  { width: "32.387%", height: "20.167%", top: "59.855%", left: "55.574%" },
  { width: "26.827%", height: "15.918%", top: "75.037%", left: "14.112%" },
  { width: "37.978%", height: "24.928%", top: "79.683%", left: "48.003%" },
  { width: "36.897%", height: "23.540%", top: "36.119%", left: "50.640%" }
]

const colorCards = [
  {
    color: "#e53e3e",
    title: "Red Energy",
    icon: Zap,
    description: "Bold, direct, and results-driven. Reds are natural leaders who focus on the big picture, take risks, and embrace challenges. They value results, action, and efficiency.",
    strengths: [
      "Taking initiative and driving projects forward",
      "Making tough decisions under pressure",
      "Leading teams through challenges",
    ],
  },
  {
    color: "#ecc94b",
    title: "Yellow Joy",
    icon: Sparkles,
    description: "Enthusiastic, creative, and social. Yellows are optimistic communicators who value social recognition, group activities, and relationships. They bring energy and optimism to teams.",
    strengths: [
      "Building relationships and networks",
      "Generating innovative ideas",
      "Motivating and inspiring others",
    ],
  },
  {
    color: "#48bb78",
    title: "Green Growth",
    icon: Heart,
    description: "Patient, loyal, and relationship-focused. Greens are team players who create harmony and stability. They listen deeply and offer consistent support.",
    strengths: [
      "Creating harmony and reducing conflict",
      "Building stable, trusting relationships",
      "Supporting team members",
    ],
  },
  {
    color: "#3182ce",
    title: "Blue Depth",
    icon: Brain,
    description: "Precise, logical, and detail-oriented. Blues are methodical thinkers who value accuracy and quality. They excel at solving complex problems.",
    strengths: [
      "Analyzing complex problems",
      "Ensuring quality and accuracy",
      "Creating systematic processes"
    ],
  }
]

export default function Home() {
  return (
    
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Header with UserNav */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-10 h-10 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md"
            >
              <span className="font-bold text-white text-lg">T</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="font-bold text-2xl text-gray-900">TAFSULA</span>
              <p className="text-xs text-gray-500 -mt-1">Team Compatibility Analysis</p>
            </motion.div>
          </div>
         
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/about">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                About
              </Button>
            </Link>
            <Link href="/organizations">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                Organizations
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                Events
              </Button>
            </Link>
            <Link href="/colors">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                Learn More
              </Button>
            </Link>
            <Link href="/test">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                Take Assessment
              </Button>
            </Link>
          </nav>

          <UserNav />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Animated background elements */}
          <div className="absolute inset-0 z-0">
            {colorCards.map((card, index) => (
              <motion.div
                key={`hero-blob-${index}`}
                className="absolute rounded-full blur-3xl opacity-5"
                style={{
                  backgroundColor: card.color,
                  width: blobConfigs[index].width,
                  height: blobConfigs[index].height,
                  top: blobConfigs[index].top,
                  left: blobConfigs[index].left
                }}
                animate={{
                  x: [0, 20, 0, -20, 0],
                  y: [0, -20, 0, 20, 0],
                }}
                transition={{
                  duration: 25 + index * 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div
                className="flex flex-col justify-center space-y-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-6">
                  <motion.h1
                    className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Discover Your True{" "}
                    <span className="bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 bg-clip-text text-transparent">
                      Personality Colors
                    </span>
                  </motion.h1>
                  <motion.p
                    className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Unlock the vibrant spectrum of your personality and understand how you naturally connect with the
                    world around you. Build stronger teams through scientific personality assessment.
                  </motion.p>
                </div>

                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <p className="italic text-lg font-medium text-gray-700 mb-2">
                    "Understanding personality differences is the key to building exceptional teams that achieve
                    extraordinary results."
                  </p>
                  <p className="text-sm text-gray-500">— Team Development Research</p>
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Link href="/test" className="flex-1">
                    <Button
                      size="lg"
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white group transition-all duration-300"
                    >
                      <span>Start Your Assessment</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/colors" className="flex-1">
                    <Button size="lg" variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                      Learn More
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="grid grid-cols-2 gap-6">
                  {colorCards.map((card, index) => (
                    <motion.div
                      key={card.title}
                      className="relative group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                    >
                      <div
                        className="w-32 h-32 md:w-40 md:h-40 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:shadow-xl"
                        style={{ backgroundColor: card.color }}
                      >
                        <div className="text-center">
                          <card.icon className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-2" />
                          <span className="text-lg md:text-xl font-bold">{card.title.split(" ")[0]}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Personality Colors Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">The Four Personality Colors</h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Each color represents a distinct personality type with unique traits, strengths, and communication
                  styles that shape how we work and interact.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {colorCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card
                    className="h-full p-6 border-t-4 hover:shadow-lg transition-all duration-300"
                    style={{ borderTopColor: card.color }}
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110"
                        style={{ backgroundColor: card.color }}
                      >
                        <card.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{card.description}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
                        Key Strengths
                      </h4>
                      <ul className="space-y-1">
                        {card.strengths.slice(0, 3).map((strength, i) => (
                          <li key={i} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Tafsula Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Tafsula?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our platform offers comprehensive tools to help startups and teams build stronger, more compatible
                working relationships
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full p-6 text-center hover:shadow-lg transition-all duration-300">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gray-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Build a Stronger Team?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Take the comprehensive personality assessment today and gain valuable insights into your team's
                compatibility and dynamics
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/test">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-8">
                    Start Assessment
                  </Button>
                </Link>
                <Link href="/colors">
                  <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
              >
                Powerful Features for Modern Teams
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
              >
                From DISC assessments to organization profiles and event management
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="h-full p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-6 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Organizations & Events Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="inline-flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Organizations & Events</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Build Your Organization Profile
                </h2>
                <p className="text-lg text-gray-600">
                  Create a professional presence with your organization profile. Showcase events, training programs, and connect with talented professionals.
                </p>
                <ul className="space-y-3">
                  {[
                    "Professional organization profiles",
                    "Event and training management",
                    "Organization directory and discovery",
                    "Event registration system",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-4 pt-4">
                  <Link href="/organizations">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Explore Organizations
                    </Button>
                  </Link>
                  <Link href="/events">
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      View Events
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl opacity-50" />
                <Card className="relative z-10 p-8 border-0 shadow-xl">
                  <div className="space-y-4">
                    <div className="h-40 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg opacity-80" />
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-2 bg-gray-300 rounded w-32 mb-2" />
                        <div className="h-2 bg-gray-200 rounded w-24" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded w-full" />
                      <div className="h-2 bg-gray-200 rounded w-5/6" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Transform Your Team?</h2>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                Join thousands of organizations using Tafsula to build stronger, more compatible teams
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/test">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
                    <span>Take the Assessment</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/organizations">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/20">
                    <span>Explore Organizations</span>
                    <Users className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 rounded-lg"></div>
                <span className="text-white text-lg font-semibold">Tafsula</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Building stronger startup teams through scientific personality assessment and compatibility analysis.
              </p>
            </div>
            <div>
              <h4 className="text-white text-md font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About DISC
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Research
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-md font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-md font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-500">&copy; {new Date().getFullYear()} Tafsula. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "Accurate Assessment",
    description:
      "Our scientifically validated DISC assessment provides accurate insights into personality traits and work styles, helping you understand team dynamics.",
    icon: CheckCircle,
  },
  {
    title: "Team Compatibility",
    description:
      "Analyze how team members work together and identify potential areas of conflict or synergy to build more effective teams.",
    icon: Users,
  },
  {
    title: "Actionable Insights",
    description:
      "Get personalized recommendations and insights to improve team dynamics, communication, and overall performance.",
    icon: TrendingUp,
  },
]
