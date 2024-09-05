import { PromiseResult } from 'aws-sdk/lib/request'
import { SQS } from 'aws-sdk'
export interface ISQSService {
  sendMessage(
    queueUrl: string,
    message: string,
  ): Promise<PromiseResult<SQS.SendMessageResult, AWS.AWSError>>
}
