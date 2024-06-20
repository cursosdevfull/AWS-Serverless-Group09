import {
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from "@aws-sdk/client-sqs";

const client = new SQSClient({ region: "us-east-1" });

const origen = async (event) => {
  const body = JSON.parse(event.body);
  const { name, url } = body;

  const input: SendMessageCommandInput = {
    MessageBody: JSON.stringify({ name, url }),
    QueueUrl: process.env.URL_SQS_DESTINO,
  };

  const command = new SendMessageCommand(input);
  await client.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, welcome to the exciting Serverless world!`,
    }),
  };
};

export const main = origen;
