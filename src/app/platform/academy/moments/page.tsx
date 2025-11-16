import ClassroomMoments from "@/components/platform/moments/ClassroomMoments"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Classroom Moments | Miss Kelly ESL Academy",
  description: "Short videos captured during classes showing children's progress and activities",
}

// Simulación de obtención de datos
const getClassroomMoments = () => {
  // En una aplicación real, esto vendría de una API o base de datos
  return [
    {
      id: "class_01",
      url: "https://res.cloudinary.com/dhyds3mnm/video/upload/v1760230934/moments_8_bildnn.mp4",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/video/upload/so_7,du_1/v1760230934/moments_8_bildnn.jpg",
      level: "PreK",
      date: "2025-10-10",
      caption: "Singing our morning greeting song. They're getting better every day!",
      type: "moment",
    },
    {
      id: "class_02",
      url: "https://res.cloudinary.com/dhyds3mnm/image/upload/v1760230925/moments_4_uxo0fm.jpg",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/image/upload/v1760230925/moments_4_uxo0fm.jpg",
      level: "PreK",
      date: "2024-10-01",
      caption: "Happy birthday to our little one! We're so proud of them.",
      type: "moment",
    },
    {
      id: "class_03",
      url: "https://res.cloudinary.com/dhyds3mnm/image/upload/v1760230931/moments_1_jomqyz.jpg",
      thumbnail: "https://res.cloudinary.com/dhyds3mnm/image/upload/v1760230931/moments_1_jomqyz.jpg",
      level: "PreK",
      date: "2024-10-01",
      caption: "Celebrating happy birthday with a cake and a cupcake. The children loved the cake!",
      type: "moment",
    },
  ]
}

export default function ClassroomMomentsPage() {
  const moments = getClassroomMoments()

  return <ClassroomMoments moments={moments} />
}
