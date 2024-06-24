import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client();

const execute = async (event) => {
  console.log("event", JSON.stringify(event));
  const record = event.Records[0];

  const s3 = record.s3;
  const Bucket = s3.bucket.name;
  const Key = s3.object.key;

  const input = { Bucket, Key };

  const command = new GetObjectCommand(input);
  const response = await client.send(command);

  const body = response.Body.toString("utf-8");
  console.log("body", body);

  console.log("response", response);

  return {
    statusCode: 200,
    body: JSON.stringify("Hello from S3!"),
  };
};

export const main = execute;
