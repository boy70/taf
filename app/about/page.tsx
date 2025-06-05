"use client"

import React from "react"
import { motion } from "framer-motion"

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <h1 className="text-2xl font-bold">About Tafsula</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 md:py-24">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">About Tafsula</h2>
          <p className="text-lg text-muted-foreground">
            Tafsula is a cutting-edge platform designed to help startups build stronger teams through personality
            assessment. We use the DISC personality model to analyze team compatibility and provide insights that lead
            to better collaboration, communication, and overall team performance.
          </p>
        </motion.div>
      </main>
    </div>
  )
}
