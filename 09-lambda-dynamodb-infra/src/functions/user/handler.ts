import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

const insert = async (event) => {
  const inputPedido = {
    TableName: "Pedido", // required
    Item: {
      email: {
        S: "usuario01@email.com",
      },
      orderNumber: {
        N: "1",
      },
      products: {
        L: [
          {
            S: "product01",
          },
          {
            S: "product02",
          },
        ],
      },
      total: {
        N: "100.00",
      },
    },
  };
  const commandPedido = new PutItemCommand(inputPedido);
  await client.send(commandPedido);

  const input = {
    TableName: "Usuario", // required
    Item: {
      email: {
        S: "usuario01@email.com",
      },
      name: {
        S: "Usuario 01",
      },
      lastname: {
        S: "Apellido 01",
      },
      age: {
        N: "25",
      },
    },
  };
  const command = new PutItemCommand(input);
  const response = await client.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "insert",
    }),
  };
};

const list = async (event) => {
  const input = {
    // ScanInput
    TableName: "Usuario", // required

    FilterExpression: "lastname = :username",
    ExpressionAttributeNames: {
      // ExpressionAttributeNameMap
      "#nombre": "name",
      "#apellido": "lastname",
    },
    ExpressionAttributeValues: {
      ":username": {
        S: "Apellido 01",
      },
    },
    ProjectionExpression: "#nombre, #apellido",
  };
  const command = new ScanCommand(input);
  const response = await client.send(command);

  const inputQuery: QueryCommandInput = {
    TableName: "Pedido",
    IndexName: "order-email",
    ExpressionAttributeValues: {
      ":v1": {
        N: "1",
      },
    },
    KeyConditionExpression: "orderNumber = :v1",
  };

  const query = new QueryCommand(inputQuery);
  const responseQuery = await client.send(query);

  const responseSummary = {
    usuarios: response.Items,
    pedidos: responseQuery.Items,
  };

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: JSON.stringify(responseSummary),
    }),
  };
};

export const insertOp = insert;
export const listOp = list;
