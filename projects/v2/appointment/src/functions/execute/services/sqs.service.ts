import {
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from "@aws-sdk/client-sqs";

import { IPayload, SQSRepository } from "../repositories/sqs.repository";

export class SQSService implements SQSRepository {
  private client: SQSClient;

  constructor() {
    this.client = new SQSClient();
  }

  private getSendMessageCommandInput(
    queueUrl: string,
    payload: IPayload
  ): SendMessageCommandInput {
    return {
      MessageBody: JSON.stringify(payload),
      QueueUrl: queueUrl,
    };
  }

  private getSendMessageCommand(
    args: SendMessageCommandInput
  ): SendMessageCommand {
    return new SendMessageCommand(args);
  }

  async sentMessage(queueUrl: string, payload: IPayload): Promise<void> {
    const args: SendMessageCommandInput = this.getSendMessageCommandInput(
      queueUrl,
      payload
    );
    const command: SendMessageCommand = this.getSendMessageCommand(args);

    await this.client.send(command);
  }
}
