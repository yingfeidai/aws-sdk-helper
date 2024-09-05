import { FileMimeType } from '../enums/FileTypeEnum'

export type S3Object = {
  key?: string
  size?: number
  lastModified?: Date
  mimeType?: FileMimeType | undefined
}
