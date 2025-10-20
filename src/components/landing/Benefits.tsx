"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { titleFont } from "@/config/fonts"

const benefits = [
  {
    title: "English That Feels Natural Through Play",
    description: "Children learn best when they’re having fun. Our play-based approach makes English feel like a natural part of your child’s world—through songs, games, stories, and hands-on activities. Your child gains confidence, vocabulary, and communication skills in English—without stress or pressure.",
    image: "https://res.cloudinary.com/dhyds3mnm/image/upload/v1760185487/1_yfzif3.jpg",
  },
  {
    title: "Phonics-Based Learning for Strong Reading and Speaking Skills",
    description: "We don’t just teach words—we teach how English works. Our phonics-based method helps children connect sounds with letters, leading to clearer pronunciation and stronger reading skills. Your child builds a solid foundation in English, setting them up for long-term academic success.",
    image: "https://res.cloudinary.com/dhyds3mnm/image/upload/v1760185488/2_yayoa0.jpg",
  },
  {
    title: "Small Groups and Personalized Attention",
    description: "We keep our groups small to ensure every child gets the attention they deserve. Lessons are tailored to each child’s age and level, from toddlers just starting to talk to older kids learning to read and write in English. Your child feels seen, supported, and encouraged—every step of the way.",
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

