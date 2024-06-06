const execute = (event) => {
  console.log("event", event);
  return {
    statusCode: 200,
    body: "Message received!",
  };
};

export const main = execute;
