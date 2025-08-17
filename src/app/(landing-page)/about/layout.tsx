import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Miss Kelly ESL Academy",
  description: "Learn about our mission, principles, and the founder of Miss Kelly ESL Academy.",
}

export default async function AboutLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
    </>
  )
}