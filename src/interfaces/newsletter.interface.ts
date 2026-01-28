export interface NewsletterListItem {
  id: string
  title: string
  month: Date | string
  year: number
}

export interface VocabularyItem {
  id: string
  word: string
  pronunciation: string
  imageUrl: string
}

export interface VideoItem {
  id: string
  title: string
  videoUrl: string
  thumbnailUrl?: string | null
}

export interface PlaylistLinkItem {
  id: string
  title?: string
  url: string
}

export interface PlaylistData {
  id: string
  title?: string
  links: PlaylistLinkItem[]
  url?: string
}

export interface ForParentsData {
  id: string
  message: string
  documentUrl?: string | null
}

export interface NewsletterDetailData {
  id: string
  title: string
  month: Date | string
  year: number

  vocabularies: VocabularyItem[]
  videos: VideoItem[]
  playlist?: PlaylistData;
  forParents: ForParentsData[];
}

interface Newsletter {
  id: string
  title: string
  month: Date | string
  year: number;
  forParents: ForParentsData[];
  vocabularies: { id: string; word: string; pronunciation: string; imageUrl: string }[]
  videos: { id: string; title: string; videoUrl: string; thumbnailUrl?: string | null }[]
  playlist?: {
    id: string
    title?: string | null
    links: { id: string; title?: string | null; url: string }[]
  } | null
}