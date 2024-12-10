export const calculateTotals = (products, rateVES, rateCOP) => {
  const totals = products.reduce(
    (acc, item) => {
      const subtotalDolares = item.precio * item.cantidad;
      const subtotalCop = item.precio * item.cantidad * rateCOP;
      const subtotalVES = subtotalDolares * rateVES;
      acc.dolares += subtotalDolares;
      acc.bolivares += subtotalVES;
      acc.pesos += subtotalCop;
      console.log("totals:", item.precio, item.cantidad, rateCOP, rateVES);
      return acc;
    },
    { bolivares: 0.0, pesos: 0.0, dolares: 0.0 }
  );

  return totals;
};
