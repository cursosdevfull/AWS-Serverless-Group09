import { InvocationType, InvokeCommand, InvokeCommandInput, LambdaClient } from '@aws-sdk/client-lambda';

import { IPayload, LambdaRepository } from '../repositories/lambda.repository';

export class LambdaService implements LambdaRepository {
  private client: LambdaClient;

  constructor() {
    this.client = new LambdaClient();
  }

  private getInvokeCommandInput(
    functionName: string,
    payload: IPayload,
    invocationType: InvocationType
  ): InvokeCommandInput {
    return {
      FunctionName: functionName,
      InvocationType: invocationType,
      Payload: JSON.stringify(payload),
    };
  }

  private getInvokeCommand(args: InvokeCommandInput): InvokeCommand {
    return new InvokeCommand(args);
  }

  async invoke(
    functionName: string,
    payload: IPayload,
    invocationType: InvocationType
  ): Promise<void> {
    const args: InvokeCommandInput = this.getInvokeCommandInput(
      functionName,
      payload,
      invocationType
    );
    const command: InvokeCommand = this.getInvokeCommand(args);

    await this.client.send(command);
  }
}
