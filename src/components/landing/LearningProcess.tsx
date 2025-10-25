"use client"

import { titleFont } from "@/config/fonts"
import { motion } from "framer-motion"

export default function LearningProcess() {
  return (
    <section className="w-full pt-20 md:py-24 lg:py-32 bg-secondary/10 scroll-mt-10 md:scroll-mt-0" id="our-method">
      <div className="container px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className={`${titleFont.className} text-3xl font-bold tracking-tighter sm:text-5xl text-primary`}>
                Our 3-Step Method
              </h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                A simple, joyful path to English fluency for children.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="mx-auto grid max-w-7xl items-start gap-8 py-12 lg:grid-cols-3 lg:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold">Play & Connect</h3>
              <p className="text-gray-600 max-w-[280px]">
                Kids engage through games, songs, and real interaction that make English fun and natural.
              </p>
              <p className="text-sm text-muted-foreground italic">They gain: confidence, curiosity, and joy for learning.</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold">Phonics & Foundation</h3>
              <p className="text-gray-600 max-w-[280px]">
                Through sounds, repetition, and playful reading and writing, they build strong language roots.
              </p>
              <p className="text-sm text-muted-foreground italic">
                They gain: clear pronunciation, early literacy, and comprehension.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold">Practice & Progress</h3>
              <p className="text-gray-600 max-w-[280px]">
                Personalized practice and support help each child advance with confidence and motivation.
              </p>
              <p className="text-sm text-muted-foreground italic">
                They gain: independence, fluency, and real communication skills.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
