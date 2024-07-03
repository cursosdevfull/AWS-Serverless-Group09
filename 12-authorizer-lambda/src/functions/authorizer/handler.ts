import { TokenService } from "@functions/services/token.service";

const authorizer = async (event) => {
  const { authorizationToken, methodArn } = event;

  // {headers: {"Authorization": "Bearer xxxxx"}}

  try {
    const payload: any = await TokenService.verifyToken(authorizationToken);

    return {
      principalId: payload.email,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: methodArn,
          },
        ],
      },
    };
  } catch (error) {
    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: methodArn,
          },
        ],
      },
    };
  }
};

export const main = authorizer;
