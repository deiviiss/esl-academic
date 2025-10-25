"use client"

import { Button } from "@/components/ui/button"
import { titleFont } from "@/config/fonts"
import { motion } from "framer-motion"

export default function CTA() {
  return (
    <section
      className="w-full pt-20 py-12 mb-12 md:py-24 lg:py-32 bg-primary text-primary-foreground scroll-mt-10 md:scroll-mt-0"
      id="contact"
    >
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-5 max-w-[900px]">
            <h2
              className={`${titleFont.className} text-3xl font-bold tracking-tighter sm:text-5xl`}
            >
              Give Your Child a Joyful English Learning Experience
            </h2>
            <p className="md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Enroll today and access Miss Kelly’s exclusive learning materials —
              including class videos, vocabulary sheets, and newsletters designed to
              support your child’s progress at home.
            </p>
          </div>

          <div className="w-full max-w-sm space-y-2">
            <Button asChild className="w-full" variant="secondary">
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Enroll Now
              </motion.a>
            </Button>
            <p className="text-sm text-primary-foreground/80">
              Membership includes in-class learning, monthly materials, and access to
              Miss Kelly’s online resources.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
