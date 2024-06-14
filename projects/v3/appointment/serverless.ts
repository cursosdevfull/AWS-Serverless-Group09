import execute from "@functions/execute";

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "appointment",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    stage: "${opt:stage, 'dev'}",
    name: "aws",
    runtime: "nodejs20.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      URL_SQS_PE: "${ssm:/infrastructure/${self:provider.stage}/SQSPE/URL}",
      URL_SQS_CO: "${ssm:/infrastructure/${self:provider.stage}/SQSCO/URL}",
      URL_SQS_MX: "${ssm:/infrastructure/${self:provider.stage}/SQSMX/URL}",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["sqs:SendMessage"],
            Resource: "arn:aws:sqs:us-east-1:*:*",
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
};

module.exports = serverlessConfiguration;
