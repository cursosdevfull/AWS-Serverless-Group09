module.exports.task = async (event) => {
  const users = [{ name: "John Doe" }, { name: "Jane Doe" }];

  return {
    statusCode: 200,
    body: JSON.stringify(users),
  };
};
