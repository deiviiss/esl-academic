import Benefits from "@/components/landing/Benefits"
import AboutMissKelly from "@/components/landing/AboutMissKelly"
import Testimonials from "@/components/landing/Testimonials"
import CTA from "@/components/landing/CTA"
import Workshop from "@/components/landing/Workshop"
import LearningProcess from "@/components/landing/LearninProcess"
import Hero from "@/components/landing/Hero"

export default function LandingPage() {
  const heroVideoUrl = "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4"
  const imageUrl = "https://res.cloudinary.com/dhyds3mnm/image/upload/v1760185056/24_j42gma.jpg"

  return (
    <>
      <Hero videoUrl={heroVideoUrl} />
      <Benefits />
      <LearningProcess />
      <AboutMissKelly imageUrl={imageUrl} />
      <Testimonials />
      <CTA />
      <Workshop />
    </>
  )
}

