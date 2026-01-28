"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Book, Calendar, Download, ExternalLink, Info, Music, Play, Youtube, Video } from "lucide-react"
import Link from "next/link"
import { NewsletterDetailData } from "@/interfaces/newsletter.interface"
import { generateVocabularyPDF } from "@/utils/newsletter-pdf.utils"
import { toast } from "sonner"

interface NewsletterDetailProps {
  newsletter: NewsletterDetailData
}

export default function NewsletterDetail({ newsletter }: NewsletterDetailProps) {
  const [activeTab, setActiveTab] = useState("vocabulary")
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const formattedDate = format(new Date(newsletter.month), "MMMM yyyy")

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }


  return (
    <div className="container px-0 md:px-8 py-8 md:py-12">
      {/* Header */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge variant="outline" className="mb-2">
          <Calendar className="h-3 w-3 mr-1" />
          {formattedDate}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-primary">{newsletter.title}</h1>
        <p className="text-muted-foreground mt-2">All learning materials and activities for this month</p>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">

        {/* Tabs */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Navigation Tabs */}
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="vocabulary">
                <Book className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Vocabulary</span>
                <span className="sm:hidden">Vocab</span>
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Video className="h-4 w-4 mr-2" />
                <span>Videos</span>
              </TabsTrigger>
              <TabsTrigger value="forParents">
                <Info className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">For Parents</span>
                <span className="sm:hidden">Parents</span>
              </TabsTrigger>
              <TabsTrigger value="playlist">
                <Music className="h-4 w-4 mr-2" />
                <span>Links</span>
              </TabsTrigger>
            </TabsList>

            {/* Vocabulary */}
            <TabsContent value="vocabulary" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Book className="h-5 w-5 mr-2" />
                    What We&apos;re Learning
                  </CardTitle>
                  <CardDescription>Practice these words and their pronunciation at home</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                    {newsletter.vocabularies.map((vocab) => (
                      <div key={vocab.id} className="flex gap-4 p-4 border rounded-xl hover:border-primary transition-all bg-card shadow-sm overflow-hidden">
                        <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden border">
                          {vocab.imageUrl ? (
                            <Image
                              src={vocab.imageUrl}
                              alt={vocab.word}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Book className="h-8 w-8 opacity-20" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="font-bold text-lg">{vocab.word}</p>
                          <p className="text-sm text-primary font-medium italic">/{vocab.pronunciation}/</p>
                        </div>
                      </div>
                    ))}
                    {newsletter.vocabularies.length === 0 && (
                      <p className="text-muted-foreground italic col-span-2 text-center py-4">No vocabulary words listed for this month.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Videos  */}
            <TabsContent value="videos" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Video className="h-5 w-5 mr-2" />
                    Class Videos & Activities
                  </CardTitle>
                  <CardDescription>Learning materials and special moments captured this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {newsletter.videos.length > 0 ? (
                    <div className="flex flex-col items-center gap-12">
                      {newsletter.videos.map((video) => (
                        <div key={video.id} className="w-full max-w-[400px] space-y-4">
                          <h3 className="font-semibold text-lg flex items-center justify-center">
                            <Play className="h-4 w-4 mr-2 text-primary" />
                            {video.title}
                          </h3>
                          <div className="aspect-[9/16] w-full rounded-2xl overflow-hidden border bg-black shadow-2xl relative group ring-1 ring-primary/10">
                            {activeVideoId === video.id ? (
                              <video
                                src={video.videoUrl}
                                title={video.title}
                                className="w-full h-full"
                                controls
                                autoPlay
                                playsInline
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center cursor-pointer relative"
                                onClick={() => setActiveVideoId(video.id)}
                              >
                                {/* Thumbnail with object-cover to provide the "cut" effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

                                <Image
                                  src={video.thumbnailUrl || "/imgs/placeholder.jpg"}
                                  alt={video.title}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                <div className="z-20 flex flex-col items-center gap-4">
                                  <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-all duration-300">
                                    <Play className="h-10 w-10 fill-current ml-1" />
                                  </div>
                                  <div className="px-4 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                                    <span className="text-white text-xs font-medium uppercase tracking-wider">Tap to watch</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic text-center py-8">No videos available for this month.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* For Parents */}
            <TabsContent value="forParents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Info className="h-5 w-5 mr-2" />
                    Message for Parents
                  </CardTitle>
                  <CardDescription>Important reminders and information from Miss Kelly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {newsletter.forParents.map((fp) => (
                    <div key={fp.id} className="p-5 bg-muted/30 rounded-xl border border-dashed hover:border-primary/30 transition-colors space-y-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {fp.message}
                      </div>

                      {fp.documentUrl && (
                        <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2 border-primary/20 hover:bg-primary/5" asChild>
                          <Link href={fp.documentUrl} target="_blank">
                            <Download className="h-4 w-4 text-primary" />
                            Download Document
                          </Link>
                        </Button>
                      )}
                    </div>
                  ))}

                  {newsletter.forParents.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground italic">
                      No specific messages for parents this month.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Playlist */}
            <TabsContent value="playlist" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Music className="h-5 w-5 mr-2" />
                    YouTube Playlist & Links
                  </CardTitle>
                  <CardDescription>Additional songs and resources to enjoy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {newsletter.playlist?.links.map((link) => (
                      <motion.div key={link.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button variant="outline" className="w-full justify-start h-auto py-3 gap-3 border-primary/20 hover:border-primary/50" asChild>
                          <Link href={link.url} target="_blank" rel="noopener noreferrer">
                            <Youtube className="h-4 w-4 mr-2 text-red-500" />
                            <span className="text-left font-medium">{link.title || "External Link"}</span>
                          </Link>
                        </Button>
                      </motion.div>
                    ))}
                    {(!newsletter.playlist || newsletter.playlist.links.length === 0) && (
                      <p className="text-muted-foreground italic col-span-2 text-center py-4">No additional links for this month.</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={newsletter.playlist?.url || "#"} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Complete YouTube Playlist
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Summary */}
        <motion.div
          className="space-y-6"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <Card className="border-primary/20 shadow-md">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg">Quick Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="text-muted-foreground flex items-center">
                  <Book className="h-4 w-4 mr-2" /> Vocabulary
                </span>
                <span className="font-bold">{newsletter.vocabularies.length} words</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="text-muted-foreground flex items-center">
                  <Video className="h-4 w-4 mr-2" /> Videos
                </span>
                <span className="font-bold">{newsletter.videos.length} clips</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="text-muted-foreground flex items-center">
                  <Music className="h-4 w-4 mr-2" /> Links
                </span>
                <span className="font-bold">{newsletter.playlist?.links.length || 0} links</span>
              </div>

              {newsletter.vocabularies.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full mt-2 gap-2 border-primary/20 hover:bg-primary/5"
                  onClick={async () => {
                    setIsGeneratingPDF(true)
                    try {
                      await generateVocabularyPDF(newsletter.vocabularies, newsletter.title, formattedDate)
                      toast.success("PDF generated successfully!")
                    } catch (error) {
                      console.error("PDF generation error:", error)
                      toast.error("Failed to generate PDF")
                    } finally {
                      setIsGeneratingPDF(false)
                    }
                  }}
                  disabled={isGeneratingPDF}
                >
                  <Download className={`h-4 w-4 text-primary ${isGeneratingPDF ? "animate-bounce" : ""}`} />
                  {isGeneratingPDF ? "Generating PDF..." : "Download Vocabulary PDF"}
                </Button>
              )}

              <Button variant="default" className="w-full mt-4" asChild>
                <Link href="/platform/academy/newsletters">
                  <Calendar className="h-4 w-4 mr-2" />
                  All Months
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Parent Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert className="bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertDescription className="text-xs">
                  Reviewing vocabulary for 5 minutes daily significantly boosts retention.
                </AlertDescription>
              </Alert>
              <p className="text-xs text-muted-foreground">
                Miss Kelly recommends watching the class videos together with your child to reinforce what they learned during the week.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
