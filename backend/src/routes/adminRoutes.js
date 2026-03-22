const express = require("express");
const { addRestaurant, addMenuItem, updateMenuItem, deleteMenuItem, getAllOrders, updateOrderStatus } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.use(protect, adminOnly);
router.post("/restaurants", addRestaurant);
router.post("/menu-items", addMenuItem);
router.put("/menu-items/:id", updateMenuItem);
router.delete("/menu-items/:id", deleteMenuItem);
router.get("/orders", getAllOrders);
router.patch("/orders/:id/status", updateOrderStatus);

module.exports = router;
