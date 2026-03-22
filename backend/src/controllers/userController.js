const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Order = require("../models/Order");
const HttpError = require("../utils/httpError");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, addresses } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return next(new HttpError(404, "User not found."));
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (Array.isArray(addresses)) user.addresses = addresses;
    await user.save();
    res.json({ success: true, message: "Profile updated.", data: { id: user._id, name: user.name, phone: user.phone, addresses: user.addresses } });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return next(new HttpError(404, "User not found."));

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return next(new HttpError(400, "Current password is incorrect."));

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, changePassword, getMyOrders };
