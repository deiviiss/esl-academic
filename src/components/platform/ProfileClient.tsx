'use client'

import { useState } from "react"
import { ButtonLogout } from '@/components/auth/ButtonLogout'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, BookOpen, CreditCard, Settings, User as UserIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { type User } from "@/interfaces/users/user.interface"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { noticeFailure, noticeSuccess } from "@/components//toast-notifications/ToastNotifications"
import { updateUser } from "@/actions/users/update-user"
import { updateUserPassword } from "@/actions/users/update-user-password"

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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  }

  const navItems = [
    { icon: <UserIcon className="h-4 w-4" />, label: "Personal Info", value: "personal" },
    { icon: <CreditCard className="h-4 w-4" />, label: "Subscription", value: "subscription" },
    { icon: <BookOpen className="h-4 w-4" />, label: "Learning Materials", value: "materials" },
    { icon: <Bell className="h-4 w-4" />, label: "Notifications", value: "notifications" },
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
      <motion.div variants={fadeInUp} className="flex items-center gap-4 justify-between mb-8">
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
                <AvatarImage src={user.image || "/imgs/avatar.png"} alt="Profile" />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge className="mt-2" variant="secondary">
                {user.subscriptionPlan?.name || "Level Unknown"}
              </Badge>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Change Avatar
              </Button>
            </CardContent>
          </Card>

          {/* sidebar navigation */}
          <Card>
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

        <motion.div variants={fadeInUp}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-hidden">
              <TabsList >
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

            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Plan</CardTitle>
                  <CardDescription>Manage your subscription and billing information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">Premium Plan</h3>
                          <p className="text-sm text-muted-foreground">$19.99/month</p>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>Next billing date: June 15, 2024</p>
                      </div>
                    </div>
                    {/* <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Payment Method</h3>
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        <span>•••• •••• •••• 4242</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                        <Button variant="outline" size="sm">
                          Add New
                        </Button>
                      </div>
                    </div> */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Payment Method</h3>
                      <div className="flex items-center">
                        <span className="text-sm">Cash</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => noticeFailure("Changes are not allowed")}
                        >
                          Update
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => noticeFailure("Adding is not allowed")}
                        >
                          Add New
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Billing History</h3>
                      <div className="text-sm">
                        <div className="flex justify-between py-2 border-b">
                          <span>May 15, 2024</span>
                          <span>$19.99</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span>April 15, 2024</span>
                          <span>$19.99</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span>March 15, 2024</span>
                          <span>$19.99</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => noticeFailure("Canceling is not allowed")}
                  >
                    Cancel Subscription
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="materials">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Materials</CardTitle>
                  <CardDescription>Access your learning resources and downloads</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { title: "May Newsletter", type: "PDF", date: "May 1, 2024" },
                        { title: "April Vocabulary List", type: "PDF", date: "April 15, 2024" },
                        { title: "Spring Activities", type: "PDF", date: "March 20, 2024" },
                        { title: "Conversation Practice", type: "Audio", date: "May 5, 2024" },
                        { title: "Reading Exercises", type: "PDF", date: "April 28, 2024" },
                        { title: "Pronunciation Guide", type: "Video", date: "March 10, 2024" },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.03 }}
                          className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">Added: {item.date}</p>
                            </div>
                            <Badge variant="outline">{item.type}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => noticeSuccess(`Downloading ${item.title}...`)}
                            disabled={isSubmitting}
                          >
                            Download
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => noticeSuccess("Redirecting to all materials...")}
                  >
                    View All Materials
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Email Notifications</h3>
                      <div className="space-y-2">
                        {[
                          "New learning materials",
                          "Subscription updates",
                          "Special offers and promotions",
                          "Newsletter",
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <Label htmlFor={`email-${index}`}>{item}</Label>
                            <input
                              type="checkbox"
                              id={`email-${index}`}
                              defaultChecked={index < 2}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => noticeSuccess("Preferences saved successfully")}
                  >
                    Save Preferences</Button>
                </CardFooter>
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
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Language Preferences</h3>
                      <div className="grid gap-2">
                        <Label htmlFor="language">Interface Language</Label>
                        <select id="language" className="w-full rounded-md border border-input bg-background px-3 py-2">
                          <option value="en">English</option>
                          {/* <option value="es">Español</option> */}
                        </select>
                      </div>
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
    </motion.div>
  )
}
