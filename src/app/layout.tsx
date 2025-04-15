import type { Metadata } from "next";
import "./globals.css";
import { textFont } from "@/config/fonts";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Ms. Kelly ESL Academy - Learn English Naturally",
  description:
    "Join Ms. Kelly ESL Academy to learn English through engaging lessons and a supportive environment. Perfect for young learners looking to become confident English speakers.",
  keywords: ["ESL", "English learning", "children education", "language skills"],
  openGraph: {
    title: "Ms. Kelly ESL Academy - Learn English Naturally",
    description:
      "Inspire young learners to become confident English speakers through engaging lessons and a supportive environment.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ms. Kelly ESL Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ms. Kelly ESL Academy - Learn English Naturally",
    description:
      "Inspire young learners to become confident English speakers through engaging lessons and a supportive environment.",
    images: ["/twitter-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${textFont.className} antialiased`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html >
  );
}
