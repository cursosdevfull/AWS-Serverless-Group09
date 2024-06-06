import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "infrastructure",
  frameworkVersion: "3",
  provider: {
    name: "aws",
    stage: "${opt:stage, 'dev'}",
    runtime: "nodejs20.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  package: { individually: true },
  resources: {
    Resources: {
      SQSPE: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSPE-${self:provider.stage}",
        },
      },
      SSMSQSPEARN: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/infrastructure/${self:provider.stage}/SQSPE/ARN",
          Type: "String",
          Value: { "Fn::GetAtt": ["SQSPE", "Arn"] },
        },
      },
      SSMSQSPEURL: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/infrastructure/${self:provider.stage}/SQSPE/URL",
          Type: "String",
          Value: { Ref: "SQSPE" },
        },
      },

      SQSCO: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSCO-${self:provider.stage}",
        },
      },
      SSMSQSCOARN: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/infrastructure/${self:provider.stage}/SQSCO/ARN",
          Type: "String",
          Value: { "Fn::GetAtt": ["SQSCO", "Arn"] },
        },
      },
      SSMSQSCOURL: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/infrastructure/${self:provider.stage}/SQSCO/URL",
          Type: "String",
          Value: { Ref: "SQSCO" },
        },
      },

      SQSMX: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSMX-${self:provider.stage}",
        },
      },
      SSMSQSMXARN: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/infrastructure/${self:provider.stage}/SQSMX/ARN",
          Type: "String",
          Value: { "Fn::GetAtt": ["SQSMX", "Arn"] },
        },
      },
      SSMSQSMXURL: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/infrastructure/${self:provider.stage}/SQSMX/URL",
          Type: "String",
          Value: { Ref: "SQSMX" },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
