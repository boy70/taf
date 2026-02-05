"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card } from "../../components/ui/card"
import { OrganizationCard } from "../../components/organization-card"
import { UserNav } from "../../components/user-nav"
import { Search, Building2, ArrowRight, Sparkles } from "lucide-react"

interface StartupData {
  id: string
  name: string
  startupProfile?: {
    profileImageUrl?: string
    bio?: string
    location?: string
    isPublic: boolean
  }
  _count?: {
    user: number
    event: number
    project: number
  }
}

export default function OrganizationsPage() {
  const [startups, setStartups] = useState<StartupData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchStartups()
  }, [page])

  const fetchStartups = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/organizations?page=${page}&limit=12`)
      const data = await response.json()
      setStartups(data.startups)
      setTotalPages(data.pages)
    } catch (error) {
      console.error("Failed to fetch startups:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStartups = startups.filter((startup) =>
    startup.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              className="w-10 h-10 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md"
            >
              <span className="font-bold text-white text-lg">T</span>
            </motion.div>
            <div>
              <span className="font-bold text-xl text-gray-900">TAFSULA</span>
              <p className="text-xs text-gray-500">Organizations</p>
            </div>
          </Link>
          <UserNav />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <motion.div
              className="absolute rounded-full blur-3xl opacity-10"
              style={{
                width: "500px",
                height: "500px",
                backgroundColor: "#3182ce",
                top: "-100px",
                right: "-100px",
              }}
              animate={{
                x: [0, 50, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6 mb-12"
            >
              <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Discover Amazing Organizations</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                Explore Top
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}Organizations
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Connect with innovative startups, join their events, and build valuable professional relationships
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mt-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow"
                  />
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-16"
            >
              {[
                { label: "Organizations", value: "50+" },
                { label: "Events", value: "200+" },
                { label: "Members", value: "5000+" },
              ].map((stat, index) => (
                <Card key={index} className="p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Organizations Grid */}
        <section className="py-16 max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="h-80 bg-gray-200 rounded-lg"
                />
              ))}
            </div>
          ) : filteredStartups.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStartups.map((startup, index) => (
                  <OrganizationCard key={startup.id} {...startup} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                      <Button
                        key={i}
                        variant={page === i + 1 ? "default" : "outline"}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No organizations found</p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-6 text-center text-white space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Join an Organization?</h2>
            <p className="text-lg opacity-90">
              Explore events, connect with professionals, and grow your career
            </p>
            <Link href="/">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <span>Explore More</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
