"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Users, ChevronDown, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChildSummary } from "@/interfaces/child.interface"

interface ChildSelectorProps {
  childrenList: ChildSummary[]
  selectedChildId: string
}

export function ChildSelector({ childrenList, selectedChildId }: ChildSelectorProps) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedChild = childrenList.find(c => c.id === selectedChildId) || childrenList[0]


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const onValueChange = (value: string) => {
    router.push(`/platform/academy/newsletters?childId=${value}`)
  }

  return (
    <div
      ref={containerRef}
      className="flex justify-center mb-8 mt-2 relative z-40">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="w-full max-w-sm p-6 rounded-2xl bg-background/40 backdrop-blur-md border border-white/20 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <label
                  htmlFor="child-select"
                  className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent uppercase tracking-wider"
                >
                  Select Student
                </label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setIsExpanded(false)}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
            <Select value={selectedChildId} onValueChange={onValueChange}>
              <SelectTrigger
                id="child-select"
                className="h-12 bg-background/50 border-white/10 rounded-xl hover:bg-background/80 transition-all duration-300"
              >
                <SelectValue placeholder="Selection a student" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-white/20 backdrop-blur-lg">
                {childrenList.map((child) => (
                  <SelectItem key={child.id} value={child.id} className="focus:bg-primary/10 rounded-lg cursor-pointer">
                    <span className="font-medium text-foreground">{child.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">({child.level.name})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              variant="outline"
              onClick={() => setIsExpanded(true)}
              className="group h-10 px-4 rounded-full bg-background/40 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-primary/20 transition-all duration-500 hover:scale-105"
            >
              <Users className="w-4 h-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium mr-1">{selectedChild?.name}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
