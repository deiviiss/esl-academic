'use client'

import { useRef, useState } from "react"
import { ButtonLogout } from '@/components/auth/ButtonLogout'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader, Settings, Upload, User as UserIcon, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Input } from "@/components/ui/input"
import { type User } from "@/interfaces/user.interface"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { noticeFailure, noticeSuccess } from "@/components//toast-notifications/ToastNotifications"
import { updateUser } from "@/actions/users/update-user"
import { updateUserPassword } from "@/actions/users/update-user-password"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { updateUserImage } from "@/actions/users/update-user-image"
import { deleteUserImage } from "@/actions/users/delete-user-image"

const userSchema = z.object({
  name: z.string().min(3, { message: 'Name is required' }).max(255, { message: 'Name must be less than 255 characters' }),
  email: z.string().email({
    message: 'The email address is not valid'
  }),
  phoneNumber: z
    .string()
    .min(10, {
      message: 'The phone number must be 10 characters without the country code'
    })
    .max(10, {
      message: 'The phone number must be 10 characters without the country code'
    })
})

const passwordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, { message: 'Current password is required' }),
  newPassword: z
    .string()
    .min(6, { message: 'The new password must have at least 6 characters' })
    .max(10, { message: 'The new password must be less than 10 characters' }),
  confirmPassword: z
    .string()
    .min(6, { message: 'The confirm password must have at least 6 characters' })
    .max(10, { message: 'Confirm password must be less than 10 characters' }),
})

interface profileProps {
  user: User
}

export const ProfileClient = ({ user }: profileProps) => {
  const [activeTab, setActiveTab] = useState("personal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string>(user.image || 'imgs/avatar.png')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const defaultValuesUserInfo = {
    name: user.name || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || ''
  }

  const defaultValuesUserPassword = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  const formPassword = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: defaultValuesUserPassword
  })

  const formUserInfo = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValuesUserInfo
  })

  const onSubmitUserInfo = async (values: z.infer<typeof userSchema>) => {
    setIsSubmitting(true)

    const data = {
      id: user.id,
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber
    }

    const { ok, message } = await updateUser(data)

    if (!ok) {
      setError(message)
      setIsSubmitting(false)
      return
    }

    setError('')
    noticeSuccess(message)
    setIsSubmitting(false)
  }

  const onSubmitPassword = async (values: z.infer<typeof passwordSchema>) => {
    setIsSubmitting(true)

    if (values.newPassword !== values.confirmPassword) {
      noticeFailure("New password and confirm password do not match")
      setIsSubmitting(false);
      return
    }

    const data = {
      id: user.id,
      currentPassword: values.currentPassword,
      newPassword: values.newPassword
    }

    const { ok, message } = await updateUserPassword(data)

    if (!ok) {
      noticeFailure(message)
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
    setError('')
    noticeSuccess("Password updated successfully")
    formPassword.reset()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarUpload = async () => {
    setIsSubmitting(true)

    const image = fileInputRef.current?.files?.[0];

    if (!image) {
      noticeFailure("No file selected");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const { ok: okDeleteImage } = await deleteUserImage(user.image || '')

      if (!okDeleteImage) {
        noticeFailure("Error deleting old image, please contact support")
        return
      }

      // Upload the image to 
      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.ok) {
        noticeFailure(data.message || "Upload failed");
        return;
      }

      const { ok, message } = await updateUserImage(data.url)

      if (!ok) {
        noticeFailure(message || "Error uploading image")
        return
      }

      noticeSuccess("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      noticeFailure("An error occurred while uploading the image");
    } finally {
      setIsSubmitting(false)
      setAvatarModalOpen(false);
    }
  };

  const clearAvatarPreview = () => {
    setAvatarPreview('/imgs/avatar.png')
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  const navItems = [
    { icon: <UserIcon className="h-4 w-4" />, label: "Personal Info", value: "personal" },
    { icon: <Settings className="h-4 w-4" />, label: "Settings", value: "settings" },
  ]

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        animate: { transition: { staggerChildren: 0.1 } },
      }}
    >
      <motion.div variants={fadeInUp} className="flex items-center gap-4 justify-between mb-8 pt-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and subscription</p>
        </div>
        <ButtonLogout />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        {/* Sidebar navigation */}
        <motion.div variants={fadeInUp} className="space-y-4">
          {/* User info card */}
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={user.image || "/imgs/avatar.png"}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>

              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => setAvatarModalOpen(true)}
              >
                Change Avatar
              </Button>
            </CardContent>
          </Card>

          {/* sidebar navigation */}
          <Card >
            <CardContent className="p-4">
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Button
                    key={item.value}
                    variant={activeTab === item.value ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => setActiveTab(item.value)}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main content Tabs */}
        <motion.div variants={fadeInUp}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto scrollbar-hide hidden md:block">
              <TabsList className="flex w-max gap-2">
                {navItems.map((item) => (
                  <TabsTrigger key={item.value} value={item.value}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...formUserInfo}>
                    <form onSubmit={formUserInfo.handleSubmit(onSubmitUserInfo)} className="space-y-4">
                      <div className="grid gap-4">
                        <FormField
                          control={formUserInfo.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="name">Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={true}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formUserInfo.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="email">Email</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={isSubmitting}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formUserInfo.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={isSubmitting}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                      </div>
                      <div className="text-sm text-red-600">
                        {error && (
                          <div className="flex mb-2">
                            <p>{error}</p>
                          </div>
                        )}
                      </div>
                      <Button className="mt-4" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save changes"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences and security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Password</h3>
                      <Form {...formPassword}>
                        <form onSubmit={formPassword.handleSubmit(onSubmitPassword)} className="space-y-4">
                          <div className="grid gap-2">
                            <FormField
                              control={formPassword.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
                                  <FormControl>
                                    <Input
                                      disabled={isSubmitting}
                                      type="password"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={formPassword.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel htmlFor="newPassword">New Password</FormLabel>
                                  <FormControl>
                                    <Input
                                      disabled={isSubmitting}
                                      type="password"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={formPassword.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
                                  <FormControl>
                                    <Input
                                      disabled={isSubmitting}
                                      type="password"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="text-sm text-red-600">
                            {error && (
                              <div className="flex mb-2">
                                <p>{error}</p>
                              </div>
                            )}
                          </div>

                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Password"}
                          </Button>
                        </form>
                      </Form>
                    </div>

                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => noticeFailure("Deleting is not allowed")}
                  >
                    Delete Account
                  </Button>
                  <Button
                    onClick={() => noticeSuccess("Settings saved successfully")}
                  >
                    Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* TODO: create component */}
      {/* Avatar Change Modal */}
      <Dialog open={avatarModalOpen} onOpenChange={setAvatarModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture. The image should be square and at least 200x200 pixels.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={avatarPreview || "/imgs/avatar.png"}
                  alt="Preview"
                  className="object-cover"
                />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>

              {avatarPreview ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline" size="sm"
                    onClick={clearAvatarPreview}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                </div>
              ) : (
                <Button
                  disabled={isSubmitting}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              )}

              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setAvatarModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAvatarUpload}
              disabled={!avatarPreview || isSubmitting}
            >
              {isSubmitting ? <>
                Saving
                <Loader className="animate-spin h-4 w-4 mr-2" />
              </> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
