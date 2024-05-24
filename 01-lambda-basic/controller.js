module.exports.task = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Function has been executed",
        event: JSON.stringify(event),
      },
      null,
      2
    ),
  };
};
