"use client"

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ToogleDarkMode } from '../dark-mode/toogle-dark-mode/toogle-dark-mode'

export default function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const isAuthenticated = !!session?.user
  const isAdmin = session?.user?.role === 'admin'

  const scrollToSection = (e: React.MouseEvent, sectionId: string | undefined) => {
    if (pathname === '/' && sectionId) {
      e.preventDefault()
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container flex flex-col md:h-16 lg:h-20 items-center justify-between p-3 gap-2">
        <div className="flex items-center md:h-full justify-between w-full max-w-5xl">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.webp"
              alt="Miss Kelly ESL Academy"
              width={110}
              height={44}
              className="h-auto w-[110px]"
            />
          </Link>
          <nav className="hidden md:flex gap-6">
            {pathname === '/about' ? (
              <Link href="/">
                <motion.span
                  className="text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Home
                </motion.span>
              </Link>
            ) : (
              [
                { label: "Our Method", href: "/#our-method" },
                { label: "Parents Love Us", href: "/#why-parents-love" },
                { label: "What They Learn", href: "/#what-child-learns" },
                { label: "Programs", href: "/#services" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/#contact" },
              ].map((item) => (
                <Link key={item.label} href={item.href} onClick={(e) => scrollToSection(e, item.href.split("#")[1])}>
                  <motion.span
                    className="text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              ))
            )}
          </nav>
          <div className='flex items-center gap-3'>
            < ToogleDarkMode />
            <Button
              asChild
            >
              {
                isAuthenticated ? (
                  <Link href={isAdmin ? "/platform/profile" : "/platform/profile"} >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isAdmin ? "Admin" : "Profile"}
                    </motion.span>
                  </Link>
                ) : (
                  <Link href="/auth/login">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Get Started
                    </motion.span>
                  </Link>
                )
              }
            </Button>
          </div>
        </div>
        <nav className="flex md:hidden gap-6">
          {pathname === '/about' ? (
            <Link href="/">
              <motion.span
                className="text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Home
              </motion.span>
            </Link>
          ) : (
            [
              { label: "Our Method", href: "/#our-method" },
              { label: "Programs", href: "/#services" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/#contact" },
            ].map((item) => (
              <Link key={item.label} href={item.href} onClick={(e) => scrollToSection(e, item.href.split("#")[1])}>
                <motion.span
                  className="text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            ))
          )}
        </nav>
      </div>
    </motion.header>
  )
}

