'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  Baby,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { removeChild } from '@/actions/users/manage-children'
import { noticeSuccess, noticeFailure } from '@/components/toast-notifications/ToastNotifications'
import { useRouter } from 'next/navigation'
import ChildForm from './ChildForm'
import ParentForm from './ParentForm'
import { grantAcademyAccess, revokeAcademyAccess } from '@/actions/users/access.actions'
import { CheckCircle2, XCircle } from 'lucide-react'
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

interface Level {
  id: string
  name: string
}

interface Child {
  id: string
  name: string
  levelId: string
  level: {
    name: string
  }
}

interface User {
  id: string
  name: string
  email: string
  phoneNumber: string
  isActive: boolean
  role: string
  children: {
    child: Child
  }[]
  purchase?: {
    product: {
      type: string
    }
  }[]
}

interface UserDetailProps {
  user: User
  levels: Level[]
}

export default function UserDetail({ user, levels }: UserDetailProps) {
  const router = useRouter()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isParentFormOpen, setIsParentFormOpen] = useState(false)
  const [isSubmittingAccess, setIsSubmittingAccess] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | undefined>(undefined)
  const [childToDelete, setChildToDelete] = useState<string | null>(null)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)

  const handleRemoveChild = async (childId: string) => {
    setChildToDelete(childId)
    setIsDeleteAlertOpen(true)
  }

  const confirmRemoveChild = async () => {
    if (!childToDelete) return

    const result = await removeChild(childToDelete, user.id)
    if (result.ok) {
      noticeSuccess('Child removed successfully')
      router.refresh()
    } else {
      noticeFailure(result.message || 'Error removing child')
    }
    setChildToDelete(null)
    setIsDeleteAlertOpen(false)
  }

  const hasAcademyAccess = user.purchase?.some((p) => p.product.type === 'academy')

  const handleGrantAccess = async () => {
    setIsSubmittingAccess(true)
    const result = await grantAcademyAccess(user.id)
    if (result.ok) {
      noticeSuccess(result.message)
      router.refresh()
    } else {
      noticeFailure(result.message)
    }
    setIsSubmittingAccess(false)
  }

  const handleRevokeAccess = async () => {
    setIsSubmittingAccess(true)
    const result = await revokeAcademyAccess(user.id)
    if (result.ok) {
      noticeSuccess(result.message)
      router.refresh()
    } else {
      noticeFailure(result.message)
    }
    setIsSubmittingAccess(false)
  }

  const handleEditChild = (child: Child) => {
    setEditingChild(child)
    setIsFormOpen(true)
  }

  const handleAddChild = () => {
    setEditingChild(undefined)
    setIsFormOpen(true)
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/platform/admin/users">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to users
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Parent Information */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="md:col-span-1">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                Parent Profile
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsParentFormOpen(true)}
                className="h-8 w-8 p-0"
                title="Edit parent information"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center pb-6 border-b">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <UserIcon className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <Badge variant={user.isActive ? "default" : "destructive"} className="mt-2">
                  {user.isActive ? 'Active Member' : 'Inactive Member'}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Email</p>
                    <p className="text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Phone</p>
                    <p className="text-sm">{user.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Role</p>
                    <p className="text-sm capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Children Management */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
          className="md:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-5 w-5 text-primary" />
                Children Enrolled
              </CardTitle>
              <Button onClick={handleAddChild} size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Add Child
              </Button>
            </CardHeader>
            <CardContent>
              {user.children.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Baby className="h-12 w-12 opacity-20 mb-4" />
                  <p>No children assigned to this account yet.</p>
                  <Button variant="link" onClick={handleAddChild} className="mt-2">
                    Add the first child
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {user.children.map(({ child }) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <Baby className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{child.name}</p>
                          <Badge variant="outline" className="text-[10px] h-5 mt-1 font-normal">
                            {child.level.name}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditChild(child)}
                          title="Edit child"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveChild(child.id)}
                          title="Remove child"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscription Management */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4 py-4">
                {hasAcademyAccess ? (
                  <>
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                      <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">Active – Academy</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        User has access to newsletters and resources.
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleRevokeAccess}
                      disabled={isSubmittingAccess}
                    >
                      Remove Academy Access
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full">
                      <XCircle className="h-8 w-8 text-slate-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-muted-foreground">No active product</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Grant access to allow the user to view the academy.
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleGrantAccess}
                      disabled={isSubmittingAccess}
                    >
                      Assign Academy Access
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ChildForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          router.refresh()
        }}
        userId={user.id}
        levels={levels}
        child={editingChild}
      />

      <ParentForm
        isOpen={isParentFormOpen}
        onClose={() => {
          setIsParentFormOpen(false)
          router.refresh()
        }}
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber
        }}
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this child from the system? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setChildToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveChild}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
