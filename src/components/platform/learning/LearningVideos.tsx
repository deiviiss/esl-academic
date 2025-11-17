"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, GraduationCap, Play, Video } from "lucide-react"
import Image from "next/image"

interface LearningVideo {
  id: string
  title: string
  level: string
  month: string
  url: string
  thumbnail: string
  description: string
  type: string
}

interface LearningVideosProps {
  videos: LearningVideo[]
  allowedLevels: string[]
  isAdmin: boolean
}

export default function LearningVideos({ videos, allowedLevels, isAdmin }: LearningVideosProps) {
  const availableLevels = isAdmin ? ["all", ...allowedLevels] : allowedLevels
  const [activeLevel, setActiveLevel] = useState(availableLevels[0] || "all")
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [filteredVideos, setFilteredVideos] = useState<LearningVideo[]>(videos)
  const [selectedVideo, setSelectedVideo] = useState<LearningVideo | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Extract unique months from videos
  const uniqueMonths = Array.from(new Set(videos.map((video) => video.month))).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  ) // Sort by most recent first

  // Apply filters when activeLevel or selectedMonth changes
  useEffect(() => {
    let filtered = videos

    if (activeLevel !== "all") {
      filtered = filtered.filter((video) => video.level.toLowerCase() === activeLevel.toLowerCase())
    }

    if (selectedMonth !== "all") {
      filtered = filtered.filter((video) => video.month === selectedMonth)
    }

    setFilteredVideos(filtered)
  }, [activeLevel, selectedMonth, videos])

  const handleVideoClick = (video: LearningVideo) => {
    setSelectedVideo(video)
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

  const formatMonthYear = (dateString: string) => {
    return format(parseISO(dateString), "MMMM yyyy", { locale: es })
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
          <Video className="h-8 w-8" />
          Learning Videos
        </h1>
        <p className="text-muted-foreground mt-2">
          Educational videos created by Miss Kelly to support your child&apos;s learning journey
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Tabs value={activeLevel} onValueChange={setActiveLevel} className="w-full">
            <TabsList className={`grid w-full max-w-md grid-cols-${availableLevels.length}`}>
              {availableLevels.map((level) => (
                <TabsTrigger key={level} value={level} className="flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 mr-2 hidden sm:block" />
                  <span>{level === "all" ? "All" : level === "prek" ? "Pre-K" : level.charAt(0).toUpperCase() + level.slice(1)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="w-full md:w-auto">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {uniqueMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {formatMonthYear(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {filteredVideos.length === 0 ? (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground">No videos found for the selected filters.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setActiveLevel("all")
              setSelectedMonth("all")
            }}
          >
            Reset Filters
          </Button>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {filteredVideos.map((video) => (
            <motion.div key={video.id} variants={fadeInUp}>
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative aspect-video cursor-pointer" onClick={() => handleVideoClick(video)}>
                  <Image src={video.thumbnail || "/placeholder.svg"} alt={video.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="rounded-full bg-primary/80 p-3">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <Badge variant="outline">{video.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatMonthYear(video.month)}
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">{video.description}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleVideoClick(video)}>
                    <Play className="h-4 w-4 mr-2" />
                    Watch Video
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl pt-10 px-2 md:px-10">
          {selectedVideo && (
            <>
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>{selectedVideo.title}</span>
                  <Badge variant="outline">{selectedVideo.level}</Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="mt-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-md">
                  <video
                    src={selectedVideo.url}
                    controls
                    autoPlay
                    className="w-full h-full"
                    poster={selectedVideo.thumbnail}
                  />
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatMonthYear(selectedVideo.month)}
                  </div>
                  <p className="text-muted-foreground">{selectedVideo.description}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
