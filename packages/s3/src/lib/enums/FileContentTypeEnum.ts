export const fileContentTypeEnum = {
  JSON: 'application/json',
} as const

export type FileContentTypeEnum = typeof fileContentTypeEnum[keyof typeof fileContentTypeEnum]
