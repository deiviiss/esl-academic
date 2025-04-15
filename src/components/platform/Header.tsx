"use client"

import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ToogleDarkMode } from '../dark-mode/toogle-dark-mode/toogle-dark-mode'
import { usePathname } from 'next/navigation'

export default function Header() {
  const path = usePathname()
  const isProfilePage = path.includes('/platform/profile')

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container flex flex-col md:h-16 items-center justify-between p-3 gap-2">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Ms. Kelly ESL Academy</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {["Newsletters", "Images", "Videos"].map((item) => (
              <Link key={item} href={`/platform/${item.toLowerCase().replace(" ", "-")}`}>
                <motion.span
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.span>
              </Link>
            ))}
          </nav>
          <div className='flex items-center gap-3'>
            < ToogleDarkMode />
            <Button
              asChild
            >
              {
                <Link href={isProfilePage ? "/platform" : "/platform/profile"} >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isProfilePage ? "Home" : "Profile"}
                  </motion.span>
                </Link>
              }
            </Button>
          </div>
        </div>
        <nav className="flex md:hidden gap-6">
          {["Newsletters", "Images", "Videos"].map((item) => (
            <Link key={item} href={`/#${item.toLowerCase().replace(" ", "-")}`}>
              <motion.span
                className="text-sm font-medium text-muted-foreground hover:text-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.span>
            </Link>
          ))}
        </nav>
      </div>
    </motion.header>
  )
}

