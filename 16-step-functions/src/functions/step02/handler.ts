const step02 = async (event) => {
  console.log("step02!");
  const appointment = {
    ticketNumber: event.numero,
    patientName: "Sergio",
  };

  return appointment;
};

export const main = step02;
