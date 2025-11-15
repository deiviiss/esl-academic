
import AboutMissKelly from "@/components/landing/AboutMissKelly"
import WhyChooseUs from "@/components/landing/WhyChooseUs"
import GoogleReviews from "@/components/landing/GoogleReviews"
import CTA from "@/components/landing/CTA"
import Workshop from "@/components/landing/Workshop"
import LearningProcess from "@/components/landing/LearningProcess"
import Hero from "@/components/landing/Hero"
import WhyParentsLove from "@/components/landing/WhyParentsLove"
import WhatChildLearns from "@/components/landing/WhatWillYourChildLearn"
import Services from "@/components/landing/Services"

export default function LandingPage() {
  const heroVideoUrl = "https://res.cloudinary.com/dhyds3mnm/video/upload/v1740683423/Video_ESL_sdvzls.mp4"
  const imageUrl = "https://res.cloudinary.com/dhyds3mnm/image/upload/v1760185056/24_j42gma.jpg"

  return (
    <>
      <Hero videoUrl={heroVideoUrl} />
      <WhyChooseUs />
      <LearningProcess />
      <WhyParentsLove />
      <WhatChildLearns />
      <AboutMissKelly imageUrl={imageUrl} />
      <Services />
      <GoogleReviews />
      <CTA />
      <Workshop />
    </>
  )
}

