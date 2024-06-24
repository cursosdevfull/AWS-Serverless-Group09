const destino = async (event) => {
  const response = { batchItemFailures: [] };

  const promises = event.Records.map(async (record) => {
    console.log("record.body", record.body);
    const body = JSON.parse(record.body);
    const { name, url } = body;
    console.log("name", name);
    console.log("url", url);

    if (name === "fail") {
      return Promise.resolve({
        status: false,
        id: record.messageId,
        name,
        url,
      });
    }

    return Promise.resolve({ status: true, id: record.messageId, name, url });
  });

  const settledPromises = await Promise.all(promises);

  settledPromises.forEach((promise) => {
    if (!promise.status) {
      response.batchItemFailures.push({ id: promise.id });
    }
  });

  console.log("response", response);

  return response;
};

export const main = destino;
