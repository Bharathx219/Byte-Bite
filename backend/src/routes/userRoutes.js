const express = require("express");
const { getProfile, updateProfile, changePassword, getMyOrders } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { updateProfileValidator, changePasswordValidator } = require("../validators/userValidators");

const router = express.Router();

router.use(protect);
router.get("/me", getProfile);
router.put("/me", updateProfileValidator, validate, updateProfile);
router.patch("/me/password", changePasswordValidator, validate, changePassword);
router.get("/me/orders", getMyOrders);

module.exports = router;
