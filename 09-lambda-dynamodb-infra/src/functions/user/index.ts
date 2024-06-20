import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.insertOp`,
  events: [
    {
      http: {
        method: "post",
        path: "insert",
      },
    },
  ],
};
