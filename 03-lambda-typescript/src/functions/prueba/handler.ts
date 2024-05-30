const principal = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hola mundo",
    }),
  };
};

export const main = principal;
