import destino from "@functions/destino";

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "destino",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
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
            Action: ["sqs:*"],
            Effect: "Allow",
            Resource: ["arn:aws:sqs:*.*.*"],
          },
          {
            Action: ["lambda:*"],
            Effect: "Allow",
            Resource: "arn:aws:lambda:*:*:*",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { destino },
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
};

module.exports = serverlessConfiguration;
