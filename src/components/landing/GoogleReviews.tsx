"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { titleFont } from "@/config/fonts"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import getGoogleReviews from "@/actions/get-google-reviews"

interface Review {
  author: string
  avatar: string
  rating: number
  date: string
  text: string
}

interface ReviewsData {
  rating: number
  total: number
  reviews: Review[]
}

interface StarRatingProps {
  rating: number
}

function StarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
            }`}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const maxLength = 150
  const shouldTruncate = review.text.length > maxLength

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={review.avatar} alt={review.author} />
              <AvatarFallback>
                {review.author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-primary">{review.author}</h4>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-muted-foreground">{review.date}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {shouldTruncate && !isExpanded
                  ? `${review.text.substring(0, maxLength)}...`
                  : review.text}
                {shouldTruncate && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-2 text-primary hover:underline text-sm font-medium"
                  >
                    {isExpanded ? "ver menos" : "ver más"}
                  </button>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ReviewSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-16" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function GoogleReviews() {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getGoogleReviews()
        console.log('data', data)
        setReviewsData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  if (error) {
    return (
      <section className="w-full py-20 md:py-24 lg:py-32 bg-secondary/10">
        <div className="container px-4 md:px-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              We couldn&apos;t load the reviews at this time.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-20 md:py-24 lg:py-32 bg-secondary/10">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h2 className={`${titleFont.className} text-3xl font-bold tracking-tighter sm:text-5xl text-primary`}>
              These parents did it, and so can you
            </h2>
            {reviewsData && (
              <p className="text-muted-foreground md:text-base">
                {reviewsData.rating.toFixed(1)} stars based on {reviewsData.total} reviews
              </p>
            )}
          </div>
        </motion.div>

        <div className="grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
              <ReviewSkeleton key={index} />
            ))
            : reviewsData?.reviews.slice(0, 6).map((review, index) => (
              <ReviewCard key={index} review={review} index={index} />
            ))
          }
        </div>
      </div>
    </section>
  )
}