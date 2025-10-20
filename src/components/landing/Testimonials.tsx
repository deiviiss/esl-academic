"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRef } from "react"
import { titleFont } from "@/config/fonts"

const testimonials = [
  {
    text: "I have a 2-year-old and we have been using this method for teaching English. I cannot thank Miss Kelly enough for this technique and the support! We are halfway through our learning journey, and it blows my mind each day that my daughter can learn this way.",
    author: "Victoria P.",
    image: "/imgs/25.png",
  },
  {
    text: "The progress we've seen in our son's English skills is remarkable. Miss Kelly's method really works!",
    author: "John D.",
    image: "/imgs/26.png",
  },
  {
    text: "The interactive approach has made such a difference in how my daughter engages with English learning.",
    author: "Mario R.",
    image: "/imgs/27.png",
  },
]

export default function Testimonials() {
  const plugin = useRef(
    Autoplay({ delay: 3000 })
  )

  return (
    <section className="w-full pt-24 pb-12 md:py-24 lg:py-32 bg-secondary/10" id='testimonials'>
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
          </div>
        </motion.div>
        <div className="mx-auto max-w-5xl py-12">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <motion.div
                    className="flex flex-col items-center space-y-4 text-center px-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative w-20 h-20 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={`${testimonial.author}'s profile`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-lg md:text-xl text-muted-foreground italic">&quot;{testimonial.text}&quot;</p>
                    <p className="font-semibold text-primary">{testimonial.author}</p>
                  </motion.div>
                </CarouselItem>

              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  )
}

