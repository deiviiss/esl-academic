import { Level } from "./level.interface"

export interface NewsletterListItem {
  id: string
  title: string
  month: Date | string
  year: number
  levels: Level[]
  createdAt: Date | string
}

export interface VocabularyImage {
  id: string
  imageUrl: string
  fileName: string
  order: number
}

export interface VocabularySet {
  id: string
  name: string
  images: VocabularyImage[]
}

export interface VideoItem {
  id: string
  title: string
  videoUrl: string
  fileName: string
  thumbnailUrl?: string | null
  order: number
}

export interface PlaylistLinkItem {
  id: string
  title: string | null
  url: string
}

export interface PlaylistData {
  id: string
  title: string | null
  links: PlaylistLinkItem[]
  url: string | null
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

  vocabularySets: VocabularySet[]
  videos: VideoItem[]
  playlist: PlaylistData | null;
  forParents: ForParentsData[];
}

export interface NewsletterData {
  id: string
  title: string
  month: Date | string
  year: number
  levels: Level[]
  vocabularySets: VocabularySet[]
  videos: VideoItem[]
  playlist: PlaylistData | null
  forParents: ForParentsData[]
}
