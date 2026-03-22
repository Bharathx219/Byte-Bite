const express = require("express");
const { addReview, getReviewsForMenuItem } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", getReviewsForMenuItem);
router.post("/", protect, addReview);

module.exports = router;
