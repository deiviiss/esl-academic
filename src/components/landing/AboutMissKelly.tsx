"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { titleFont } from "@/config/fonts"

const achievements = [
  "Over 10 years of ESL teaching experience",
  "Certified TEFL instructor",
  "Master's in Early Childhood Education",
  "Excellence in Teaching Award recipient",
]

interface AboutProps {
  imageUrl: string
}

export default function AboutMissKelly({ imageUrl }: AboutProps) {

  return (
    <section className="w-full py-24 md:py-24 lg:py-32 bg-secondary/10" id="about">
      <div className="container px-4 md:px-6 max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            className="relative w-full aspect-square rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image src={imageUrl} alt="Miss Kelly" fill className="object-cover" />
          </motion.div>
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="w-fit" variant="secondary">
              FOUNDER & HEAD TEACHER
            </Badge>
            <h2 className={`${titleFont.className} text-3xl font-bold tracking-tighter sm:text-5xl text-primary`}>
              Created by an award-winning educator
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              {achievements.map((achievement, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>{achievement}</span>
                </motion.li>
              ))}
            </ul>
            <Button
              className="w-fit"
              asChild
            >
              <Link href="/about">
                Meet Miss Kelly
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

