const execute = async (event) => {
  if (event.Records) {
    event.Records.forEach((record) => {
      const body = JSON.parse(record.body);
      console.log("body", body);
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from execute!",
      event,
    }),
  };
};

export const main = execute;
