import Footer from "@/components/landing/Footer"
import Header from "@/components/landing/Header"

export default async function LandingLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>

  )
}