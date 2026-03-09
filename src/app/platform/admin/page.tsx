"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Newspaper, Layers, Users, Package, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const quickStats = [
  {
    title: "Newsletters",
    description: "Manage monthly newsletters and content",
    icon: Newspaper,
    href: "/platform/admin/newsletters",
    color: "bg-blue-500",
  },
  {
    title: "Levels",
    description: "Configure academic levels",
    icon: Layers,
    href: "/platform/admin/levels",
    color: "bg-purple-500",
  },
  {
    title: "Users",
    description: "Manage students and administrators",
    icon: Users,
    href: "/platform/admin/users",
    color: "bg-orange-500",
  },
  {
    title: "Products",
    description: "Store management and subscriptions",
    icon: Package,
    href: "#",
    color: "bg-green-500",
    isPlaceholder: true,
  },
]

export default function AdminDashboard() {
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
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">Admin Panel</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the academy management dashboard. Use the cards below or the sidebar to navigate.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {quickStats.map((stat) => (
          <motion.div key={stat.title} variants={fadeInUp}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs mb-4">
                  {stat.description}
                </CardDescription>
                <Link
                  href={stat.isPlaceholder ? "#" : stat.href}
                  className={`inline-flex items-center text-xs font-semibold ${stat.isPlaceholder ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:underline'}`}
                  onClick={(e) => stat.isPlaceholder && e.preventDefault()}
                >
                  Go to management <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2 mt-4"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg m-4 mt-0">
            Activity logs will appear here
          </CardContent>
        </Card>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-lg">System Status</CardTitle>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg m-4 mt-0">
            System metrics will appear here
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
