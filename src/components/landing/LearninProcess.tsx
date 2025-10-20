"use client"

import { titleFont } from "@/config/fonts"
import { motion } from "framer-motion"

export default function LearningProcess() {
  return (
    <section className="w-full pt-24 md:py-24 lg:py-32 bg-secondary/10" id='our-method'>
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className={`${titleFont.className} text-3xl font-bold tracking-tighter sm:text-5xl text-primary`}>Our Learning Process</h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Three simple steps to English fluency
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-7xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold">Daily Engagement</h3>
              <p className="text-center text-gray-600">
                Short, engaging sessions that keep students motivated
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold">Creative Learning</h3>
              <p className="text-center text-gray-600">
                Learn through games and interactive activities
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold">Confidence Building</h3>
              <p className="text-center text-gray-600">
                Develop natural English speaking abilities
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

