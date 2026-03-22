const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const Order = require("../models/Order");
const HttpError = require("../utils/httpError");

const addRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({ success: true, message: "Restaurant added.", data: restaurant });
  } catch (error) {
    next(error);
  }
};

const addMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, message: "Menu item added.", data: item });
  } catch (error) {
    next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!item) return next(new HttpError(404, "Menu item not found"));
    res.json({ success: true, message: "Menu item updated.", data: item });
  } catch (error) {
    next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndDelete(id);
    if (!item) return next(new HttpError(404, "Menu item not found"));
    res.json({ success: true, message: "Menu item deleted." });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (_req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Ensure valid status
    const validStatuses = ["placed", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return next(new HttpError(400, "Invalid status"));
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return next(new HttpError(404, "Order not found"));
    res.json({ success: true, message: "Order status updated.", data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { addRestaurant, addMenuItem, updateMenuItem, deleteMenuItem, getAllOrders, updateOrderStatus };
