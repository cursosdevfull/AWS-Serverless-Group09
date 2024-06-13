import execute from "@functions/execute";

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
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "sns:Publish",
            Resource: "arn:aws:sns:*:*:*",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { execute },
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
          QueueName: "origen-queue",
        },
      },
      SNSTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "origen-topic",
          Subscription: [
            {
              Protocol: "sqs",
              Endpoint: {
                "Fn::GetAtt": ["SQSQueue", "Arn"],
              },
            },
          ],
        },
      },
      SQSQUEUEPOLICY: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [
            {
              Ref: "SQSQueue",
            },
          ],
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: "*",
                Action: "sqs:SendMessage",
                Resource: {
                  "Fn::GetAtt": ["SQSQueue", "Arn"],
                },
                Condition: {
                  ArnEquals: {
                    "aws:SourceArn": {
                      Ref: "SNSTopic",
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
