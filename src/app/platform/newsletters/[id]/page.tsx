import NewsletterDetail from "@/components/platform/newsletters/NewsletterDetail"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

type Params = Promise<{ id: string }>

// Simulación de obtención de datos
const getNewsletterById = (id: string) => {
  return {
    id,
    title: "May 2025 Newsletter",
    month: "2025-05-01T00:00:00.000Z",
    vocabularies: [
      { id: "v1", word: "Apple", pronunciation: "á-pol" },
      { id: "v2", word: "Blue", pronunciation: "blu" },
      { id: "v3", word: "Cat", pronunciation: "cat" },
      { id: "v4", word: "Dog", pronunciation: "dog" },
      { id: "v5", word: "Elephant", pronunciation: "é-le-fant" },
      { id: "v6", word: "Flower", pronunciation: "flá-uer" },
      { id: "v7", word: "Green", pronunciation: "grín" },
      { id: "v8", word: "House", pronunciation: "haus" },
    ],
    links: [
      { id: "l1", title: "Color Song", url: "https://youtube.com/color-song" },
      { id: "l2", title: "Alphabet Practice", url: "https://youtube.com/abc-practice" },
      { id: "l3", title: "Numbers 1-10", url: "https://youtube.com/numbers-1-10" },
      { id: "l4", title: "Animals Vocabulary", url: "https://youtube.com/animals-vocab" },
    ],
    forParents: [
      { id: "fp1", content: "Please practice the vocabulary at home with your child for 5 minutes each day." },
      { id: "fp2", content: "Bring crayons for Thursday's class. We will be doing a special art project." },
      { id: "fp3", content: "Remember to check the parent portal for updates on upcoming events." },
    ],
    playlistUrl: "https://youtube.com/playlist?list=may2025",
    pdfUrl: "https://example.com/newsletters/may-vocab.pdf",
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const newsletter = getNewsletterById(id)

  if (!newsletter) {
    return {
      title: "Newsletter Not Found",
    }
  }

  return {
    title: `${newsletter.title} | Ms. Kelly ESL Academy`,
    description: `Monthly newsletter with learning materials and important information for parents.`,
  }
}

export default async function NewsletterPage({ params }: { params: Params }) {
  const { id } = await params
  const newsletter = getNewsletterById(id)

  if (!newsletter) {
    notFound()
  }

  return <NewsletterDetail newsletter={newsletter} />
}
