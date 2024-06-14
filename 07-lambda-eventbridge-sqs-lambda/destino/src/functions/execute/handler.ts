const execute = (event: any) => {
  console.log("event", event);

  return { statusCode: 200, body: JSON.stringify(event) };
};

export const main = execute;
