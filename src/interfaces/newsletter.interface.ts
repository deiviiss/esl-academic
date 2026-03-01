import { Level } from "./level.interface"

export interface NewsletterListItem {
  id: string
  title: string
  month: Date | string
  year: number
  levels: Level[]
  createdAt: Date | string
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

  vocabularies: VocabularyItem[]
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
  vocabularies: VocabularyItem[]
  videos: VideoItem[]
  playlist: PlaylistData | null
  forParents: ForParentsData[]
}
