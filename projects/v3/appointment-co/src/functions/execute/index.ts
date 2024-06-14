import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [{ sqs: "${ssm:/infrastructure/${self:provider.stage}/SQSCO/ARN}" }],
};
