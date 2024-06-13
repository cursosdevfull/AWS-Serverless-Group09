const execute = async (event) => {
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello!",
      input: event,
    }),
  };
};

export const main = execute;
