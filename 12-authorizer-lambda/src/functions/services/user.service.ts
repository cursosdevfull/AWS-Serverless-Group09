import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { UserRepository } from '@functions/repositories/user.repository';

const client = new DynamoDBClient();

export class UserService implements UserRepository {
  async createUser(
    email: string,
    password: string,
    name: string
  ): Promise<any> {
    const params: PutItemCommandInput = {
      TableName: "user",
      Item: {
        email: { S: email },
        password: { S: password },
        name: { S: name },
        createdAt: { S: new Date().toISOString() },
      },
    };

    const command = new PutItemCommand(params);
    return await client.send(command);
  }
  async getUserByEmail(email: string): Promise<any[]> {
    const params: QueryCommandInput = {
      TableName: "user",
      ExpressionAttributeValues: {
        ":v1": {
          S: email,
        },
      },
      KeyConditionExpression: "email = :v1",
    };

    const command = new QueryCommand(params);
    const response: any = await client.send(command);

    return response.Items;
  }
}
