import LearningVideos from "@/components/platform/learning/LearningVideos"
import { getUserSessionServer } from "@/actions/auth/getUserSessionServer"
import { userHasAcademy } from "@/lib/access"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Learning Videos | Miss Kelly ESL Academy",
  description: "Educational videos created by Miss Kelly for different academic levels",
}

// Simulación de obtención de datos
const getLearningVideos = () => {
  // En una aplicación real, esto vendría de una API o base de datos
  return [
    {
      id: "vid_01",
      title: "Fruits",
      level: "prek",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208667/fruits_ro3evy.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_5,du_1/v1760208667/fruits_ro3evy.jpg",
      description: "Vocabulary and pronunciation practice for fruits.",
      type: "learning",
    },
    {
      id: "vid_02",
      title: "Letters Sounds",
      level: "prek",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208664/letters_sound_oht6ga.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208664/letters_sound_oht6ga.jpg",
      description: "Learning phonetics and letter sounds.",
      type: "learning",
    },
    {
      id: "vid_03",
      title: "This is time",
      level: "prek",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208666/this_is_time_acp795.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208666/this_is_time_acp795.jpg",
      description: "Learning about time and its relationship to the day.",
      type: "learning",
    },
    {
      id: "vid_04",
      title: "Sentences",
      level: "prek",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208662/sentences_use_i_like_i_want_orpgfk.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208662/sentences_use_i_like_i_want_orpgfk.jpg",
      description: "Learning to use sentences I like, I don't like, I want and I don't want.",
      type: "learning",
    },
    {
      id: "vid_05",
      title: "Parts of the house",
      level: "prek",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208660/parts_of_the_house_mtmva9.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208660/parts_of_the_house_mtmva9.jpg",
      description: "Learning about the parts of the house.",
      type: "learning",
    },
    {
      id: "vid_06",
      title: "My daily routine",
      level: "prek",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208659/my_daily_routine_jpmusl.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208659/my_daily_routine_jpmusl.jpg",
      description: "Learning about my daily routine.",
      type: "learning",
    },
    {
      id: "vid_07",
      title: "Questions",
      level: "prek",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208658/questions_zr2d0c.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208658/questions_zr2d0c.jpg",
      description: "Learning about questions.",
      type: "learning",
    },
    {
      id: "vid_08",
      title: "Sentences describing objects",
      level: "prek",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208657/sentences_describing_objects_trzwqd.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208657/sentences_describing_objects_trzwqd.jpg",
      description: "Learning to describe objects with sentences.",
      type: "learning",
    },

    {
      id: "vid_09",
      title: "My daily routine",
      level: "nursery",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208659/my_daily_routine_jpmusl.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208659/my_daily_routine_jpmusl.jpg",
      description: "Learning about my daily routine.",
      type: "learning",
    },
    {
      id: "vid_10",
      title: "Questions",
      level: "nursery",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208658/questions_zr2d0c.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208658/questions_zr2d0c.jpg",
      description: "Learning about questions.",
      type: "learning",
    },
    {
      id: "vid_11",
      title: "Sentences describing objects",
      level: "nursery",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208657/sentences_describing_objects_trzwqd.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208657/sentences_describing_objects_trzwqd.jpg",
      description: "Learning to describe objects with sentences.",
      type: "learning",
    },
  ]
}

export default async function LearningVideosPage() {
  const session = await getUserSessionServer()
  if (!session) redirect("/")

  const userId = session.id
  const isAdmin = session.role === "admin"

  const hasAcademy = await userHasAcademy(userId)
  if (!hasAcademy && !isAdmin) redirect("/no-access")

  const allowedLevels = isAdmin ? ["toddlers", "nursery", "prek"] : ((session).level ? [(session).level] : [])

  const allVideos = getLearningVideos()

  return <LearningVideos videos={allVideos} allowedLevels={allowedLevels} isAdmin={isAdmin} />
}
