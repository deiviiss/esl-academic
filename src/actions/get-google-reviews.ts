'use server'

import { unstable_cache } from 'next/cache'

interface GoogleReview {
  author_name: string
  profile_photo_url: string
  rating: number
  relative_time_description: string
  text: string
}

interface GooglePlaceDetails {
  rating: number
  user_ratings_total: number
  reviews: GoogleReview[]
}

interface ReviewsData {
  rating: number
  total: number
  reviews: Array<{
    author: string
    avatar: string
    rating: number
    date: string
    text: string
  }>
}

const getGoogleReviews = unstable_cache(
  async (): Promise<ReviewsData> => {
    const apiKey = process.env.GOOGLE_API_KEY
    const placeId = process.env.GOOGLE_PLACE_ID

    if (!apiKey || !placeId) {
      throw new Error('Missing Google API credentials')
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews(author_name,profile_photo_url,rating,relative_time_description,text)&key=${apiKey}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`)
    }

    const data: { result: GooglePlaceDetails; status: string } = await response.json()

    if (data.status !== 'OK') {
      throw new Error(`Google Places API status: ${data.status}`)
    }

    const reviews = data.result.reviews?.slice(0, 6).map(review => ({
      author: review.author_name,
      avatar: review.profile_photo_url,
      rating: review.rating,
      date: review.relative_time_description,
      text: review.text
    })) || []

    return {
      rating: data.result.rating,
      total: data.result.user_ratings_total,
      reviews
    }
  },
  ['google-reviews'],
  { revalidate: 3600 }
)

export default getGoogleReviews