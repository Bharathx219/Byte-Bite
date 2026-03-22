const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    items: [cartItemSchema],
    couponCode: { type: String, trim: true, uppercase: true },
    discountAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
