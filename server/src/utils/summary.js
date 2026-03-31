export function buildSummary(products, payments) {
  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  );

  const lowStockItems = products.filter(
    (product) => product.stock <= product.reorderLevel
  );

  const collectedAmount = payments
    .filter((payment) => payment.status === "Completed")
    .reduce((total, payment) => total + payment.amount, 0);

  const pendingAmount = payments
    .filter((payment) => payment.status === "Pending")
    .reduce((total, payment) => total + payment.amount, 0);

  return {
    totalProducts: products.length,
    inventoryValue,
    lowStockCount: lowStockItems.length,
    collectedAmount,
    pendingAmount
  };
}
