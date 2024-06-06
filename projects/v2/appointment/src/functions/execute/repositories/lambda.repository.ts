import { InvocationType } from '@aws-sdk/client-lambda';

export type TAction = "SCHEDULE" | "CANCEL";
export type TCountry = "PE" | "CO" | "MX";
export interface IData {
  country: TCountry;
  patient: {
    name: string;
    lastname: string;
  };
  center: {
    id: number;
  };
  dateHour: {
    date: string;
    hour: string;
  };
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
