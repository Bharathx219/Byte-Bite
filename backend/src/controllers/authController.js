const jwt = require("jsonwebtoken");
const User = require("../models/User");
const HttpError = require("../utils/httpError");

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return next(new HttpError(409, "Email already registered."));

    const user = await User.create({ name, email, phone, password });
    const token = signToken(user);
    res.status(201).json({
      success: true,
      message: "Registration successful.",
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return next(new HttpError(401, "Invalid credentials."));

    const matched = await user.comparePassword(password);
    if (!matched) return next(new HttpError(401, "Invalid credentials."));

    const token = signToken(user);
    res.json({
      success: true,
      message: "Login successful.",
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
