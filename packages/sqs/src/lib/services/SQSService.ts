import * as AWS from 'aws-sdk'
import { SQS } from 'aws-sdk'
import { ISQSService } from '../interfaces/ISQSService'
import { PromiseResult } from 'aws-sdk/lib/request'

export class SQSService implements ISQSService {
  private sqs: AWS.SQS

  constructor() {
    this.sqs = new SQS({ region: process.env['AWS_REGION'] || '' })
  }

  sendMessage(
    queueUrl: string,
    message: string,
  ): Promise<PromiseResult<SQS.SendMessageResult, AWS.AWSError>> {
    // TODO: need use error code
    const params: SQS.SendMessageRequest = {
      MessageBody: message,
      QueueUrl: queueUrl,
    }

    return this.sqs.sendMessage(params).promise()
  }
}
