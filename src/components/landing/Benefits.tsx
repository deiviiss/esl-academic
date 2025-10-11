"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { titleFont } from "@/config/fonts"

const benefits = [
  {
    title: "Simple, 3-Step Process",
    description: "No matter their age or ability, all kids learn English the same way.",
    image: "https://res.cloudinary.com/dhyds3mnm/image/upload/v1760185487/1_yfzif3.jpg",
  },
  {
    title: "Quick Skill-Building",
    description: "It takes just 5 minutes a day of your focused attention.",
    image: "https://res.cloudinary.com/dhyds3mnm/image/upload/v1760185488/2_yayoa0.jpg",
  },
  {
    title: "Play-Based Approach",
    description: "You can use your child's interests to keep them excited to learn.",
    image: "https://res.cloudinary.com/dhyds3mnm/image/upload/v1760185488/3_bcnx8m.jpg",
  },
]

export default function Benefits() {
  return (
    <section className="w-full py-24 md:py-24 lg:py-32">
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
              Our proven method makes learning English natural and enjoyable
            </p>
          </div>
        </motion.div>
        <div className="mx-auto grid max-w-5xl items-center gap-12 py-12 lg:grid-cols-3 lg:gap-12">
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
              <p className="text-center text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

