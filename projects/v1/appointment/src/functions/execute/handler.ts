import { InvocationType } from '@aws-sdk/client-lambda';

import { IData, IPayload, TCountry } from './repositories/lambda.repository';
import { LambdaService } from './services/lambda.service';

const functions: Record<TCountry, string> = {
  PE: "appointment-pe-dev-execute",
  CO: "appointment-co-dev-execute",
  MX: "appointment-mx-dev-execute",
};

const getData = (body: string): IData => {
  const data: IData = JSON.parse(body);

  return data;
};

const getPayload = (data: IData): IPayload => {
  const country = data.country;
  const patient = data.patient;
  const centerId = data.center.id;
  const date = data.dateHour.date;
  const hour = data.dateHour.hour;

  return {
    action: "SCHEDULE",
    data: {
      country,
      patient,
      center: {
        id: centerId,
      },
      dateHour: {
        date,
        hour,
      },
    },
  };
};

const getFunctionName = (data: IData): string => {
  const country = data.country;
  return functions[country];
};

const execute = async (event) => {
  const service = new LambdaService();

  const data = getData(event.body);
  const functionName = getFunctionName(data);
  const payload: IPayload = getPayload(data);
  const invocationType: InvocationType = "RequestResponse";

  try {
    await service.invoke(functionName, payload, invocationType);
    return {
      statusCode: 200,
      body: "Message send!",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export const main = execute;
