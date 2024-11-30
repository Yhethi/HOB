export const calculateTotals = (products, rates, binanceVES) => {
  const { bolivarRate, pesoRate } = rates;
  console.log("binanceVES:", binanceVES);

  const totals = products.reduce(
    (acc, item) => {
      const subtotalDolares = item.precio * item.cantidad;
      const subtotalVES = parseFloat((subtotalDolares * binanceVES).toFixed(2));
      console.log("subtotalVES:", subtotalVES);
      acc.dolares += parseFloat(subtotalDolares.toFixed(2));
      acc.bolivares += subtotalVES;
      acc.pesos += parseFloat((subtotalDolares * pesoRate).toFixed(2));
      return acc;
    },
    { bolivares: 0.0, pesos: 0.0, dolares: 0.0 }
  );
  console.log("Totals: ", totals);

  return totals;
};
