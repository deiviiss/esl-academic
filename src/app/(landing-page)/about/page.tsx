'use client'

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { titleFont } from "@/config/fonts"
import { motion } from "framer-motion"

const principles = [
  {
    title: "Early Language Acquisition",
    description: "We believe in starting English education early for optimal results.",
  },
  {
    title: "Every Child's Potential",
    description: "We recognize and nurture each child's unique ability to learn English.",
  },
  {
    title: "Supportive Teaching Methods",
    description: "Our engaging methods create a positive learning environment.",
  },
  {
    title: "Creativity in Learning",
    description: "We foster a love for learning through creative and fun activities.",
  },
]

const strategies = [
  "Immersive learning environments",
  "Personalized learning plans",
  "Interactive digital resources",
  "Regular progress assessments and feedback",
]

const experiences = [
  "10+ years of ESL teaching experience",
  "Certified TEFL instructor",
  "Master's degree in Early Childhood Education",
  "Published author of ESL learning materials",
]

export default function AboutPage() {
  return (
    <section className="container mx-auto px-4 py-8 max-w-5xl">
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
            <Button>Learn More About Our Approach</Button>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/imgs/29.png"
              alt="Miss Kelly teaching students"
              width={400}
              height={300}
              className="rounded-lg mx-auto"
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
        <h2 className={`${titleFont.className} text-2xl font-bold mb-4`}>Importance of Early English Education</h2>
        <p className="text-base mb-4">
          Early proficiency in English significantly enhances academic performance across all subjects. In our
          increasingly globalized world, strong language skills provide long-term benefits, preparing children for
          future academic and professional success.
        </p>
        <ul className="list-disc list-inside text-base">
          <li>Improved cognitive development</li>
          <li>Enhanced problem-solving skills</li>
          <li>Greater cultural awareness and empathy</li>
          <li>Increased opportunities for higher education and career advancement</li>
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
          <Image
            src="/imgs/30.png"
            alt="Miss Kelly"
            width={500}
            height={600}
            className="rounded-lg mx-auto"
          />
          <div>
            <p className="text-base mb-4">
              Miss Kelly&apos;s journey to founding the ESL Academy is rooted in her personal experiences with language
              learning. Overcoming her own challenges in mastering a second language, she was inspired to create a
              supportive and effective learning environment for young English learners.
            </p>
            <p className="text-base mb-4">
              Her passion for education and belief in every child&apos;s potential drove her to establish an academy that not
              only teaches English but also instills confidence and a love for learning in every student.
            </p>
            <Button variant="outline">Read Miss Kelly&apos;s Full Story</Button>
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
        <Button variant="secondary">View Miss Kelly&apos;s Credentials</Button>
      </motion.div>
    </section>
  )
}

