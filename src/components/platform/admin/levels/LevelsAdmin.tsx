"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit2, Trash2, X, Save, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createLevel, updateLevel, deleteLevel } from "@/actions/levels/level.actions"

interface LevelWithCounts {
  id: string
  name: string
  _count: {
    newsletters: number
    children: number
  }
}

interface LevelsAdminProps {
  levels: LevelWithCounts[]
}

export default function LevelsAdmin({ levels }: LevelsAdminProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEdit = (level: LevelWithCounts) => {
    setIsEditing(true)
    setEditingId(level.id)
    setName(level.name)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingId(null)
    setName("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    const result = editingId
      ? await updateLevel(editingId, name)
      : await createLevel(name)

    if (result.ok) {
      handleCancel()
      toast.success(editingId ? "Level updated successfully" : "Level created successfully")
      router.refresh()
    } else {
      toast.error(result.message || "Error saving level")
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the level "${name}"?`)) return

    const result = await deleteLevel(id)
    if (result.ok) {
      toast.success("Level deleted successfully")
      router.refresh()
    } else {
      toast.error(result.message || "Error deleting level")
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
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Levels</h1>
          <p className="text-muted-foreground mt-2">
            Manage academic levels and see their current usage in newsletters and enrollments.
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Level
          </Button>
        )}
      </motion.div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle>{editingId ? "Edit Level" : "Add New Level"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Level Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Nursery, Pre-K, Elementary..."
                      autoFocus
                      required
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSubmitting ? "Saving..." : "Save Level"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium text-center">Newsletters</th>
                  <th className="px-6 py-4 font-medium text-center">Children</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <motion.tbody
                className="divide-y"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {levels.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground italic">
                      No levels found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  levels.map((level) => (
                    <motion.tr
                      key={level.id}
                      className="hover:bg-muted/30 transition-colors"
                      variants={fadeInUp}
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {level.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {level._count.newsletters}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {level._count.children}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(level)}
                            className="h-8 w-8 p-0"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4 text-blue-600" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(level.id, level.name)}
                            className="h-8 w-8 p-0"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </motion.tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {levels.some(l => l._count.newsletters > 0 || l._count.children > 0) && (
        <motion.div
          className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex items-start gap-3"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> Levels with active newsletters or children cannot be deleted.
            Please reassign or remove associated data before deleting a level.
          </p>
        </motion.div>
      )}
    </div>
  )
}
