"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { titleFont } from "@/config/fonts"

const benefits = [
  {
    title: "Simple, 3-Step Process",
    description:
      "Children learn English naturally through play, phonics, and joyful engagement — just like they learned their first language.",
    image: "https://res.cloudinary.com/dhyds3mnm/image/upload/v1760185487/1_yfzif3.jpg",
  },
  {
    title: "Quick Skill-Building",
    description:
      "With just a few minutes of focused, playful practice each day, your child gains confidence, vocabulary, and real communication skills.",
    image: "https://res.cloudinary.com/dhyds3mnm/image/upload/v1760185488/2_yayoa0.jpg",
  },
  {
    title: "Play-Based Approach",
    description:
      "Our lessons are filled with movement, laughter, and connection — turning learning English into an experience they love.",
    image: "https://res.cloudinary.com/dhyds3mnm/image/upload/v1760185488/3_bcnx8m.jpg",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="w-full pt-20 md:py-24 xl:py-32" id="why-choose-us">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h2 className={`${titleFont.className} text-3xl font-bold tracking-tighter sm:text-5xl text-primary`}>Why Choose Us?</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our program helps children fall in love with English through play, phonics, and personalized attention.
            </p>
          </div>
        </motion.div>
        <div className="mx-auto grid max-w-7xl items-center gap-12 py-12 lg:grid-cols-3 lg:gap-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center space-y-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <Image src={benefit.image || "/placeholder.svg"} alt={benefit.title} fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

