import { SQSService } from "./sqs";

const execute = async (event) => {
  const sqsService = new SQSService();

  await sqsService.sentMessage("Hello from origen!");

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from origen!",
      input: event,
    }),
  };
};

export const main = execute;
