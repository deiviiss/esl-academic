import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Ms. Kelly ESL Academy",
  description: "Learn about our mission, principles, and the founder of Ms. Kelly ESL Academy.",
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