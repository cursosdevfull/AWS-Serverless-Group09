// arn:aws:states:us-east-1:282865065290:stateMachine:myOwnStateMachine
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { v4 as uuidv4 } from "uuid";

const client = new SFNClient();

const trigger = async (event) => {
  const number = event.queryStringParameters?.numero || 0;
  const input = {
    // StartExecutionInput
    stateMachineArn:
      "arn:aws:states:us-east-1:282865065290:stateMachine:StateMachineCurso09", // required
    name: uuidv4(),
    input: JSON.stringify({ numero: +number }),
  };
  const command = new StartExecutionCommand(input);
  const response = await client.send(command);
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};

export const main = trigger;
