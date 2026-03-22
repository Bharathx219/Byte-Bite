const Review = require("../models/Review");
const HttpError = require("../utils/httpError");

const addReview = async (req, res, next) => {
  try {
    const { menuItemName, rating, comment } = req.body;
    
    if (!menuItemName || !rating || !comment) {
      return next(new HttpError(400, "Please provide menu item name, rating, and comment."));
    }

    // Upsert or create new
    const existing = await Review.findOne({ user: req.user.id, menuItemName });
    if (existing) {
      return next(new HttpError(409, "You have already reviewed this item."));
    }

    const review = await Review.create({
      user: req.user.id,
      menuItemName,
      rating: Number(rating),
      comment
    });

    res.status(201).json({ success: true, message: "Review posted successfully.", data: review });
  } catch (error) {
    next(error);
  }
};

const getReviewsForMenuItem = async (req, res, next) => {
  try {
    const { menuItemName } = req.query;
    
    if (!menuItemName) {
      return next(new HttpError(400, "Please provide a menu item name to fetch reviews for."));
    }

    const reviews = await Review.find({ menuItemName })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    // Calculate aggregated stats dynamically for the static frontend
    const stats = await Review.aggregate([
      { $match: { menuItemName: menuItemName } },
      { $group: { _id: "$menuItemName", avgRating: { $avg: "$rating" }, numReviews: { $sum: 1 } } }
    ]);

    const averageRating = stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0;
    const totalReviews = stats.length > 0 ? stats[0].numReviews : 0;

    res.json({ 
      success: true, 
      data: {
        reviews,
        stats: { averageRating, totalReviews }
      } 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addReview, getReviewsForMenuItem };
