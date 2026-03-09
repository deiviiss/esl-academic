"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Edit, Trash2, Plus, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { NewsletterListItem } from "@/interfaces/newsletter.interface"
import { deleteNewsletter } from "@/actions/newsletters/newsletter.actions"
import { noticeSuccess, noticeFailure } from "@/components/toast-notifications/ToastNotifications"
import { useRouter } from "next/navigation"
import { useState } from "react"
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

export default function NewsletterAdminList({ newsletters }: NewsletterAdminListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [newsletterToDelete, setNewsletterToDelete] = useState<{ id: string; title: string } | null>(null)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

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
        ) : (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
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
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <strong>Levels:</strong> {newsletter.levels.map(l => l.name).join(', ')}
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
                      {deletingId === newsletter.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
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
