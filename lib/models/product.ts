import type { ObjectId } from "mongodb"

export interface Product {
  _id?: ObjectId
  title: string
  slug: string
  category: string
  tags: string[]
  shortDescription: string
  fullDescription: string // Markdown content
  coverImage: string
  galleryImages: string[]
  downloadableFiles: DownloadableFile[]
  externalLinks: ExternalLink[]
  secrets: ProductSecret[]
  isPaid: boolean
  version: string
  changelog: string
  createdAt: Date
  updatedAt: Date
  createdBy: ObjectId
  updatedBy: ObjectId
}

export interface DownloadableFile {
  name: string
  url: string
  size: number
  type: string
}

export interface ExternalLink {
  name: string
  url: string
  type: "preview" | "demo" | "documentation" | "other"
}

export interface ProductSecret {
  name: string
  value: string // This will be encrypted
  description?: string
}
