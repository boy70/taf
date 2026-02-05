"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card } from "../../components/ui/card"
import { EventCard } from "../../components/event-card"
import { UserNav } from "../../components/user-nav"
import { Search, Calendar, ArrowRight, Sparkles, TrendingUp } from "lucide-react"

interface Event {
  id: string
  title: string
  description?: string
  startAt: string
  location?: string
  type?: string
  format?: string
  posterUrl?: string
  startup: {
    id: string
    name: string
    startupProfile?: {
      profileImageUrl?: string
    }
  }
  _count?: {
    registrations: number
  }
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filterType, setFilterType] = useState<string>("all")

  useEffect(() => {
    fetchEvents()
  }, [page, filterType])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/events/upcoming?page=${page}&limit=12`)
      const data = await response.json()
      setEvents(data.events)
      setTotalPages(data.pages)
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.startup.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" || event.type === filterType

    return matchesSearch && matchesFilter
  })

  const eventTypes = ["GENERAL", "TRAINING", "WORKSHOP", "CONFERENCE"]

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
              <p className="text-xs text-gray-500">Events & Training</p>
            </div>
          </Link>
          <UserNav />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Enhanced */}
        <section className="relative py-16 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* Animated background blobs */}
            <motion.div
              className="absolute rounded-full blur-3xl opacity-15"
              style={{
                width: "500px",
                height: "500px",
                backgroundColor: "#ec4899",
                top: "-100px",
                left: "-100px",
              }}
              animate={{
                x: [0, -50, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
            <motion.div
              className="absolute rounded-full blur-3xl opacity-10"
              style={{
                width: "400px",
                height: "400px",
                backgroundColor: "#3b82f6",
                bottom: "-50px",
                right: "-50px",
              }}
              animate={{
                x: [0, 50, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6 mb-12"
            >
              <motion.div
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full border border-purple-200 shadow-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </motion.div>
                <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Discover Amazing Events
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Explore Events &
                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Training Sessions
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Connect with industry leaders, develop new skills, and expand your network through curated events and training sessions
              </p>

              {/* Enhanced Search Bar */}
              <div className="max-w-2xl mx-auto mt-10">
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  <Input
                    placeholder="Search events, organizations, topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 border-2 border-gray-200 bg-white shadow-lg hover:shadow-xl hover:border-purple-300 transition-all rounded-xl text-base"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-gray-700">Filter by type:</span>
              <motion.button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  filterType === "all"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                All Events
              </motion.button>
              {eventTypes.map((type) => (
                <motion.button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    filterType === type
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-16 max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="h-96 bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl"
                />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="space-y-12">
              <motion.div
                className="flex items-center gap-2 text-gray-700"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">
                  Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
                </span>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    description={event.description}
                    startAt={event.startAt}
                    location={event.location}
                    startupName={event.startup.name}
                    startupProfileImage={event.startup.startupProfile?.profileImageUrl}
                    posterUrl={event.posterUrl}
                    registrationCount={event._count?.registrations || 0}
                    index={index}
                    type={event.type}
                    format={event.format}
                  />
                ))}
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <motion.div
                  className="flex justify-center items-center gap-4 mt-16 pb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="rounded-lg border-2"
                    >
                      Previous
                    </Button>
                  </motion.div>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant={page === i + 1 ? "default" : "outline"}
                          onClick={() => setPage(i + 1)}
                          className={`rounded-lg ${
                            page === i + 1
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              : "border-2"
                          }`}
                        >
                          {i + 1}
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="rounded-lg border-2"
                    >
                      Next
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg text-gray-600 font-medium">No events found</p>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </section>

        {/* CTA Section - Enhanced */}
        <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl"
              animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
              transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
              style={{ top: "-50px", left: "-50px" }}
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold">Ready to Grow?</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Browse all organizations and discover their comprehensive training sessions and networking events
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/organizations">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold rounded-xl shadow-lg">
                    <span>View Organizations</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 font-semibold rounded-xl">
                    Go to Dashboard
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
