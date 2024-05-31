import { InvocationType } from '@aws-sdk/client-lambda';

export type TAction = "SCHEDULE" | "CANCEL";
export interface IData {
  name: string;
  url: string;
}

export interface IPayload {
  action: TAction;
  data: IData;
}

export interface LambdaRepository {
  invoke(
    functionName: string,
    payload: IPayload,
    invocationType: InvocationType
  ): Promise<void>;
}
