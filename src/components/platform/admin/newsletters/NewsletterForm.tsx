"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CldUploadWidget, CldImage } from "next-cloudinary"
import { CloudinaryImage } from "@/components/platform/CloudinaryImage"
import { getCloudinaryVideoThumbnail } from "@/utils/cloudinary.utils"
import { noticeSuccess, noticeFailure, noticeWarning } from "@/components/toast-notifications/ToastNotifications"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, X, Play, Save, Video } from "lucide-react"
import { createNewsletter, updateNewsletter } from "@/actions/newsletters/newsletter.actions"
import { NewsletterData, VideoItem, VocabularySet, VocabularyImage } from "@/interfaces/newsletter.interface"
import { Textarea } from "@/components/ui/textarea"

function humanizeFileName(fileName: string) {
  return fileName
    .split(".")[0]
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

interface NewsletterFormProps {
  newsletter?: NewsletterData
  levels: Array<{ id: string; name: string }>
}

interface ForParentsItem {
  id?: string
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
  const [vocabularySets, setVocabularySets] = useState<VocabularySet[]>(
    newsletter?.vocabularySets || []
  )
  const [videos, setVideos] = useState<VideoItem[]>(
    newsletter?.videos ? newsletter.videos.map(v => ({
      ...v,
      thumbnailUrl: v.thumbnailUrl || null
    })) : []
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
    const handleScrollReset = () => {
      if (document.body.style.overflow === "hidden") {
        document.body.style.overflow = "auto"
      }
    }
    handleScrollReset()
    return () => handleScrollReset()
  }, [vocabularySets, videos])

  const handleLevelToggle = (levelId: string) => {
    setSelectedLevels(prev =>
      prev.includes(levelId)
        ? prev.filter(id => id !== levelId)
        : [...prev, levelId]
    )
  }

  const addVocabularySet = () => {
    const newSet: VocabularySet = {
      id: crypto.randomUUID(),
      name: "",
      images: []
    }
    setVocabularySets([...vocabularySets, newSet])
  }

  const updateVocabularySetName = (index: number, name: string) => {
    const updated = [...vocabularySets]
    updated[index].name = name
    setVocabularySets(updated)
  }

  const removeVocabularySet = (index: number) => {
    const setName = vocabularySets[index].name || "this set"
    noticeWarning(
      `Remove "${setName}"?`,
      "Any images uploaded to this set will be removed from the form.",
      {
        label: "Remove",
        onClick: () => setVocabularySets(prev => prev.filter((_, i) => i !== index))
      }
    )
  }

  const removeVocabularyImage = (setIndex: number, imgIndex: number) => {
    const updated = [...vocabularySets]
    updated[setIndex].images = updated[setIndex].images.filter((_, i) => i !== imgIndex)
    // Re-order images
    updated[setIndex].images = updated[setIndex].images.map((img, i) => ({ ...img, order: i }))
    setVocabularySets(updated)
  }

  const addVideo = (newVideo: VideoItem) => {
    setVideos(prev => [...prev, newVideo])
  }

  const removeVideo = (index: number) => {
    const videoTitle = videos[index].title || "this video"
    noticeWarning(
      `Remove "${videoTitle}"?`,
      undefined,
      {
        label: "Remove",
        onClick: () => setVideos(prev => prev.filter((_, i) => i !== index))
      }
    )
  }

  const addVocabularyImage = (setIndex: number, newImage: VocabularyImage) => {
    setVocabularySets(prev => {
      const updated = [...prev]
      if (updated[setIndex]) {
        updated[setIndex] = {
          ...updated[setIndex],
          images: [...updated[setIndex].images, newImage]
        }
      }
      return updated
    })
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
      noticeFailure("Please complete all required fields: Title, Month, Year and at least one Level.")
      return
    }

    setIsSubmitting(true)

    const fullDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1))

    const payload = {
      title,
      month: fullDate,
      year: parseInt(year),
      levelIds: selectedLevels,
      vocabularySets: vocabularySets.filter(s => s.name && s.images.length > 0).map(s => ({
        id: s.id,
        name: s.name,
        images: s.images.map(img => ({
          id: img.id,
          imageUrl: img.imageUrl,
          fileName: img.fileName,
          order: img.order
        }))
      })),
      videos: videos.filter(v => v.title && v.videoUrl).map((v, index) => ({
        id: v.id,
        title: v.title,
        videoUrl: v.videoUrl,
        fileName: v.fileName,
        thumbnailUrl: v.thumbnailUrl || undefined,
        order: index
      })),
      forParents: forParents.filter(f => f.message).map(f => ({
        id: f.id,
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
      ? await updateNewsletter(newsletter.id, payload)
      : await createNewsletter(payload)

    if (result.ok) {
      noticeSuccess(newsletter ? "Newsletter updated successfully" : "Newsletter created successfully")
      router.push("/platform/admin/newsletters")
      router.refresh()
    } else {
      noticeFailure(result.message || "Error saving newsletter")
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

        {/* Vocabulary Sets */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Vocabulary Sets</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVocabularySet}>
                <Plus className="h-4 w-4 mr-2" /> Add Set
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {vocabularySets.map((set, setIndex) => (
                <div key={setIndex} className="p-6 border rounded-xl relative space-y-4 bg-muted/30">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                    onClick={() => removeVocabularySet(setIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="max-w-md">
                    <Label className="after:content-['*'] after:ml-0.5 after:text-red-500">Set Name (e.g. Food, Animals)</Label>
                    <Input
                      value={set.name}
                      onChange={(e) => updateVocabularySetName(setIndex, e.target.value)}
                      placeholder="Enter set name (Required for upload)"
                      className={`mt-1 ${!set.name ? 'border-amber-300 focus-visible:ring-amber-400' : ''}`}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Images ({set.images.length})</Label>
                      <CldUploadWidget
                        key={set.name}
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        onClose={() => { document.body.style.overflow = "auto" }}
                        options={{
                          multiple: true,
                          resourceType: "image",
                          clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                          folder: `esl-academy/newsletters/vocabulary/${slugify(set.name || "unnamed-set")}`,
                        }}
                        onSuccess={(result: any) => {
                          if (result.info && typeof result.info !== "string") {
                            const info = result.info as any
                            const format = info.format || "png"
                            const originalFileName = `${info.original_filename}.${format}`

                            const newImage: VocabularyImage = {
                              id: crypto.randomUUID(),
                              imageUrl: info.public_id,
                              fileName: originalFileName,
                              order: vocabularySets[setIndex].images.length
                            }
                            addVocabularyImage(setIndex, newImage)
                          }
                        }}
                      >
                        {({ open }: { open: () => void }) => (
                          <Button
                            type="button"
                            variant={!set.name ? "outline" : "secondary"}
                            size="sm"
                            disabled={!set.name}
                            onClick={() => open()}
                            className={!set.name ? "opacity-50 cursor-not-allowed" : ""}
                          >
                            <Plus className="h-4 w-4 mr-2" /> {!set.name ? "Enter Name First" : "Upload Images"}
                          </Button>
                        )}
                      </CldUploadWidget>
                    </div>

                    {set.images.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                        {set.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative aspect-square rounded-lg overflow-hidden border bg-background group">
                            <CldImage
                              width="120"
                              height="120"
                              src={img.imageUrl}
                              alt={img.fileName}
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center text-[10px] text-white">
                              <span className="truncate w-full px-1">{img.fileName}</span>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6 mt-2"
                                onClick={() => removeVocabularyImage(setIndex, imgIndex)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="absolute top-1 left-1 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded-sm">
                              #{imgIndex + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground text-sm bg-background">
                        <p>No images uploaded yet</p>
                        <p className="text-xs">Multiple selection supported</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {vocabularySets.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
                  No vocabulary sets yet. Click &quot;Add Set&quot; to start.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Videos */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Videos</CardTitle>
                <CardDescription>Upload multiple videos. Titles are generated automatically.</CardDescription>
              </div>
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onClose={() => { document.body.style.overflow = "auto" }}
                options={{
                  multiple: true,
                  resourceType: "video",
                  clientAllowedFormats: ["mp4", "mov", "webm", "mkv"],
                  folder: "esl-academy/newsletters/videos",
                }}
                onSuccess={(result: any) => {
                  if (result.info && typeof result.info !== "string") {
                    const info = result.info as any
                    const publicId = info.public_id
                    const format = info.format || "mp4"
                    const originalFilename = `${info.original_filename}.${format}`
                    const thumbnailUrl = getCloudinaryVideoThumbnail(publicId)

                    const newVideo: VideoItem = {
                      id: crypto.randomUUID(),
                      title: humanizeFileName(originalFilename),
                      videoUrl: publicId,
                      fileName: originalFilename,
                      thumbnailUrl: thumbnailUrl,
                      order: videos.length
                    }
                    addVideo(newVideo)
                  }
                }}
              >
                {({ open }: { open: () => void }) => (
                  <Button type="button" variant="outline" size="sm" onClick={() => open()}>
                    <Plus className="h-4 w-4 mr-2" /> Upload Videos
                  </Button>
                )}
              </CldUploadWidget>
            </CardHeader>
            <CardContent>
              {videos.length > 0 ? (
                <div className="space-y-3">
                  {videos.map((video, index) => (
                    <div key={video.id || index} className="flex items-center gap-4 p-3 rounded-xl border bg-muted/30 group hover:bg-muted/50 transition-colors">
                      <div className="w-16 h-10 rounded-lg overflow-hidden border bg-black flex-shrink-0 relative">
                        <CloudinaryImage
                          src={video.thumbnailUrl || getCloudinaryVideoThumbnail(video.videoUrl)}
                          alt={video.title}
                          width={64}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Play className="h-3 w-3 text-white fill-current" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{video.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{video.fileName}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeVideo(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-xl text-muted-foreground flex flex-col items-center gap-2">
                  <Video className="h-8 w-8 opacity-20" />
                  <p className="text-sm">No videos uploaded yet</p>
                </div>
              )}
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
