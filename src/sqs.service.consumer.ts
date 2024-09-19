import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class SqsConsumer implements OnModuleInit {
  private sqsClient: SQSClient;
  private queueUrl: string = 'https://sqs.us-east-1.amazonaws.com/376129868845/my-queue-app';

  constructor() {
    this.sqsClient = new SQSClient({
      region: 'us-east-1',
    });
  }

  async onModuleInit() {
    console.log('SqsConsumer service is initializing...');
    this.startPolling();
  }

  async startPolling() {
    console.log('Starting to poll messages from SQS...');
    while (true) {
      await this.receiveMessages();
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  async receiveMessages() {
    try {
      console.log('Receiving messages...');
      const command = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
      });

      const response = await this.sqsClient.send(command);

      if (response.Messages) {
        console.log(`Received ${response.Messages.length} messages.`);
        for (const message of response.Messages) {
          console.log('Processing message:', message.Body);
          const messageBody = JSON.parse(message.Body || '{}');
          await this.processMessage(messageBody);

          const deleteCommand = new DeleteMessageCommand({
            QueueUrl: this.queueUrl,
            ReceiptHandle: message.ReceiptHandle,
          });
          await this.sqsClient.send(deleteCommand);
          console.log('Deleted message:', message.ReceiptHandle);
        }
      } else {
        console.log('No messages to process.');
      }
    } catch (error) {
      console.error('Error receiving messages:', error);
    }
  }

  async processMessage(messageBody: any) {
    if (messageBody.action === 'create') {
      console.log('Vehicle created:', messageBody.vehicle);

    } else if (messageBody.action === 'find') {
      console.log('Vehicle found:', messageBody.vehicle);

    } else {
      console.warn('Unknown action:', messageBody.action);
    }
  }
}
