import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "prueba",
        /* request: {
          schemas: {
            'application/json': schema,
          },
        }, */
      },
    },
  ],
};
