"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save, X } from "lucide-react"
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
  const [month, setMonth] = useState(
    newsletter?.month ? new Date(newsletter.month).toISOString().slice(0, 7) : ""
  )
  const [year, setYear] = useState(newsletter?.year.toString() || new Date().getFullYear().toString())
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
      alert("Please complete all required fields: Title, Month, Year and at least one Level.")
      return
    }

    setIsSubmitting(true)

    const monthDate = new Date(`${month}-01`)

    const data: any = {
      title,
      month: monthDate,
      year: parseInt(year),
      levelIds: selectedLevels,
      vocabularies: vocabularies.filter(v => v.word && v.pronunciation && v.imageUrl),
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
      router.push("/platform/admin/newsletters")
      router.refresh()
    } else {
      alert(result.message || "Error saving newsletter")
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
        {/* Información General */}
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
                  <Input
                    id="month"
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                  />
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

        {/* Vocabulario */}
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
                    <div>
                      <Label>Image URL</Label>
                      <Input
                        value={vocab.imageUrl}
                        onChange={(e) => updateVocabulary(index, "imageUrl", e.target.value)}
                        placeholder="https://..."
                      />
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
                    <div>
                      <Label>Video URL</Label>
                      <Input
                        value={video.videoUrl}
                        onChange={(e) => updateVideo(index, "videoUrl", e.target.value)}
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Thumbnail URL (optional)</Label>
                    <Input
                      value={video.thumbnailUrl || ""}
                      onChange={(e) => updateVideo(index, "thumbnailUrl", e.target.value)}
                      placeholder="https://..."
                    />
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

        {/* Botones */}
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
