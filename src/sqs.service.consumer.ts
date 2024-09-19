import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { error } from "console";
import { resolve } from "path";

@Injectable()
export class SqsConsumer {
    private sqsClient:SQSClient
    private queueUrl: string = `https://sqs.us-east-1.amazonaws.com/376129868845/my-queue-app`

    constructor (){
        this.sqsClient = new SQSClient({
            region: 'us-east-1',
        })
    }

    async onModuleInit() {
         this.startPolling();
    }

    async startPolling(){
        while (true){
            await this.receivedMessages()
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }

    async receivedMessages (){
        try {
            const command = new ReceiveMessageCommand({
                QueueUrl: this.queueUrl,
                MaxNumberOfMessages: 10,
                WaitTimeSeconds:20,
            })

            const response = await this.sqsClient.send(command);
            if(response.Messages) {
                for( const message of response.Messages){
                    const messageBody = JSON.parse( message.Body || "{}" );
                    await this.processMessage(messageBody);

                    const deleteCommand = new DeleteMessageCommand({
                        QueueUrl: this.queueUrl,
                        ReceiptHandle: message.ReceiptHandle
                    })
                    await this.sqsClient.send(deleteCommand)
                }
            }

        } catch( error) {
            console.log("error receiving message:", error)
        }
    } 

    async processMessage (messageBody: any){
        if(messageBody.action === "create"){
            console.log("vehicle created", messageBody.vehicle)
        } else if (messageBody.action === "find") {
            console.log("vehicle found", messageBody.vehicle)
        }
    }
}