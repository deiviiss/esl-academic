"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, MessageCircle, Play, Video } from "lucide-react"
import Image from "next/image"

interface ClassroomMoment {
  id: string
  url: string
  thumbnail: string
  level: string
  date: string
  caption: string
  type: string
}

interface ClassroomMomentsProps {
  moments: ClassroomMoment[]
}

export default function ClassroomMoments({ moments }: ClassroomMomentsProps) {
  const [selectedMoment, setSelectedMoment] = useState<ClassroomMoment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleMomentClick = (moment: ClassroomMoment) => {
    setSelectedMoment(moment)
    setIsDialogOpen(true)
  }

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

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "MMMM d, yyyy", { locale: es })
  }

  return (
    <div className="container px-0 md:px-8 py-8 md:py-12">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl min-[348px]:text-2xl min-[404px]:text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <Video className="h-8 w-8" />
          Classroom Moments
        </h1>
        <p className="text-muted-foreground mt-2">
          Short videos captured during classes showing your child&apos;s progress and activities
        </p>
      </motion.div>

      <motion.div
        className="max-w-3xl mx-auto space-y-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {moments.map((moment) => (
          <motion.div key={moment.id} variants={fadeInUp}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(moment.date)}
                  </div>
                  <Badge variant="outline">{moment.level}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-video cursor-pointer" onClick={() => handleMomentClick(moment)}>
                  <Image
                    src={moment.thumbnail || "/placeholder.svg"}
                    alt={`Classroom moment from ${moment.date}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="rounded-full bg-primary/80 p-3">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4">
                <div className="flex items-start gap-2 w-full">
                  <MessageCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{moment.caption}</p>
                </div>
                <Button variant="ghost" className="mt-2 w-full" onClick={() => handleMomentClick(moment)}>
                  <Play className="h-4 w-4 mr-2" />
                  Watch Video
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl pt-10 px-2 md:px-10">
          {selectedMoment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(selectedMoment.date)}
                  </div>
                  <Badge variant="outline">{selectedMoment.level}</Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="mt-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  <video
                    src={selectedMoment.url}
                    controls
                    autoPlay
                    className="w-full h-full"
                    poster={selectedMoment.thumbnail}
                  />
                </div>
                <div className="mt-4">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{selectedMoment.caption}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
