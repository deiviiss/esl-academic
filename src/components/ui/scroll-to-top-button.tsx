"use client"

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"
import { ChevronUp } from "lucide-react"

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()

  // Control visibility based on scroll progress (0 to 1)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const isAtStart = latest < 0.02
    const isAtEnd = latest > 0.98
    setIsVisible(!isAtStart && !isAtEnd)
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-4 right-6 z-40 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Scroll to top button */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={scrollToTop}>
            <span
              className="hidden sm:block text-[10px] font-bold tracking-[0.2em] text-gray-800 mb-3"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              BACK TO TOP
            </span>
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.15)] border border-gray-100 group-hover:bg-gray-50 transition-colors">
              <ChevronUp className="w-5 h-5 text-gray-800 stroke-[1.5]" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
