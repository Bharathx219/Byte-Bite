require("dotenv").config();
const connectDb = require("./config/db");
const Restaurant = require("./models/Restaurant");
const MenuItem = require("./models/MenuItem");
const User = require("./models/User");

const restaurants = [
  {
    name: "Spice Route Kitchen",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    category: "North Indian",
    cuisines: ["North Indian", "Biryani"],
    rating: 4.5,
    deliveryTime: 28,
    priceForTwo: 450,
    isVegOnly: false,
    location: "HSR Layout"
  },
  {
    name: "Green Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    category: "Healthy",
    cuisines: ["Salads", "Bowls", "Continental"],
    rating: 4.3,
    deliveryTime: 24,
    priceForTwo: 350,
    isVegOnly: true,
    location: "Koramangala"
  },
  {
    name: "Byte Pizza Hub",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    category: "Pizza",
    cuisines: ["Pizza", "Fast Food"],
    rating: 4.2,
    deliveryTime: 30,
    priceForTwo: 500,
    isVegOnly: false,
    location: "Indiranagar"
  }
];

const createMenuItems = (restaurantId) => [
  {
    restaurant: restaurantId,
    name: "Paneer Tikka",
    description: "Char-grilled paneer with spices.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800",
    category: "Starters",
    price: 249,
    isVeg: true
  },
  {
    restaurant: restaurantId,
    name: "Chicken Biryani",
    description: "Fragrant rice and tender chicken pieces.",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
    category: "Main Course",
    price: 299,
    isVeg: false
  },
  {
    restaurant: restaurantId,
    name: "Lemon Iced Tea",
    description: "Freshly brewed iced tea.",
    image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=800",
    category: "Drinks",
    price: 99,
    isVeg: true
  }
];

const seed = async () => {
  try {
    await connectDb();
    await Promise.all([Restaurant.deleteMany({}), MenuItem.deleteMany({}), User.deleteMany({})]);

    const createdRestaurants = await Restaurant.insertMany(restaurants);
    const allItems = createdRestaurants.flatMap((r) => createMenuItems(r._id));
    await MenuItem.insertMany(allItems);

    await User.create({
      name: "Admin",
      email: "admin@bytebite.com",
      password: "admin123",
      role: "admin"
    });

    await User.create({
      name: "Demo User",
      email: "user@bytebite.com",
      password: "user1234",
      role: "user"
    });

    console.log("Seed complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
