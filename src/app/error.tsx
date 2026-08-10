"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function Error({
  error
}: {
  error: Error & { digest?: string }
}) {
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    console.error(error)
  }, [error])

  const handleRetry = () => {
    setIsRetrying(true)
    window.location.reload()
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">
        There was a problem loading the information.
      </h2>

      <p className="text-muted-foreground text-center max-w-md">
        Please try again. If the problem persists, contact the administrator.
      </p>

      <Button
        onClick={handleRetry}
        disabled={isRetrying}
        className="cursor-pointer"
      >
        {isRetrying ? "Retrying..." : "Try again"}
      </Button>
    </div>
  )
}