const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    menuItemName: { type: String, required: true, trim: true }, // Linking by name for the static frontend bridge
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 500 }
  },
  { timestamps: true }
);

// Prevent user from submitting more than one review per item
reviewSchema.index({ user: 1, menuItemName: 1 }, { unique: true });

// Static method to calculate average rating (Optional if using aggregate live, but good practice)
reviewSchema.statics.calculateAverageRating = async function (menuItemName) {
  const stats = await this.aggregate([
    { $match: { menuItemName: menuItemName } },
    { $group: { _id: "$menuItemName", avgRating: { $avg: "$rating" }, numReviews: { $sum: 1 } } }
  ]);

  // If you had a MenuItem table populated, you would update it here.
  // Since the frontend is static HTML, we calculate it dynamically on the read endpoint if needed.
};

module.exports = mongoose.model("Review", reviewSchema);
