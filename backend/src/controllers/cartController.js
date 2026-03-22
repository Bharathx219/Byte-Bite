const Cart = require("../models/Cart");
const MenuItem = require("../models/MenuItem");
const calculateCartTotals = require("../utils/calculateCartTotals");
const HttpError = require("../utils/httpError");

const COUPONS = {
  BYTE50: 50,
  BYTE100: 100,
  WELCOME25: 25
};

const withSummary = (cart) => {
  const totals = calculateCartTotals(cart.items, cart.discountAmount);
  return {
    _id: cart._id,
    items: cart.items,
    couponCode: cart.couponCode || null,
    ...totals
  };
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    res.json({ success: true, data: withSummary(cart) });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { menuItemId, quantity = 1 } = req.body;
    const item = await MenuItem.findById(menuItemId);
    if (!item || !item.isAvailable) return next(new HttpError(404, "Menu item not found."));

    const cart = await getOrCreateCart(req.user.id);
    const existing = cart.items.find((i) => i.menuItem.toString() === menuItemId);
    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        menuItem: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: Number(quantity)
      });
    }
    await cart.save();
    res.status(201).json({ success: true, message: "Item added to cart.", data: withSummary(cart) });
  } catch (error) {
    next(error);
  }
};

const updateCartItemQuantity = async (req, res, next) => {
  try {
    const { menuItemId, quantity } = req.body;
    const cart = await getOrCreateCart(req.user.id);
    const item = cart.items.find((i) => i.menuItem.toString() === menuItemId);
    if (!item) return next(new HttpError(404, "Cart item not found."));

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.menuItem.toString() !== menuItemId);
    } else {
      item.quantity = Number(quantity);
    }
    await cart.save();
    res.json({ success: true, message: "Cart updated.", data: withSummary(cart) });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { menuItemId } = req.params;
    const cart = await getOrCreateCart(req.user.id);
    cart.items = cart.items.filter((i) => i.menuItem.toString() !== menuItemId);
    await cart.save();
    res.json({ success: true, message: "Item removed from cart.", data: withSummary(cart) });
  } catch (error) {
    next(error);
  }
};

const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const cart = await getOrCreateCart(req.user.id);
    const normalizedCode = code ? code.toUpperCase().trim() : "";
    const discount = COUPONS[normalizedCode];
    if (!discount) return next(new HttpError(400, "Invalid coupon code."));
    cart.couponCode = normalizedCode;
    cart.discountAmount = discount;
    await cart.save();
    res.json({ success: true, message: "Coupon applied.", data: withSummary(cart) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  applyCoupon,
  getOrCreateCart,
  withSummary
};
