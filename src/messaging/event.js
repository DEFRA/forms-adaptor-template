import {
  DeleteMessageCommand,
  ReceiveMessageCommand
} from '@aws-sdk/client-sqs'

import { config } from '../config.js'
import { sqsClient } from './sqs.js'

export const receiveMessageTimeout = config.get('receiveMessageTimeout')
const queueUrl = config.get('sqsEventsQueueUrl')
const maxNumberOfMessages = config.get('maxNumberOfMessages')
const visibilityTimeout = config.get('visibilityTimeout')

/**
 * @typedef {import('@aws-sdk/client-sqs').ReceiveMessageCommandInput} ReceiveMessageCommandInput
 * @typedef {import('@aws-sdk/client-sqs').ReceiveMessageResult} ReceiveMessageResult
 * @typedef {import('@aws-sdk/client-sqs').DeleteMessageCommandOutput} DeleteMessageCommandOutput
 * @typedef {import('@aws-sdk/client-sqs').Message} Message
 */

/**
 * @type {ReceiveMessageCommandInput}
 */
const input = {
  QueueUrl: queueUrl,
  MaxNumberOfMessages: maxNumberOfMessages,
  VisibilityTimeout: visibilityTimeout
}

/**
 * Receive event messages
 * @returns {Promise<ReceiveMessageResult>}
 */
export function receiveEventMessages() {
  const command = new ReceiveMessageCommand(input)
  return sqsClient.send(command)
}

/**
 * Delete event message
 * @param {Message} message
 * @returns {Promise<DeleteMessageCommandOutput>}
 */
export function deleteEventMessage(message) {
  const command = new DeleteMessageCommand({
    QueueUrl: queueUrl,
    ReceiptHandle: message.ReceiptHandle
  })

  return sqsClient.send(command)
}
