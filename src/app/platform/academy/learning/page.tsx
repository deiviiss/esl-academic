import LearningVideos from "@/components/platform/learning/LearningVideos"
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
      level: "PreK",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208667/fruits_ro3evy.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_5,du_1/v1760208667/fruits_ro3evy.jpg",
      description: "Vocabulary and pronunciation practice for fruits.",
      type: "learning",
    },
    {
      id: "vid_02",
      title: "Letters Sounds",
      level: "PreK",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208664/letters_sound_oht6ga.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208664/letters_sound_oht6ga.jpg",
      description: "Learning phonetics and letter sounds.",
      type: "learning",
    },
    {
      id: "vid_03",
      title: "This is time",
      level: "PreK",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208666/this_is_time_acp795.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208666/this_is_time_acp795.jpg",
      description: "Learning about time and its relationship to the day.",
      type: "learning",
    },
    {
      id: "vid_04",
      title: "Sentences",
      level: "PreK",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208662/sentences_use_i_like_i_want_orpgfk.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208662/sentences_use_i_like_i_want_orpgfk.jpg",
      description: "Learning to use sentences I like, I don't like, I want and I don't want.",
      type: "learning",
    },
    {
      id: "vid_05",
      title: "Parts of the house",
      level: "PreK",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208660/parts_of_the_house_mtmva9.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208660/parts_of_the_house_mtmva9.jpg",
      description: "Learning about the parts of the house.",
      type: "learning",
    },
    {
      id: "vid_06",
      title: "My daily routine",
      level: "PreK",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208659/my_daily_routine_jpmusl.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208659/my_daily_routine_jpmusl.jpg",
      description: "Learning about my daily routine.",
      type: "learning",
    },
    {
      id: "vid_07",
      title: "Questions",
      level: "PreK",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208658/questions_zr2d0c.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208658/questions_zr2d0c.jpg",
      description: "Learning about questions.",
      type: "learning",
    },
    {
      id: "vid_08",
      title: "Sentences describing objects",
      level: "PreK",
      month: "2025-10-01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760208657/sentences_describing_objects_trzwqd.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_20,du_1/v1760208657/sentences_describing_objects_trzwqd.jpg",
      description: "Learning to describe objects with sentences.",
      type: "learning",
    },
  ]
}

export default function LearningVideosPage() {
  const videos = getLearningVideos()

  return <LearningVideos videos={videos} />
}
