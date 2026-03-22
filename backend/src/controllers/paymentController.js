const crypto = require("crypto");
const Razorpay = require("razorpay");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const calculateCartTotals = require("../utils/calculateCartTotals");
const HttpError = require("../utils/httpError");

// Lazy init: only create instance when keys are present
const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are not configured.");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

const createRazorpayOrder = async (req, res, next) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return next(new HttpError(500, "Razorpay credentials are not configured."));
    }

    const razorpay = getRazorpayClient();
    const { deliveryAddress } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) return next(new HttpError(400, "Cart is empty."));

    const totals = calculateCartTotals(cart.items, cart.discountAmount);
    const options = {
      amount: Math.round(totals.totalAmount * 100),
      currency: "INR",
      receipt: `bytebite_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const order = await Order.create({
      user: req.user.id,
      items: cart.items.map((item) => ({
        menuItem: item.menuItem,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      ...totals,
      paymentStatus: "pending",
      paymentMethod: "razorpay",
      razorpayOrderId: razorpayOrder.id,
      deliveryAddress
    });

    res.json({
      success: true,
      data: {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    next(error);
  }
};

const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return next(new HttpError(400, "Payment verification failed."));
    }

    const order = await Order.findById(orderId);
    if (!order) return next(new HttpError(404, "Order not found."));

    order.paymentStatus = "paid";
    order.razorpayPaymentId = razorpayPaymentId;
    order.status = "confirmed";
    await order.save();

    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], couponCode: null, discountAmount: 0 },
      { new: true }
    );

    res.json({ success: true, message: "Payment verified and order confirmed.", data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment };
