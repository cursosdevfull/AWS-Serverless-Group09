const client = async (event) => {
  const clientes = [
    { id: 1, name: "Client1" },
    { id: 2, name: "Client2" },
    { id: 3, name: "Client3" },
  ];

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(clientes),
  };
};

export const main = client;
