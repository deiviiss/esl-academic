"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Book, Calendar, Download, ExternalLink, Info, Music, Youtube } from "lucide-react"
import Link from "next/link"

interface Newsletter {
  id: string
  title: string
  month: string
  vocabularies: { id: string; word: string; pronunciation: string }[]
  links: { id: string; title: string; url: string }[]
  forParents: { id: string; content: string }[]
  playlistUrl: string
  pdfUrl: string
}

interface NewsletterDetailProps {
  newsletter: Newsletter
}

export default function NewsletterDetail({ newsletter }: NewsletterDetailProps) {
  const [activeTab, setActiveTab] = useState("vocabulary")

  const formattedDate = format(new Date(newsletter.month), "MMMM yyyy")

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <div className="container px-0 md:px-8 py-8 md:py-12">
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
        <p className="text-muted-foreground mt-2">Monthly learning materials and important information</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vocabulary">
                <Book className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Vocabulary</span>
                <span className="sm:hidden">Vocab</span>
              </TabsTrigger>
              <TabsTrigger value="links">
                <ExternalLink className="h-4 w-4 mr-2" />
                <span>Links</span>
              </TabsTrigger>
              <TabsTrigger value="forParents">
                <Info className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">For Parents</span>
                <span className="sm:hidden">Parents</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vocabulary" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Book className="h-5 w-5 mr-2" />
                    What We&apos;re Learning
                  </CardTitle>
                  <CardDescription>Vocabulary words to practice at home</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {newsletter.vocabularies.map((vocab) => (
                      <div key={vocab.id} className="p-3 border rounded-md hover:border-primary transition-colors">
                        <p className="font-medium">{vocab.word}</p>
                        <p className="text-sm text-muted-foreground">/{vocab.pronunciation}/</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={newsletter.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download Vocabulary PDF
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="links" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Educational Links
                  </CardTitle>
                  <CardDescription>Videos and resources to enhance learning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {newsletter.links.map((link) => (
                      <motion.div key={link.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="outline" className="w-full justify-start h-auto py-3" asChild>
                          <Link href={link.url} target="_blank" rel="noopener noreferrer">
                            <Youtube className="h-4 w-4 mr-2 text-red-500" />
                            <span className="text-left">{link.title}</span>
                          </Link>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={newsletter.playlistUrl} target="_blank" rel="noopener noreferrer">
                      <Music className="h-4 w-4 mr-2" />
                      View Complete YouTube Playlist
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="forParents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    For Parents
                  </CardTitle>
                  <CardDescription>Important reminders and information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {newsletter.forParents.map((item) => (
                      <Alert key={item.id}>
                        <Info className="h-4 w-4" />
                        <AlertDescription>{item.content}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div
          className="space-y-6"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" asChild>
                <Link href={newsletter.playlistUrl} target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-4 w-4 mr-2" />
                  YouTube Playlist
                </Link>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href={newsletter.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Link>
              </Button>

              <Button variant="secondary" className="w-full" asChild>
                <Link href="/platform/academy/newsletters">
                  <Calendar className="h-4 w-4 mr-2" />
                  All Newsletters
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about the newsletter content or need assistance, please contact us:
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="mailto:support@mskelly.com">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
