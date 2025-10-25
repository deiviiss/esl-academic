import { BookOpen } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col gap-4 py-10 md:flex-row md:justify-between">
        <div className="flex flex-col space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold">Miss Kelly ESL Academy</span>
          </Link>
          <p className="text-sm text-muted-foreground">Inspiring confident English speakers</p>
        </div>
        <div className="flex space-x-4 text-sm">
          <Link href="#" className="text-muted-foreground hover:text-primary">
            Terms
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            Privacy
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            Contact
          </Link>
        </div>
      </div>
      <div className="border-t">
        <div className="container flex flex-col gap-2 py-4 md:flex-row md:justify-between md:gap-0">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Miss Kelly ESL Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

