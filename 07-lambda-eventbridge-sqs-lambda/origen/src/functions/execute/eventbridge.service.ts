import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsCommandInput,
} from "@aws-sdk/client-eventbridge";

const client = new EventBridgeClient({ region: "us-east-1" });

export class EventBridgeService {
  getInput(
    message: any,
    source: string,
    detailType: string,
    eventBusName: string
  ): PutEventsCommandInput {
    return {
      Entries: [
        {
          Source: source,
          DetailType: detailType,
          Detail: message,
          EventBusName: eventBusName,
        },
      ],
    };
  }

  getCommand(input: PutEventsCommandInput) {
    return new PutEventsCommand(input);
  }

  async put(
    message: any,
    source: string,
    detailType: string,
    eventBusName: string
  ) {
    const input = this.getInput(message, source, detailType, eventBusName);
    console.log("input", input);
    const command = this.getCommand(input);
    console.log("command", command);

    console.log("client", client);

    return await client.send(command);
  }
}
