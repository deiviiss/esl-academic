"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { titleFont } from "@/config/fonts"

interface HeroProps {
  videoUrl: string
}

export default function Hero({ videoUrl }: HeroProps) {
  return (
    <section className="relative flex items-start justify-center overflow-hidden pt-12 pb-24 md:py-12 lg:py-8 bg-secondary/10">
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
              <h1 className={`${titleFont.className}  text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary`}>
                Learn English the Natural Way
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                At Miss Kelly ESL academy, our mission is to inspire young learners to become confident English speakers
                through engaging lessons and a supportive environment.
              </p>
            </div>
            <div className="flex flex-col gap-5 sm:gap-3 min-[400px]:flex-row">
              <Button size="lg">Start Learning Today</Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:aspect-square"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

