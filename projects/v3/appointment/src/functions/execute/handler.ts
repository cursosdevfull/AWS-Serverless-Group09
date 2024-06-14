import { IData, IPayload, TCountry } from "./repositories/sqs.repository";
import { SQSService } from "./services/sqs.service";

const queueUrls: Record<TCountry, string> = {
  PE: process.env.URL_SQS_PE,
  CO: process.env.URL_SQS_CO,
  MX: process.env.URL_SQS_MX,
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

const getQueueUrl = (data: IData): string => {
  const country = data.country;
  return queueUrls[country];
};

const execute = async (event) => {
  const service = new SQSService();

  const data = getData(event.body);
  const queueUrl = getQueueUrl(data);
  const payload: IPayload = getPayload(data);

  try {
    await service.sentMessage(queueUrl, payload);
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
