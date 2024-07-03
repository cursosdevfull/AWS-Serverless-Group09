const hello = (event: any) => {
  console.log(event);
  return {
    statusCode: 200,
    body: "Todo ok",
  };
};

export const main = hello;
