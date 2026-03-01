"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ToogleDarkMode } from '../dark-mode/toogle-dark-mode/toogle-dark-mode'
import { usePathname } from 'next/navigation'
import Image from "next/image"
import { cn } from "@/lib/utils"

interface HeaderClientProps {
  hasCourse: boolean
  isAdmin: boolean
}

export default function HeaderClient({ hasCourse, isAdmin }: HeaderClientProps) {
  const path = usePathname()
  const isProfilePage = path.includes('/platform/profile')
  const isAdminPage = path.includes('/platform/admin')

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container flex flex-col md:h-16 items-center justify-between p-3 gap-2">
        <div className="flex items-center justify-between w-full max-w-5xl">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.webp"
              alt="Miss Kelly ESL Academy"
              width={100}
              height={0}
            />
          </Link>

          <nav className="hidden md:flex gap-6">
            {hasCourse && (
              <Link href="/platform/course">
                <motion.span
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  My Courses
                </motion.span>
              </Link>
            )}
            {isAdmin && (
              <Link href="/platform/admin">
                <motion.span
                  className={cn(
                    "text-sm font-medium hover:text-primary transition-colors",
                    isAdminPage ? "text-primary" : "text-muted-foreground"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Admin Panel
                </motion.span>
              </Link>
            )}
          </nav>
          <div className='flex items-center gap-3'>
            < ToogleDarkMode />
            <Button
              asChild
              variant={isAdminPage ? "outline" : "default"}
            >
              <Link href={isProfilePage ? "/platform" : "/platform/profile"} >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isProfilePage ? "Newsletters" : "Profile"}
                </motion.span>
              </Link>
            </Button>
          </div>
        </div>
        <nav className="flex md:hidden gap-6">
          {hasCourse && (
            <Link href="/platform/course">
              <motion.span
                className="text-sm font-medium text-muted-foreground hover:text-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                My Courses
              </motion.span>
            </Link>
          )}
          {isAdmin && (
            <Link href="/platform/admin">
              <motion.span
                className={cn(
                  "text-sm font-medium hover:text-primary transition-colors",
                  isAdminPage ? "text-primary" : "text-muted-foreground"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Admin
              </motion.span>
            </Link>
          )}
        </nav>
      </div>
    </motion.header>
  )
}
