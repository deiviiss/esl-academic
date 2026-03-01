"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CldUploadWidget, CldImage } from "next-cloudinary"
import { CloudinaryImage } from "@/components/platform/CloudinaryImage"
import { getCloudinaryVideoThumbnail } from "@/utils/cloudinary.utils"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, X, Play, Save, Video } from "lucide-react"
import { createNewsletter, updateNewsletter } from "@/actions/newsletters/newsletter.actions"
import { NewsletterData } from "@/interfaces/newsletter.interface"
import { Textarea } from "@/components/ui/textarea"

interface NewsletterFormProps {
  newsletter?: NewsletterData
  levels: Array<{ id: string; name: string }>
}

interface VocabularyItem {
  word: string
  pronunciation: string
  imageUrl: string
}

interface VideoItem {
  title: string
  videoUrl: string
  thumbnailUrl?: string | null
}

interface ForParentsItem {
  message: string
  documentUrl?: string | null
}

interface PlaylistLinkItem {
  title?: string | null
  url: string
}

export default function NewsletterForm({ newsletter, levels }: NewsletterFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Basic fields
  const [title, setTitle] = useState(newsletter?.title || "")
  // month stores "1" to "12"
  const [month, setMonth] = useState(
    newsletter?.month ? (new Date(newsletter.month).getUTCMonth() + 1).toString() : (new Date().getMonth() + 1).toString()
  )
  const [year, setYear] = useState(newsletter?.year.toString() || new Date().getFullYear().toString())

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]
  const [selectedLevels, setSelectedLevels] = useState<string[]>(
    newsletter?.levels.map(l => l.id) || []
  )

  // Dynamic lists
  const [vocabularies, setVocabularies] = useState<VocabularyItem[]>(
    newsletter?.vocabularies || []
  )
  const [videos, setVideos] = useState<VideoItem[]>(
    newsletter?.videos ? newsletter.videos.map(v => ({ ...v, thumbnailUrl: v.thumbnailUrl ?? null })) : []
  )
  const [forParents, setForParents] = useState<ForParentsItem[]>(
    newsletter?.forParents ? newsletter.forParents.map(f => ({ ...f, documentUrl: f.documentUrl ?? null })) : []
  )
  const [playlistTitle, setPlaylistTitle] = useState(newsletter?.playlist?.title ?? "")
  const [playlistUrl, setPlaylistUrl] = useState(newsletter?.playlist?.url ?? "")
  const [playlistLinks, setPlaylistLinks] = useState<PlaylistLinkItem[]>(
    newsletter?.playlist?.links ? newsletter.playlist.links.map(l => ({ ...l, title: l.title ?? null })) : []
  )

  // Fix for next-cloudinary scroll lock issue
  useEffect(() => {
    // Ensuring body scroll is always enabled when the form is active
    // This counters the 'overflow: hidden' bug from Cloudinary widget
    const handleScrollReset = () => {
      if (document.body.style.overflow === "hidden") {
        document.body.style.overflow = "auto"
      }
    }

    handleScrollReset()

    // Also reset on any state change that might cause a re-render
    return () => handleScrollReset()
  }, [vocabularies, videos])

  const handleLevelToggle = (levelId: string) => {
    setSelectedLevels(prev =>
      prev.includes(levelId)
        ? prev.filter(id => id !== levelId)
        : [...prev, levelId]
    )
  }

  const addVocabulary = () => {
    setVocabularies([...vocabularies, { word: "", pronunciation: "", imageUrl: "" }])
  }

  const removeVocabulary = (index: number) => {
    setVocabularies(vocabularies.filter((_, i) => i !== index))
  }

  const updateVocabulary = (index: number, field: keyof VocabularyItem, value: string) => {
    const updated = [...vocabularies]
    updated[index][field] = value
    setVocabularies(updated)
  }

  const addVideo = () => {
    setVideos([...videos, { title: "", videoUrl: "", thumbnailUrl: "" }])
  }

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index))
  }

  const updateVideo = (index: number, field: keyof VideoItem, value: string) => {
    const updated = [...videos]
    updated[index][field] = value
    setVideos(updated)
  }

  const addForParents = () => {
    setForParents([...forParents, { message: "", documentUrl: "" }])
  }

  const removeForParents = (index: number) => {
    setForParents(forParents.filter((_, i) => i !== index))
  }

  const updateForParents = (index: number, field: keyof ForParentsItem, value: string) => {
    const updated = [...forParents]
    updated[index][field] = value
    setForParents(updated)
  }

  const addPlaylistLink = () => {
    setPlaylistLinks([...playlistLinks, { title: "", url: "" }])
  }

  const removePlaylistLink = (index: number) => {
    setPlaylistLinks(playlistLinks.filter((_, i) => i !== index))
  }

  const updatePlaylistLink = (index: number, field: keyof PlaylistLinkItem, value: string) => {
    const updated = [...playlistLinks]
    updated[index][field] = value
    setPlaylistLinks(updated)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title || !month || !year || selectedLevels.length === 0) {
      toast.error("Please complete all required fields: Title, Month, Year and at least one Level.")
      return
    }

    setIsSubmitting(true)

    // Create date at midnight UTC for the 1st of the month
    const monthDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1))

    const data = {
      title,
      month: monthDate,
      year: parseInt(year),
      levelIds: selectedLevels,
      vocabularies: vocabularies.filter(v => v.word && v.pronunciation && v.imageUrl).map(v => ({
        word: v.word,
        pronunciation: v.pronunciation,
        imageUrl: v.imageUrl
      })),
      videos: videos.filter(v => v.title && v.videoUrl).map(v => ({
        title: v.title,
        videoUrl: v.videoUrl,
        thumbnailUrl: v.thumbnailUrl || undefined
      })),
      forParents: forParents.filter(f => f.message).map(f => ({
        message: f.message,
        documentUrl: f.documentUrl || undefined
      })),
      playlist: (playlistTitle || playlistUrl || playlistLinks.length > 0) ? {
        title: playlistTitle || undefined,
        url: playlistUrl || undefined,
        links: playlistLinks.filter(l => l.url).map(l => ({
          title: l.title || undefined,
          url: l.url
        }))
      } : undefined
    }

    const result = newsletter
      ? await updateNewsletter(newsletter.id, data)
      : await createNewsletter(data)

    if (result.ok) {
      toast.success(newsletter ? "Newsletter updated successfully" : "Newsletter created successfully")
      router.push("/platform/admin/newsletters")
      router.refresh()
    } else {
      toast.error(result.message || "Error saving newsletter")
      setIsSubmitting(false)
    }
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

  return (
    <div className="container px-4 md:px-8 py-8 md:py-12">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary">
          {newsletter ? "Edit Newsletter" : "Create Newsletter"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {newsletter ? "Modify the newsletter data" : "Complete the form to create a new newsletter"}
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* General Information */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g. Newsletter of the Month"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="month">Month *</Label>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger id="month">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Levels * (select at least one)</Label>
                <div className="flex flex-wrap gap-2">
                  {levels.map((level) => (
                    <Button
                      key={level.id}
                      type="button"
                      variant={selectedLevels.includes(level.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleLevelToggle(level.id)}
                    >
                      {level.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vocabulary */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Vocabulary</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVocabulary}>
                <Plus className="h-4 w-4 mr-2" /> Add Word
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {vocabularies.map((vocab, index) => (
                <div key={index} className="p-4 border rounded-lg relative space-y-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-destructive"
                    onClick={() => removeVocabulary(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Word</Label>
                      <Input
                        value={vocab.word}
                        onChange={(e) => updateVocabulary(index, "word", e.target.value)}
                        placeholder="Word"
                      />
                    </div>
                    <div>
                      <Label>Pronunciation</Label>
                      <Input
                        value={vocab.pronunciation}
                        onChange={(e) => updateVocabulary(index, "pronunciation", e.target.value)}
                        placeholder="Pronunciation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image</Label>
                      {vocab.imageUrl ? (
                        <div className="relative w-full aspect-square max-w-[120px] rounded-lg overflow-hidden border">
                          <CldImage
                            width="120"
                            height="120"
                            src={vocab.imageUrl}
                            alt={vocab.word || "Vocabulary image"}
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => updateVocabulary(index, "imageUrl", "")}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <CldUploadWidget
                          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                          onClose={() => { document.body.style.overflow = "auto" }}
                          onSuccess={(result) => {
                            if (result.info && typeof result.info !== "string") {
                              updateVocabulary(index, "imageUrl", result.info.public_id)
                            }
                          }}
                        >
                          {({ open }) => (
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full h-[120px] border-dashed flex flex-col items-center justify-center"
                              onClick={() => open()}
                            >
                              <Plus className="h-4 w-4 mb-2" />
                              <span className="text-xs">Upload Image</span>
                            </Button>
                          )}
                        </CldUploadWidget>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Videos */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Videos</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVideo}>
                <Plus className="h-4 w-4 mr-2" /> Add Video
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {videos.map((video, index) => (
                <div key={index} className="p-4 border rounded-lg relative space-y-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-destructive"
                    onClick={() => removeVideo(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={video.title}
                        onChange={(e) => updateVideo(index, "title", e.target.value)}
                        placeholder="Video Title"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label>Video</Label>
                      {video.videoUrl ? (
                        <div className="space-y-2">
                          <div className="aspect-[9/16] w-32 rounded-lg overflow-hidden border bg-muted relative group">
                            <CloudinaryImage
                              src={getCloudinaryVideoThumbnail(video.videoUrl)}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="h-8 w-8 text-white fill-current" />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full text-destructive"
                            onClick={() => updateVideo(index, "videoUrl", "")}
                          >
                            <X className="h-4 w-4 mr-2" /> Remove Video
                          </Button>
                        </div>
                      ) : (
                        <CldUploadWidget
                          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                          onClose={() => { document.body.style.overflow = "auto" }}
                          options={{
                            resourceType: "video",
                            maxFiles: 1,
                            folder: "esl-academy/newsletters/videos",
                          }}
                          onSuccess={(result) => {
                            if (result.info && typeof result.info !== "string") {
                              updateVideo(index, "videoUrl", result.info.public_id);
                            }
                          }}
                        >
                          {({ open }) => (
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full h-32 border-dashed border-2 flex flex-col gap-2"
                              onClick={() => open()}
                            >
                              <Video className="h-8 w-8 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Upload Video</span>
                            </Button>
                          )}
                        </CldUploadWidget>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* For Parents */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>For Parents</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addForParents}>
                <Plus className="h-4 w-4 mr-2" /> Add Entry
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {forParents.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg relative space-y-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-destructive"
                    onClick={() => removeForParents(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div>
                    <Label>Message</Label>
                    <Textarea
                      value={item.message}
                      onChange={(e) => updateForParents(index, "message", e.target.value)}
                      placeholder="Information for parents..."
                    />
                  </div>
                  <div>
                    <Label>Document URL (optional)</Label>
                    <Input
                      value={item.documentUrl || ""}
                      onChange={(e) => updateForParents(index, "documentUrl", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Playlist */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Playlist (Spotify/Other)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Playlist Title</Label>
                  <Input
                    value={playlistTitle}
                    onChange={(e) => setPlaylistTitle(e.target.value)}
                    placeholder="My Monthly Playlist"
                  />
                </div>
                <div>
                  <Label>Playlist Main URL</Label>
                  <Input
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                    placeholder="https://open.spotify.com/..."
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <Label>Individual Song Links</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={addPlaylistLink}>
                    <Plus className="h-4 w-4 mr-2" /> Add Song
                  </Button>
                </div>
                {playlistLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label className="text-xs">Song Title</Label>
                      <Input
                        value={link.title || ""}
                        onChange={(e) => updatePlaylistLink(index, "title", e.target.value)}
                        placeholder="Song Name"
                      />
                    </div>
                    <div className="flex-[2]">
                      <Label className="text-xs">Song URL</Label>
                      <Input
                        value={link.url}
                        onChange={(e) => updatePlaylistLink(index, "url", e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive mb-[2px]"
                      onClick={() => removePlaylistLink(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Buttons */}
        <motion.div variants={fadeInUp} className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/platform/admin/newsletters")}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> {newsletter ? "Update" : "Create"} Newsletter
              </>
            )}
          </Button>
        </motion.div>
      </motion.form>
    </div>
  )
}
