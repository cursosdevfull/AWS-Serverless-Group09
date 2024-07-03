import type { AWS } from "@serverless/typescript";

type Definition = {
  Comment?: string;
  StartAt: string;
  States: {
    [state: string]: {
      Catch?: Catcher[];
      Type:
        | "Map"
        | "Task"
        | "Choice"
        | "Wait"
        | "Parallel"
        | "Succeed"
        | "Fail"
        | "Pass";
      Choices?: any[];
      Branches?: any[];
      Parameters?: any;
      End?: boolean;
      Next?: string;
      ItemsPath?: string;
      ResultPath?: string;
      Resource?: string | { "Fn::GetAtt": string[] };
      Iterator?: Definition;
    };
  };
};

type Catcher = {
  ErrorEquals: ErrorName[];
  Next: string;
  ResultPath?: string;
};

type ErrorName =
  | "States.ALL"
  | "States.Timeout"
  | "States.TaskFailed"
  | "States.Permissions"
  | "States.ResultPathMatchFailure"
  | "States.BranchFailed"
  | "States.NoChoiceMatched"
  | "States.Runtime"
  | "States.Custom"
  | "States.DataLimitExceeded"
  | "States.Runtime"
  | "States.Timeout"
  | string;

export interface ServerlessWithStepFunctions extends AWS {
  stepFunctions?: {
    stateMachines: {
      [stateMachine: string]: {
        name: string;
        definition: Definition;
      };
    };
    activities?: string[];
    validate?: boolean;
  };
}
