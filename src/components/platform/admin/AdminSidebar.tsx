"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Newspaper,
  Layers,
  Users,
  Baby,
  Package,
  ChevronRight
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/platform/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Newsletters",
    href: "/platform/admin/newsletters",
    icon: Newspaper,
  },
  {
    title: "Levels",
    href: "/platform/admin/levels",
    icon: Layers,
  },
  {
    title: "Users",
    href: "/platform/admin/users", // Placeholder
    icon: Users,
    isPlaceholder: true,
  },
  {
    title: "Children",
    href: "/platform/admin/children", // Placeholder
    icon: Baby,
    isPlaceholder: true,
  },
  {
    title: "Products",
    href: "/platform/admin/products", // Placeholder
    icon: Package,
    isPlaceholder: true,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-muted/30 hidden md:flex flex-col sticky top-16 h-[calc(100vh-4rem)]">
      <div className="p-6">
        <h2 className="text-lg font-semibold tracking-tight">Admin Console</h2>
        <p className="text-xs text-muted-foreground">Manage your academy</p>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.isPlaceholder ? "#" : item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                item.isPlaceholder && "opacity-50 cursor-not-allowed"
              )}
              onClick={(e) => item.isPlaceholder && e.preventDefault()}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 flex-shrink-0",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className="flex-1">{item.title}</span>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t">
        <div className="bg-primary/5 rounded-lg p-3">
          <p className="text-[10px] uppercase font-bold text-primary tracking-wider">Miss Kelly ESL</p>
          <p className="text-[10px] text-muted-foreground">Version 1.0.0-admin</p>
        </div>
      </div>
    </aside>
  )
}
