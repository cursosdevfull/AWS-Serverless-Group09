import { EventBridgeService } from "./eventbridge.service";

const execute = async (event: any) => {
  const body = event.body;

  console.log("body", body);

  const service = new EventBridgeService();
  console.log("service", service);
  const response = await service.put(
    body,
    "appointment-medic",
    "appointment-scheduled",
    "origen-event-bus"
  );

  console.log(response);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "EventBridge event sent",
      ...JSON.parse(body),
    }),
  };
};

export const main = execute;
