import insertOp from "@functions/user";
import listOp from "@functions/user/index-list";

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "compras",
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
            Action: ["dynamodb:PutItem", "dynamodb:Scan", "dynamodb:Query"],
            Resource: "*",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { insertOp, listOp },
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
      UserTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
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
            ReadCapacityUnits: "5",
            WriteCapacityUnits: "5",
          },
          TableName: "Usuario",
        },
      },

      OrderTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            {
              AttributeName: "email",
              AttributeType: "S",
            },
            {
              AttributeName: "orderNumber",
              AttributeType: "N",
            },
          ],
          KeySchema: [
            {
              AttributeName: "email",
              KeyType: "HASH",
            },
            {
              AttributeName: "orderNumber",
              KeyType: "RANGE",
            },
          ],
          TableName: "Pedido",
          GlobalSecondaryIndexes: [
            {
              IndexName: "order-email",
              KeySchema: [
                {
                  AttributeName: "orderNumber",
                  KeyType: "HASH",
                },
                {
                  AttributeName: "email",
                  KeyType: "RANGE",
                },
              ],
              Projection: {
                ProjectionType: "ALL",
              },
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
