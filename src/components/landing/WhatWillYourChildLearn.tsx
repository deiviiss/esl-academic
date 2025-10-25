"use client"

import { motion } from "framer-motion"
import { titleFont } from "@/config/fonts"
import { BookOpen, Music, Globe2 } from "lucide-react"

export default function WhatChildLearns() {
  const stages = [
    {
      icon: <Music className="h-10 w-10 text-primary" />,
      title: "Explore Through Play (Ages 2.8+)",
      description:
        "Children begin their English journey through songs, games, and storytelling — developing natural listening and speaking skills.",
      gain: "Confidence to communicate naturally in everyday situations.",
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Build Language Through Phonics & Literacy (Ages 4+)",
      description:
        "As children grow, they learn to connect sounds with letters and words through phonics, reading, and writing activities.",
      gain: "Clear pronunciation and a solid reading foundation.",
    },
    {
      icon: <Globe2 className="h-10 w-10 text-primary" />,
      title: "Connect Through Culture & Communication (Ages 6–12)",
      description:
        "Students use English to express themselves, share ideas, and explore different cultures through creative discussions and projects.",
      gain: "Fluency, confidence, and cultural awareness that last a lifetime.",
    },
  ]

  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-secondary/10" id="what-child-learns">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h2 className={`${titleFont.className} text-3xl font-bold tracking-tighter sm:text-5xl text-primary`}>
              What Will Your Child Learn?
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              From first words to full conversations — each stage builds confidence, literacy, and love for learning.
            </p>
          </div>
        </motion.div>

        {/* Stages */}
        <div className="mx-auto grid max-w-7xl items-start gap-8 py-12 lg:grid-cols-3 lg:gap-12">
          {stages.map((stage, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center bg-white dark:bg-background rounded-2xl shadow-sm p-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-4">{stage.icon}</div>
              <h3 className="text-xl font-bold text-primary mb-2">{stage.title}</h3>
              <p className="text-muted-foreground mb-4">{stage.description}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">💡 {stage.gain}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
