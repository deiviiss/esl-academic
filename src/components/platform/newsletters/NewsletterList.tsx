"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, ChevronRight, GraduationCap, Newspaper } from "lucide-react"
import Link from "next/link"

interface Newsletter {
  id: string
  title: string
  month: string
}

interface NewslettersByLevel {
  toddlers: Newsletter[]
  nursery: Newsletter[]
  prek: Newsletter[]
}

interface NewsletterListProps {
  newslettersByLevel: NewslettersByLevel
}

export default function NewsletterList({ newslettersByLevel }: NewsletterListProps) {
  const [activeLevel, setActiveLevel] = useState("toddlers")

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="container px-0 md:px-8 py-8 md:py-12">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <Newspaper className="h-8 w-8" />
          Newsletters
        </h1>
        <p className="text-muted-foreground mt-2">Browse our monthly newsletters by academic level</p>
      </motion.div>

      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Tabs value={activeLevel} onValueChange={setActiveLevel} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="toddlers" className="flex items-center justify-center">
                <GraduationCap className="h-4 w-4 mr-2 hidden sm:block" />
                <span>Toddlers</span>
              </TabsTrigger>
              <TabsTrigger value="nursery" className="flex items-center justify-center">
                <GraduationCap className="h-4 w-4 mr-2 hidden sm:block" />
                <span>Nursery</span>
              </TabsTrigger>
              <TabsTrigger value="prek" className="flex items-center justify-center">
                <GraduationCap className="h-4 w-4 mr-2 hidden sm:block" />
                <span>Pre-K</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {Object.entries(newslettersByLevel).map(([level, newsletters]: [string, Newsletter[]]) => (
            <TabsContent key={level} value={level}>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {newsletters.map((newsletter) => (
                  <motion.div key={newsletter.id} variants={fadeInUp}>
                    <Card className="h-full flex flex-col">
                      <CardHeader>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(newsletter.month), "MMMM yyyy")}
                        </div>
                        <CardTitle>{newsletter.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground text-sm">
                          Monthly newsletter with vocabulary, educational links, and important information for parents.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" asChild>
                          <Link href={`/platform/newsletters/${newsletter.id}`}>
                            View Details
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  )
}
