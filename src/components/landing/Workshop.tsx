"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { titleFont } from "@/config/fonts"

const workshopBenefits = [
  "Effective learning strategies",
  "How to support your child's learning",
  "Tips for creating an English-friendly environment",
]

export default function Workshop() {
  return (
    <section className="w-full py-12 mb-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <Badge variant="secondary">Free Workshop</Badge>
              <h2 className={`${titleFont.className} text-3xl font-bold tracking-tighter sm:text-5xl text-primary`}>Join Our Free Workshop</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Learn valuable tips and strategies to support your child&apos;s English learning journey
              </p>
            </div>
            <Button
              asChild
              className="w-fit"
            >
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Register Now
              </motion.a>
            </Button>
          </motion.div>
          <motion.div
            className="flex flex-col space-y-4 rounded-xl border p-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className={`${titleFont.className} text-xl font-bold`}>What You&apos;ll Learn:</h3>
            <ul className="space-y-2">
              {workshopBenefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

