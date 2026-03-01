'use client'

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { titleFont } from "@/config/fonts"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

const principles = [
  {
    title: "Psychological Foundation",
    description: "We leverage developmental psychology to ensure English acquisition feels natural and stress-free.",
  },
  {
    title: "Learning Through Play",
    description: "Every activity is designed to be ludic and engaging, turning education into an enjoyable adventure.",
  },
  {
    title: "Natural Acquisition",
    description: "We focus on intuitive learning, mirroring how children master their first language.",
  },
  {
    title: "Safe & Motivating Space",
    description: "Our environment fosters the confidence and creativity necessary for early language mastery.",
  },
]

const strategies = [
  "Immersive learning environments",
  "Personalized learning plans",
  "Interactive digital resources",
  "Regular progress assessments and feedback",
]

const experiences = [
  "10+ years of experience working with children",
  "Professional Psychologist and Psychopedagogue",
  "Expert ESL Teacher specializing in Early Childhood",
  "Specialist in ludic and developmental pedagogical techniques",
]

export default function AboutPage() {
  const [isMissionLoaded, setIsMissionLoaded] = useState(false)
  const [isStoryLoaded, setIsStoryLoaded] = useState(false)

  return (
    <section className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className={`${titleFont.className} text-4xl font-bold text-primary mb-8`}
        >
          About Miss Kelly ESL Academy
        </h1>
      </motion.div>
      {/* Introduction to Our Mission */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={`${titleFont.className} text-2xl font-bold mb-4`}>Our Mission</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-base mb-4">
              Miss Kelly&apos;s passion for helping young learners become confident English speakers is at the heart of our
              academy. We believe in the transformative power of language skills in children&apos;s lives, opening doors to
              new opportunities and broadening their horizons.
            </p>
            <Button asChild>
              <Link href="/#our-method">
                Learn More About Our Approach
              </Link>
            </Button>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {!isMissionLoaded && (
              <Skeleton className="absolute inset-0 w-[400px] h-[300px] rounded-lg mx-auto" />
            )}
            <Image
              src="/imgs/29.png"
              alt="Miss Kelly teaching students"
              width={400}
              height={300}
              onLoad={() => setIsMissionLoaded(true)}
              className={`rounded-lg mx-auto transition-opacity duration-300 ${isMissionLoaded ? "opacity-100" : "opacity-0"
                }`}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Importance of Early English Education */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={`${titleFont.className} text-2xl font-bold mb-4`}>Why Start Early?</h2>
        <p className="text-base mb-4">
          Learning English at a young age isn&apos;t just about mastering a language; it&apos;s about providing children with the best tools for their future. In these early stages, the brain is most receptive, making acquisition more natural, effective, and meaningful.
        </p>
        <p className="text-base mb-4">
          Our methodology focuses on stimulating key areas of development, ensuring long-term benefits:
        </p>
        <ul className="list-disc list-inside text-base">
          <li>Enhanced memory and cognitive flexibility</li>
          <li>Improved attention span and focus</li>
          <li>Boosted creativity and problem-solving abilities</li>
          <li>Greater self-confidence and cultural empathy</li>
        </ul>
      </motion.div>

      {/* Core Principles */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className={`${titleFont.className} text-2xl font-bold mb-4`}>Our Core Principles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {principles.map((principle, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className={`${titleFont.className}`}>{principle.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{principle.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Proactive Approach to Language Learning */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className={`${titleFont.className} text-2xl font-bold mb-4`}>Our Proactive Approach</h2>
        <p className="text-base mb-4">
          At Miss Kelly ESL Academy, we&apos;re committed to moving from discussion to action in addressing language learning
          challenges. Our strategies simplify the learning process and empower students to take control of their
          language journey.
        </p>
        <div className="bg-accent/10 p-6 rounded-lg">
          <h3 className={`${titleFont.className} text-xl font-semibold mb-2`}>Our Strategies Include:</h3>
          <ul className="list-disc list-inside text-base">
            {
              strategies.map((strategy, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {strategy}
                </motion.li>
              ))
            }
          </ul>
        </div>
      </motion.div>

      {/* Founder's Personal Story */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={`${titleFont.className} text-2xl font-bold text-primary mb-5`}>Miss Kelly&apos;s Story</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative">
            {!isStoryLoaded && (
              <Skeleton className="absolute inset-0 w-[500px] h-[600px] rounded-lg mx-auto" />
            )}
            <Image
              src="/imgs/30.png"
              alt="Miss Kelly"
              width={500}
              height={600}
              onLoad={() => setIsStoryLoaded(true)}
              className={`rounded-lg mx-auto transition-opacity duration-300 ${isStoryLoaded ? "opacity-100" : "opacity-0"
                }`}
            />
          </div>
          <div>
            <p className="text-base mb-4">
              Hello! My name is <strong>Kelly Pérez</strong>. I am a Psychologist, Psychopedagogue, and ESL Teacher with over 10 years of experience working with children.
            </p>
            <p className="text-base mb-4">
              Throughout my career, I have discovered that learning English at an early age is not only possible but also far more natural and effective. As a parent, I know you want to provide your child with the best possible tools for their future.
            </p>
            <p className="text-base mb-4">
              In my academy, I combine my psychological training with pedagogical techniques and ludic activities. We offer a program where children learn through play, without pressure, in a safe and motivating environment. Every class is designed with their developmental stage and unique learning style in mind.
            </p>
            <p className="text-base mb-4 italic">
              &quot;My commitment is to accompany you in this journey, providing a space where your child can learn English in a fun, loving, and effective way.&quot;
            </p>
          </div>
        </div>
      </motion.div>

      {/* Professional Experience */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 bg-primary text-primary-foreground p-8 rounded-lg"
      >
        <h2 className={`${titleFont.className} text-2xl font-bold mb-4`}>Professional Experience</h2>
        <p className="text-base mb-4">
          With over a decade of teaching experience, Miss Kelly has collaborated with hundreds of families to help
          children achieve English fluency. Her innovative teaching methods and dedication to student success have
          earned her recognition in the field of ESL education.
        </p>
        <ul className="list-disc list-inside text-base mb-4">
          {
            experiences.map((experience, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {experience}
              </motion.li>
            ))
          }
        </ul>
      </motion.div>
    </section>
  )
}

