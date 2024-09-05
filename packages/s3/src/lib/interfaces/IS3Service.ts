import { S3Object } from '../entities/S3Object'
import { FileContentTypeEnum } from '../enums/FileContentTypeEnum'
import { FileContent } from '../enums/FileTypeEnum'

export interface IS3Service {
  uploadFile(
    data: any,
    bucketName: string,
    fileName: string,
    contentType: FileContentTypeEnum,
  ): Promise<void>
  getAllFileContents(
    bucketName: string,
    objects: S3Object[],
  ): Promise<{ successObjects: FileContent[]; failedObjects: S3Object[] }>
  getAllObjects(bucketName: string): Promise<S3Object[]>
}
