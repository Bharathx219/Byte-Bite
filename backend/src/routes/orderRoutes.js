const express = require("express");
const { placeOrder, orderHistory } = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);
router.post("/", placeOrder);
router.get("/history", orderHistory);

module.exports = router;
