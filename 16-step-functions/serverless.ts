import step01 from "@functions/step01";
import step02 from "@functions/step02";
import step03 from "@functions/step03";
import step04 from "@functions/step04";
import trigger from "@functions/trigger";
import { ServerlessWithStepFunctions } from "@libs/slsStepFunctions";

//import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: ServerlessWithStepFunctions = {
  service: "sfm",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-step-functions"],
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
            Action: "sqs:SendMessage",
            Resource: "arn:aws:states:*:*:*",
          },
          {
            Effect: "Allow",
            Action: ["states:ListStateMachines", "states:StartExecution"],
            Resource: "arn:aws:states:*:*:*",
          },
          {
            Effect: "Allow",
            Action: "lambda:InvokeFunction",
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: [
              "logs:CreateLogGroup",
              "logs:CreateLogStream",
              "logs:PutLogEvents",
            ],
            Resource: "arn:aws:logs:*:*:*",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { trigger, step01, step02, step03, step04 },
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
  stepFunctions: {
    stateMachines: {
      myOwnStateMachine: {
        name: "StateMachineCurso09",
        definition: {
          StartAt: "Choice",
          States: {
            Choice: {
              Type: "Choice",
              Choices: [
                {
                  Variable: "$.numero",
                  NumericGreaterThanEquals: 500,
                  Next: "step02",
                },
                {
                  Variable: "$.numero",
                  NumericLessThan: 500,
                  Next: "Parallel",
                },
              ],
            },
            Parallel: {
              Type: "Parallel",
              Branches: [
                {
                  StartAt: "step01",
                  States: {
                    step01: {
                      Type: "Task",
                      Resource: { "Fn::GetAtt": ["step01", "Arn"] },
                      End: true,
                    },
                  },
                },
                {
                  StartAt: "step03",
                  States: {
                    step03: {
                      Type: "Task",
                      Resource: { "Fn::GetAtt": ["step03", "Arn"] },
                      End: true,
                    },
                  },
                },
              ],
              End: true,
            },
            step02: {
              Type: "Task",
              Resource: { "Fn::GetAtt": ["step02", "Arn"] },
              Next: "sqs",
            },
            sqs: {
              Type: "Task",
              Resource: "arn:aws:states:::sqs:sendMessage",
              Parameters: {
                QueueUrl: { Ref: "SQSQueueStateMachine" },
                "MessageBody.$": "$",
              },
              End: true,
            },
          },
        },
      },
    },
  },
  resources: {
    Resources: {
      SQSQueueStateMachine: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSQueueStateMachine",
        },
      },
    },
    Outputs: {
      SQSQueueStateMachineUrl: {
        Value: { Ref: "SQSQueueStateMachine" },
      },
    },
  },
};

module.exports = serverlessConfiguration;
