"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { UserNav } from "./user-nav"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function TopNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition">
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
        </Link>

        {/* Desktop Navigation */}
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
          <Link href="/pricing">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              Pricing
            </Button>
          </Link>
        </nav>

        {/* User Navigation & Mobile Menu */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <UserNav />
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-6 py-4 space-y-2">
          <Link href="/about">
            <Button variant="ghost" className="w-full justify-start text-gray-600">
              About
            </Button>
          </Link>
          <Link href="/organizations">
            <Button variant="ghost" className="w-full justify-start text-gray-600">
              Organizations
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost" className="w-full justify-start text-gray-600">
              Pricing
            </Button>
          </Link>
          <div className="pt-2 border-t">
            <UserNav />
          </div>
        </div>
      )}
    </header>
  )
}
