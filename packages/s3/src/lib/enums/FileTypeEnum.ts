import { FileMeta } from '../entities/FileMeta'

export type FileExtension = 'csv' | 'jpg' | 'jpeg' | 'png' | 'unknown'

export const fileMimeTypeEnum = {
  CSV: 'text/csv',
  JPG: 'image/jpeg',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  UNKNOWN: 'application/octet-stream',
} as const

export type FileMimeType = typeof fileMimeTypeEnum[keyof typeof fileMimeTypeEnum]

export const mimeTypeMap: Record<FileExtension, FileMimeType> = {
  csv: fileMimeTypeEnum.CSV,
  jpg: fileMimeTypeEnum.JPG,
  jpeg: fileMimeTypeEnum.JPEG,
  png: fileMimeTypeEnum.PNG,
  unknown: fileMimeTypeEnum.UNKNOWN,
} as const
export type MimeTypeMap = typeof mimeTypeMap[keyof typeof mimeTypeMap]

export type FileContent = { content: string; meta: FileMeta }
