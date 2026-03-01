"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronRight, Newspaper } from "lucide-react"
import Link from "next/link"
import { ChildSummary } from "@/interfaces/child.interface"
import { NewsletterListItem } from "@/interfaces/newsletter.interface"

interface NewsletterListProps {
  newsletters: NewsletterListItem[]
  selectedChild?: ChildSummary
}

export default function NewsletterList({ newsletters, selectedChild }: NewsletterListProps) {
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
          {selectedChild ? `${selectedChild.name}'s Newsletters` : 'Newsletters'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {selectedChild
            ? `Monthly newsletters for ${selectedChild.level.name} level`
            : 'Browse our monthly newsletters'}
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        {newsletters.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground italic">No newsletters available for this month.</p>
          </div>
        ) : (
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
                      {(() => {
                        const d = new Date(newsletter.month);
                        return format(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()), "MMMM yyyy");
                      })()}
                    </div>
                    <CardTitle>{newsletter.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm">
                      Monthly learning materials, vocabulary, and important information for parents.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/platform/academy/newsletters/${newsletter.id}`}>
                        View Details
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
