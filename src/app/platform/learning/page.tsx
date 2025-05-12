import LearningVideos from "@/components/platform/learning/LearningVideos"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Learning Videos | Ms. Kelly ESL Academy",
  description: "Educational videos created by Ms. Kelly for different academic levels",
}

// Simulación de obtención de datos
const getLearningVideos = () => {
  // En una aplicación real, esto vendría de una API o base de datos
  return [
    {
      id: "vid_01",
      title: "Colors - April",
      level: "Nursery",
      month: "2024-04-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=180&width=320",
      description: "Vocabulary and pronunciation practice for colors.",
      type: "learning",
    },
    {
      id: "vid_02",
      title: "Numbers 1-10",
      level: "Toddlers",
      month: "2024-04-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=180&width=320",
      description: "Learning to count from 1 to 10 with fun activities.",
      type: "learning",
    },
    {
      id: "vid_03",
      title: "Animals - Farm",
      level: "PreK",
      month: "2024-04-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=180&width=320",
      description: "Learning about farm animals and their sounds.",
      type: "learning",
    },
    {
      id: "vid_04",
      title: "Shapes",
      level: "Nursery",
      month: "2024-03-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=180&width=320",
      description: "Identifying basic shapes and their names.",
      type: "learning",
    },
    {
      id: "vid_05",
      title: "Greetings",
      level: "Toddlers",
      month: "2024-03-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=180&width=320",
      description: "Learning basic greetings and introductions.",
      type: "learning",
    },
    {
      id: "vid_06",
      title: "Weather",
      level: "PreK",
      month: "2024-03-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=180&width=320",
      description: "Vocabulary about weather conditions and seasons.",
      type: "learning",
    },
    {
      id: "vid_07",
      title: "Family Members",
      level: "Nursery",
      month: "2024-02-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=180&width=320",
      description: "Learning vocabulary for family members.",
      type: "learning",
    },
    {
      id: "vid_08",
      title: "Body Parts",
      level: "Toddlers",
      month: "2024-02-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=180&width=320",
      description: "Identifying parts of the body with songs.",
      type: "learning",
    },
    {
      id: "vid_09",
      title: "Transportation",
      level: "PreK",
      month: "2024-02-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=180&width=320",
      description: "Learning about different modes of transportation.",
      type: "learning",
    },
  ]
}

export default function LearningVideosPage() {
  const videos = getLearningVideos()

  return <LearningVideos videos={videos} />
}
