import origen from "@functions/origen";

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "origen",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      URL_SQS_DESTINO: { Ref: "SQSQueue" },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["sqs:SendMessage"],
            Resource: "arn:aws:sqs:*:*:*",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { origen },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "sqs-origen",
          MessageRetentionPeriod: 1209600,
          VisibilityTimeout: 30,
          RedrivePolicy: {
            deadLetterTargetArn: { "Fn::GetAtt": ["SQSQueueDLQ", "Arn"] },
            maxReceiveCount: 1,
          },
        },
      },
      SQSQueueDLQ: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "sqs-origen-dlq",
          MessageRetentionPeriod: 1209600,
          VisibilityTimeout: 30,
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
