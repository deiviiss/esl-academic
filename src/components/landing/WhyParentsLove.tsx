"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { titleFont } from "@/config/fonts"

export default function WhyParentsLove() {
  const reasons = [
    "Parents see real progress in confidence and communication.",
    "Classes are small, warm, and engaging.",
    "Lessons are play-based and culturally inclusive.",
    "Children look forward to every class.",
    "Families feel connected and supported throughout their learning journey."
  ]

  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-white dark:bg-background" id="why-parents-love">
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
              Why Parents Love Our Program
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Real learning, real smiles — here’s why families choose Miss Kelly ESL Academy.
            </p>
          </div>
        </motion.div>

        {/* Content */}
        <div className="mx-auto grid max-w-4xl gap-6 py-12 sm:grid-cols-2 md:gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="flex items-start space-x-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <p className="text-gray-700 dark:text-gray-300">{reason}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
