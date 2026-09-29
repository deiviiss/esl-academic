"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Edit, Eye, EyeOff, Loader2, Trash2, Plus, AlertTriangle, ArrowLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { NewsletterListItem } from "@/interfaces/newsletter.interface"
import { deleteNewsletter, toggleNewsletterPublished } from "@/actions/newsletters/newsletter.actions"
import { noticeSuccess, noticeFailure } from "@/components/toast-notifications/ToastNotifications"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface NewsletterAdminListProps {
  newsletters: NewsletterListItem[]
}

interface MonthGroup {
  key: string
  year: number
  monthIndex: number
  label: string
  newsletters: NewsletterListItem[]
}

export default function NewsletterAdminList({ newsletters }: NewsletterAdminListProps) {
  const router = useRouter()
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [publishingId, setPublishingId] = useState<string | null>(null)
  const [publishedOverrides, setPublishedOverrides] = useState<Record<string, boolean>>({})
  const [newsletterToDelete, setNewsletterToDelete] = useState<{ id: string; title: string } | null>(null)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  // Group newsletters strictly by year and month (title is NOT used for grouping)
  const groups = useMemo<MonthGroup[]>(() => {
    const map = new Map<string, MonthGroup>()

    for (const item of newsletters) {
      const d = new Date(item.month)
      const year = typeof item.year === "number" ? item.year : d.getUTCFullYear()
      const monthIndex = !isNaN(d.getTime()) ? d.getUTCMonth() : 0
      const groupKey = `${year}-${monthIndex}`

      if (!map.has(groupKey)) {
        const label = format(new Date(year, monthIndex, 1), "MMMM yyyy")
        map.set(groupKey, {
          key: groupKey,
          year,
          monthIndex,
          label,
          newsletters: []
        })
      }

      map.get(groupKey)!.newsletters.push(item)
    }

    // Sort groups chronologically from newest to oldest
    return Array.from(map.values()).sort((a, b) => {
      if (b.year !== a.year) {
        return b.year - a.year
      }
      return b.monthIndex - a.monthIndex
    })
  }, [newsletters])

  // Get active selected group if set
  const selectedGroup = useMemo(() => {
    if (!selectedGroupKey) return null
    return groups.find((g) => g.key === selectedGroupKey) ?? null
  }, [groups, selectedGroupKey])

  // If a group becomes empty (e.g. after deletion), return to months view
  useEffect(() => {
    if (selectedGroupKey && !groups.some((g) => g.key === selectedGroupKey)) {
      setSelectedGroupKey(null)
    }
  }, [groups, selectedGroupKey])

  useEffect(() => {
    setPublishedOverrides((overrides) => {
      const remainingOverrides = Object.fromEntries(
        Object.entries(overrides).filter(([id, isPublished]) => {
          const newsletter = newsletters.find((item) => item.id === id)
          return newsletter && newsletter.isPublished !== isPublished
        })
      )

      if (Object.keys(remainingOverrides).length === Object.keys(overrides).length) {
        return overrides
      }

      return remainingOverrides
    })
  }, [newsletters])

  const handleDeleteClick = (id: string, title: string) => {
    setNewsletterToDelete({ id, title })
    setIsDeleteAlertOpen(true)
  }

  const confirmDelete = async () => {
    if (!newsletterToDelete) return

    const { id } = newsletterToDelete
    setDeletingId(id)
    const result = await deleteNewsletter(id)

    if (result.ok) {
      noticeSuccess("Newsletter deleted successfully")
      router.refresh()
    } else {
      noticeFailure(result.message || "Error deleting newsletter")
      setDeletingId(null)
    }
    setIsDeleteAlertOpen(false)
    setNewsletterToDelete(null)
  }

  const handleTogglePublished = async (id: string) => {
    setPublishingId(id)
    try {
      const result = await toggleNewsletterPublished(id)

      if (result.ok && result.newsletter) {
        setPublishedOverrides((overrides) => ({
          ...overrides,
          [id]: result.newsletter.isPublished
        }))
        noticeSuccess(result.message || "Newsletter visibility updated successfully")
        router.refresh()
      } else {
        noticeFailure(result.message || "Error updating newsletter visibility")
      }
    } catch {
      noticeFailure("Error updating newsletter visibility")
    } finally {
      setPublishingId(null)
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

  const getPublishedState = (newsletter: NewsletterListItem) =>
    publishedOverrides[newsletter.id] ?? newsletter.isPublished

  return (
    <div className="container px-4 md:px-8 py-8 md:py-12">
      <motion.div
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Newsletters Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage the monthly newsletters of the platform
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/platform/admin/newsletters/create">
            <Plus className="h-5 w-5 mr-2" />
            Create Newsletter
          </Link>
        </Button>
      </motion.div>

      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        {newsletters.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground italic">No newsletters created yet.</p>
          </div>
        ) : selectedGroup ? (
          /* Level 2: Newsletters of selected month */
          <div className="space-y-6">
            <div className="flex flex-col gap-3 pb-4 border-b">
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedGroupKey(null)}
                  className="gap-2 shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Months
                </Button>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary shrink-0">
                  {selectedGroup.newsletters.length} {selectedGroup.newsletters.length === 1 ? "newsletter" : "newsletters"}
                </span>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  {selectedGroup.label}
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Showing all newsletters for {selectedGroup.label}
                </p>
              </div>
            </div>

            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {selectedGroup.newsletters.map((newsletter) => (
                <motion.div key={newsletter.id} variants={fadeInUp}>
                  <Card className="h-full flex flex-col">
                    <CardHeader className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4"
                        onClick={() => handleTogglePublished(newsletter.id)}
                        disabled={publishingId === newsletter.id || deletingId === newsletter.id}
                        title={getPublishedState(newsletter) ? "Hide newsletter" : "Show newsletter"}
                        aria-label={getPublishedState(newsletter) ? "Hide newsletter" : "Show newsletter"}
                      >
                        {publishingId === newsletter.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : getPublishedState(newsletter) ? (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        {(() => {
                          const d = new Date(newsletter.month)
                          return format(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()), "MMMM yyyy")
                        })()}
                      </div>
                      <CardTitle>{newsletter.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          <strong>Levels:</strong> {newsletter.levels.map((l) => l.name).join(", ")}
                        </p>
                        <p className="text-muted-foreground">
                          <strong>Created:</strong> {format(new Date(newsletter.createdAt), "MM/dd/yyyy")}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        asChild
                        disabled={deletingId === newsletter.id}
                      >
                        <Link href={`/platform/admin/newsletters/${newsletter.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDeleteClick(newsletter.id, newsletter.title)}
                        disabled={deletingId === newsletter.id}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deletingId === newsletter.id ? "Deleting..." : "Delete"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          /* Level 1: Month / Year groups */
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {groups.map((group) => {
              const uniqueLevels = Array.from(
                new Set(group.newsletters.flatMap((n) => n.levels.map((l) => l.name)))
              )

              return (
                <motion.div key={group.key} variants={fadeInUp} whileHover={{ y: -4 }}>
                  <Card
                    className="h-full flex flex-col hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md group"
                    onClick={() => setSelectedGroupKey(group.key)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                          {group.newsletters.length} {group.newsletters.length === 1 ? "newsletter" : "newsletters"}
                        </span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {group.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {uniqueLevels.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-xs text-muted-foreground font-medium">Levels included:</p>
                          <div className="flex flex-wrap gap-1">
                            {uniqueLevels.map((lvl) => (
                              <span
                                key={lvl}
                                className="text-[11px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded"
                              >
                                {lvl}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-3 border-t">
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-primary group-hover:translate-x-0.5 transition-transform p-0 h-auto font-medium"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedGroupKey(group.key)
                        }}
                      >
                        <span>View newsletters</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </motion.div>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the newsletter &quot;{newsletterToDelete?.title}&quot;?
              This will permanently remove the newsletter and all its associated files. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNewsletterToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              Delete Newsletter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
