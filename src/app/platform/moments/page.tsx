import ClassroomMoments from "@/components/platform/moments/ClassroomMoments"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Classroom Moments | Ms. Kelly ESL Academy",
  description: "Short videos captured during classes showing children's progress and activities",
}

// Simulación de obtención de datos
const getClassroomMoments = () => {
  // En una aplicación real, esto vendría de una API o base de datos
  return [
    {
      id: "class_01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=400&width=300",
      level: "PreK",
      date: "2024-04-15",
      caption: "Working on short sentences today! The children are making great progress with their speaking skills.",
      type: "moment",
    },
    {
      id: "class_02",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=400&width=300",
      level: "Nursery",
      date: "2024-04-12",
      caption: "Learning colors through a fun painting activity. Everyone enjoyed mixing colors!",
      type: "moment",
    },
    {
      id: "class_03",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=400&width=300",
      level: "Toddlers",
      date: "2024-04-10",
      caption: "Singing our morning greeting song. They're getting better every day!",
      type: "moment",
    },
    {
      id: "class_04",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=400&width=300",
      level: "PreK",
      date: "2024-04-08",
      caption: "Practicing counting with manipulatives. Everyone was engaged and having fun!",
      type: "moment",
    },
    {
      id: "class_05",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=400&width=300",
      level: "Nursery",
      date: "2024-04-05",
      caption: "Story time! The children loved acting out the characters from our book today.",
      type: "moment",
    },
    {
      id: "class_06",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=400&width=300",
      level: "Toddlers",
      date: "2024-04-03",
      caption: "Learning animal sounds and movements. So much fun pretending to be different animals!",
      type: "moment",
    },
    {
      id: "class_07",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=400&width=300",
      level: "PreK",
      date: "2024-03-30",
      caption: "Working on our spring art project. The children are so creative!",
      type: "moment",
    },
    {
      id: "class_08",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4",
      thumbnail: "/imgs/placeholder.jpg?height=400&width=300",
      level: "Nursery",
      date: "2024-03-28",
      caption: "Playing a matching game with vocabulary cards. They're remembering so many words!",
      type: "moment",
    },
  ]
}

export default function ClassroomMomentsPage() {
  const moments = getClassroomMoments()

  return <ClassroomMoments moments={moments} />
}
