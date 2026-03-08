"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { titleFont } from "@/config/fonts"

interface HeroProps {
  videoUrl: string
}

export default function Hero({ videoUrl }: HeroProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  return (
    <section className="relative flex items-start justify-center overflow-hidden pt-12 pb-24 md:py-12 lg:py-8 bg-secondary/10 lg:min-h-[500px] lg:items-center">
      <div className="px-4 md:px-6 max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <Badge variant="secondary">Join Our Community</Badge>
              <h1 className={`${titleFont.className} text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary min-h-[1.2em]`}>
                Learn English the Natural Way
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                A joyful, meaningful, and empowering English experience for Spanish-speaking children ages 2.8 to 12 — combining play-based learning, phonics, and personalized attention.
              </p>
            </div>
            <div className="flex flex-col gap-5 sm:gap-3 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <motion.a
                  href="https://wa.me/9811755180?text=Hola%20Miss%20Kelly%2C%20me%20interesa%20inscribir%20a%20mi%20hijo%2Fa."
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Learning Today
                </motion.a>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-video overflow-hidden rounded-xl"
          >
            {!isVideoLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setIsVideoLoaded(true)}
              className={`mx-auto aspect-video object-cover object-center w-full transition-opacity duration-300 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'
                }`}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

