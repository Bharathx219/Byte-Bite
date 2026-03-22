const TAX_RATE = 0.05;
const DELIVERY_FEE = 39;

const calculateCartTotals = (items, discountAmount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxes = Number((subtotal * TAX_RATE).toFixed(2));
  const rawTotal = subtotal + taxes + DELIVERY_FEE - discountAmount;
  const totalAmount = Number(Math.max(rawTotal, 0).toFixed(2));
  return {
    subtotal,
    taxes,
    deliveryFee: DELIVERY_FEE,
    discountAmount,
    totalAmount
  };
};

module.exports = calculateCartTotals;
