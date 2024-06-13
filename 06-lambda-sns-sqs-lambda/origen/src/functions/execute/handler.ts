import {
  PublishCommand,
  PublishCommandInput,
  SNSClient,
} from "@aws-sdk/client-sns";

const client = new SNSClient({ region: "us-east-1" });

const execute = async (event) => {
  const body = event.body;

  const params: PublishCommandInput = {
    TopicArn: "arn:aws:sns:us-east-1:282865065290:origen-topic",
    Message: body,
  };

  const command = new PublishCommand(params);
  await client.send(command);

  return { statusCode: 200, body: "Hola" };
};

export const main = execute;
