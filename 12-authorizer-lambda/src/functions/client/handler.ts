const client = async (event) => {
  console.log("client event", event);

  return {
    statusCode: 200,
    body: "Request authenticated"
  }
};

export const main = client;
