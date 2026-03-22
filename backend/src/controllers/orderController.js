const Order = require("../models/Order");
const Cart = require("../models/Cart");
const calculateCartTotals = require("../utils/calculateCartTotals");
const HttpError = require("../utils/httpError");

const placeOrder = async (req, res, next) => {
  try {
    const { deliveryAddress, paymentMethod = "cod", items } = req.body;
    let orderItems = [];

    // Support parsing frontend local storage cart
    if (items && items.length > 0) {
      orderItems = items.map((item) => ({
        menuItem: item.menuItem || item.id || "manual-item",
        name: item.name,
        price: item.price,
        quantity: item.qty || item.quantity
      }));
    } else {
      const cart = await Cart.findOne({ user: req.user.id });
      if (!cart || cart.items.length === 0) return next(new HttpError(400, "Cart is empty."));
      orderItems = cart.items.map((item) => ({
        menuItem: item.menuItem,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
    }

    if (orderItems.length === 0) return next(new HttpError(400, "No items in order."));

    const totals = calculateCartTotals(orderItems, 0);

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      ...totals,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      paymentMethod,
      deliveryAddress: deliveryAddress || "Self Pickup",
      status: "placed"
    });

    if (!items || items.length === 0) {
      await Cart.findOneAndUpdate(
        { user: req.user.id },
        { items: [], couponCode: null, discountAmount: 0 },
        { new: true }
      );
    }

    res.status(201).json({ success: true, message: "Order placed successfully.", data: order });
  } catch (error) {
    next(error);
  }
};

const orderHistory = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

module.exports = { placeOrder, orderHistory };
