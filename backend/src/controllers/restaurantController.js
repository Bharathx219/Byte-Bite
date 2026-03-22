const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");

const getRestaurants = async (req, res, next) => {
  try {
    const { search, rating, vegOnly, maxPriceForTwo, fastDelivery, sortBy } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { cuisines: { $regex: search, $options: "i" } }
      ];
    }
    if (rating) query.rating = { $gte: Number(rating) };
    if (vegOnly === "true") query.isVegOnly = true;
    if (maxPriceForTwo) query.priceForTwo = { $lte: Number(maxPriceForTwo) };
    if (fastDelivery === "true") query.deliveryTime = { $lte: 30 };

    const sortMap = {
      rating: { rating: -1 },
      deliveryTime: { deliveryTime: 1 },
      priceLowToHigh: { priceForTwo: 1 },
      priceHighToLow: { priceForTwo: -1 }
    };
    const sort = sortMap[sortBy] || { createdAt: -1 };

    const restaurants = await Restaurant.find(query).sort(sort);
    res.json({ success: true, data: restaurants });
  } catch (error) {
    next(error);
  }
};

const getRestaurantMenu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found." });

    const menuItems = await MenuItem.find({ restaurant: id, isAvailable: true }).sort({ category: 1, name: 1 });
    res.json({ success: true, data: { restaurant, menuItems } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRestaurants, getRestaurantMenu };
