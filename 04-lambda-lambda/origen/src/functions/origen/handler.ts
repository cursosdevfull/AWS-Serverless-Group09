const origen = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "origen",
        input: event,
      },
      null,
      2
    ),
  };
};

export const main = origen;
