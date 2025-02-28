"use client"

import { Button } from "@/components/ui/button"
import { titleFont } from "@/config/fonts"
import { motion } from "framer-motion"

export default function CTA() {
  return (
    <section className="w-full pt-24 py-12 mb-12 md:py-24 lg:py-32 bg-primary text-primary-foreground" id="contact">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h2 className={`${titleFont.className} text-3xl font-bold tracking-tighter sm:text-5xl`}>Start Your English Journey Today</h2>
            <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Get access to exclusive content, newsletters, and vocabulary materials
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <Button
              asChild
              className="w-full"
              variant="secondary"
            >
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Now
              </motion.a>
            </Button>
            <p className="text-sm text-primary-foreground/80">
              Includes access to all learning materials and resources
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

