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
            Action: ["events:PutEvents"],
            Resource: "*",
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
      SQSClient: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "origen-queue-eventbridge",
        },
      },
      EventBusEB: {
        Type: "AWS::Events::EventBus",
        Properties: {
          Name: "origen-event-bus",
        },
      },
      EventRuleEB: {
        Type: "AWS::Events::Rule",
        Properties: {
          EventBusName: {
            "Fn::GetAtt": ["EventBusEB", "Name"],
          },
          EventPattern: {
            source: ["appointment-medic"],
            "detail-type": ["appointment-scheduled"],
          },
          Targets: [
            {
              Arn: {
                "Fn::GetAtt": ["SQSClient", "Arn"],
              },
              Id: "SQSClient",
            },
          ],
        },
      },
      EventBridgePermissions: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: "*",
                Action: "sqs:SendMessage",
                Resource: {
                  "Fn::GetAtt": ["SQSClient", "Arn"],
                },
                Condition: {
                  ArnEquals: {
                    "aws:SourceArn": {
                      "Fn::GetAtt": ["EventRuleEB", "Arn"],
                    },
                  },
                },
              },
            ],
          },
          Queues: [
            {
              Ref: "SQSClient",
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
