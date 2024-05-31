import { IPayload } from './repositories/lambda.repository';
import { LambdaService } from './services/lambda.service';

const origen = async (event) => {
  const service: LambdaService = new LambdaService();
  const { action, name, url, functionName } = JSON.parse(event.body);

  const payload: IPayload = {
    action: action,
    data: {
      name: name,
      url: url,
    },
  };

  try {
    await service.invoke(functionName, payload, "RequestResponse");
    return {
      statusCode: 200,
      body: "Message send!",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export const main = origen;
