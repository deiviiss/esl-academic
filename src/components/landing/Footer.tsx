"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { titleFont } from "@/config/fonts"
import { FaInstagram, FaWhatsapp } from "react-icons/fa6"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()

  const scrollToSection = (e: React.MouseEvent, sectionId: string | undefined) => {
    if (pathname === "/" && sectionId) {
      e.preventDefault()
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <footer className="w-full border-t bg-background pt-16 pb-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.webp"
                alt="Miss Kelly ESL Academy Logo"
                width={120}
                height={48}
                className="h-auto w-[120px]"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Inspiring confident English speakers through play-based learning and psychological expertise.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col space-y-4">
            <h3 className={`${titleFont.className} text-lg font-bold text-primary`}>Quick Links</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  About Miss Kelly
                </motion.span>
              </Link>
              <Link
                href="/#our-method"
                onClick={(e) => scrollToSection(e, "our-method")}
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  Our Method
                </motion.span>
              </Link>
              <Link
                href="/#contact"
                onClick={(e) => scrollToSection(e, "contact")}
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  Get in Touch
                </motion.span>
              </Link>
            </nav>
          </div>

          {/* Programs Column */}
          <div className="flex flex-col space-y-4">
            <h3 className={`${titleFont.className} text-lg font-bold text-primary`}>Programs</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link
                href="/#services"
                onClick={(e) => scrollToSection(e, "services")}
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  Core Programs
                </motion.span>
              </Link>
              <Link
                href="/#reviews"
                onClick={(e) => scrollToSection(e, "reviews")}
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  Testimonials
                </motion.span>
              </Link>
            </nav>
          </div>

          {/* Social Column */}
          <div className="flex flex-col space-y-4">
            <h3 className={`${titleFont.className} text-lg font-bold text-primary`}>Follow Us</h3>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.instagram.com/mskellyy_eslacademyy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 p-2 rounded-full bg-secondary/10 hover:bg-secondary/20"
                aria-label="Follow us on Instagram"
                title="Follow us on Instagram"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/9811339839"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#25D366] transition-colors duration-200 p-2 rounded-full bg-secondary/10 hover:bg-[#25D366]/10"
                aria-label="Chat with us on WhatsApp"
                title="Chat on WhatsApp"
              >
                <FaWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Miss Kelly ESL Academy. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-primary transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

