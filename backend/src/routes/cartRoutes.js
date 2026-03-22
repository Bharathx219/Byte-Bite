const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  applyCoupon
} = require("../controllers/cartController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { addToCartValidator, updateCartValidator } = require("../validators/cartValidators");

const router = express.Router();

router.use(protect);
router.get("/", getCart);
router.post("/", addToCartValidator, validate, addToCart);
router.patch("/", updateCartValidator, validate, updateCartItemQuantity);
router.delete("/:menuItemId", removeFromCart);
router.post("/coupon", applyCoupon);

module.exports = router;
