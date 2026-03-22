const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    cuisines: [{ type: String, trim: true }],
    rating: { type: Number, required: true, min: 1, max: 5 },
    deliveryTime: { type: Number, required: true, min: 5 },
    priceForTwo: { type: Number, required: true, min: 50 },
    isVegOnly: { type: Boolean, default: false },
    location: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

restaurantSchema.index({ category: 1, location: 1, isActive: 1 });

module.exports = mongoose.model("Restaurant", restaurantSchema);
