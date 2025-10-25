"use client"

import { motion } from "framer-motion"
import { titleFont } from "@/config/fonts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Services() {
  const services = [
    {
      title: "Early Childhood Bilingual Education",
      description:
        "Designed for children ages 2.8 and up, this program introduces English naturally through songs, movement, and play. Students develop communication skills, vocabulary, and confidence in a bilingual environment that feels joyful and authentic.",
    },
    {
      title: "BrightBeginnings Reading Program",
      description:
        "Part of our Early Childhood Literacy Program, this stage helps pre-readers in Nursery and Pre-K build phonemic awareness and listening comprehension through stories, rhymes, and sound play.",
    },
    {
      title: "Little Readers Lab",
      description:
        "The advanced level of our Early Childhood Literacy Program, where children expand vocabulary, reading fluency, and comprehension through phonics-based instruction and creative writing activities.",
    },
  ]

  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-secondary/10 scroll-mt-10 md:scroll-mt-0" id="services">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center text-center space-y-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`${titleFont.className} text-3xl font-bold tracking-tighter sm:text-5xl text-primary`}>
            Our Programs & Services
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
            Engaging, play-based English learning designed for every age group
          </p>
        </motion.div>

        <div className="grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className={`${titleFont.className} text-xl text-primary`}>
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
