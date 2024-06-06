import { SendMessageCommand, SendMessageCommandInput, SQSClient } from '@aws-sdk/client-sqs';

const client = new SQSClient({ region: "us-east-1" });

export class SQSService {
  queueUrl: string = process.env.URL_SQS_DESTINO;

  async sentMessage(message: string) {
    const input: SendMessageCommandInput = {
      MessageBody: message,
      QueueUrl: this.queueUrl,
    };

    const command = new SendMessageCommand(input);

    await client.send(command);
  }
}
