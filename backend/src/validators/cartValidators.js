const { body } = require("express-validator");

const addToCartValidator = [
  body("menuItemId").isMongoId().withMessage("Valid menuItemId is required."),
  body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1.")
];

const updateCartValidator = [
  body("menuItemId").isMongoId().withMessage("Valid menuItemId is required."),
  body("quantity").isInt({ min: 0 }).withMessage("Quantity must be zero or more.")
];

module.exports = { addToCartValidator, updateCartValidator };
