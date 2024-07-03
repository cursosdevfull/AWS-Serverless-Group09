import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "client",
        cors: true,
        authorizer: {
          type: "COGNITO_USER_POOLS",
          authorizerId: {
            Ref: "CognitoAuthorizer",
          },
        },
      },
    },
  ],
};
