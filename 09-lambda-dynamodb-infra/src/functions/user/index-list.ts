import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.listOp`,
  events: [
    {
      http: {
        method: "get",
        path: "list",
      },
    },
  ],
};
