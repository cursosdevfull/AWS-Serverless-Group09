import authorizer from "@functions/authorizer";
import client from "@functions/client";
import login from "@functions/login";
import register from "@functions/register";

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "authorizer-lambda",
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
      JWT_SECRET: "ElGiganteRosa",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["dynamodb:*"],
            Resource: "*",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { register, login, client, authorizer },
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
      DynamoDBTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "user",
          AttributeDefinitions: [
            {
              AttributeName: "email",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "email",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
