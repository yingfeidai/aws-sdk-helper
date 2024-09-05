import * as AWS from 'aws-sdk'
import { S3 } from 'aws-sdk'
import { S3Object } from '../entities/S3Object'
import { IS3Service } from '../interfaces/IS3Service'
import {
  FileContent,
  FileExtension,
  FileMimeType,
  fileMimeTypeEnum,
  mimeTypeMap,
} from '../enums/FileTypeEnum'
import { FileContentTypeEnum } from '../enums/FileContentTypeEnum'

export class S3Service implements IS3Service {
  private s3: S3

  constructor() {
    this.s3 = new S3({
      accessKeyId: 'YOUR_ACCESS_KEY_ID',
      secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
      region: 'YOUR_REGION',
    })
  }

  async getAllObjects(bucketName: string): Promise<S3Object[]> {
    const objectList: S3Object[] = []
    let isTruncated = true
    let continuationToken: string | undefined

    while (isTruncated) {
      const params: AWS.S3.ListObjectsV2Request = {
        Bucket: bucketName,
        ...(continuationToken && { ContinuationToken: continuationToken }),
      }

      const listData = await this.s3.listObjectsV2(params).promise()

      if (listData.Contents) {
        objectList.push(...this.mapToS3Objects(listData.Contents))
      }

      if (listData.IsTruncated) {
        continuationToken = listData.NextContinuationToken
      } else {
        isTruncated = false
      }
    }

    return objectList
  }

  async getAllFileContents(
    bucketName: string,
    objects: S3Object[],
  ): Promise<{ successObjects: FileContent[]; failedObjects: S3Object[] }> {
    const successObjects: FileContent[] = []
    const failedObjects: S3Object[] = []

    await Promise.allSettled(
      objects.map(async (object) => {
        try {
          const content = await this.getFileContent(bucketName, object.key)
          successObjects.push({
            content: content,
            meta: {
              id: object.key || '',
              name: object.key || '',
              mimeType: object.mimeType || fileMimeTypeEnum.UNKNOWN,
            },
          })
        } catch (error) {
          console.error(
            `Error fetching file content for key ${object.key}:`,
            error,
          )
          failedObjects.push(object)
        }
      }),
    )

    return { successObjects, failedObjects }
  }

  async uploadFile(
    data: any,
    bucketName: string,
    fileName: string,
    contentType: FileContentTypeEnum,
  ): Promise<void> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: fileName,
      Body: data,
      ContentType: contentType,
    }

    try {
      await this.s3.upload(params).promise()
      console.log(`File uploaded successfully to ${bucketName}/${fileName}`)
    } catch (error) {
      console.error('Error uploading file to S3:', error)
      throw error
    }
  }

  private async getFileContent(
    bucketName: string,
    key?: string,
  ): Promise<string> {
    if (!key) {
      throw new Error('Key is required to fetch file content.')
    }

    const getObjectParams: AWS.S3.GetObjectRequest = {
      Bucket: bucketName,
      Key: key,
    }

    const data = await this.s3.getObject(getObjectParams).promise()

    if (!data.Body) {
      throw new Error('Failed to fetch file content: Empty response body.')
    }

    return data.Body.toString('utf-8')
  }

  private mapToS3Objects(dataList: AWS.S3.ObjectList): S3Object[] {
    return dataList.map((item) => this.mapToS3Object(item))
  }

  private mapToS3Object(data: AWS.S3.Object): S3Object {
    return {
      ...(data.Key && { key: data.Key }),
      ...(data.Size && { size: data.Size }),
      ...(data.LastModified && { lastModified: data.LastModified }),
      ...(data.Key && { mimeType: this.getMimeType(data.Key) }),
    }
  }

  private getMimeType(key: string): FileMimeType | undefined {
    const extension = key.split('.').pop()?.toLowerCase() as FileExtension

    return mimeTypeMap[extension]
  }
}
