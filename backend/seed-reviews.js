require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const Review = require("./src/models/Review");

const seedReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding reviews...");

    // Create a dummy user if none exists
    let user = await User.findOne({ email: "reviewer@test.com" });
    if (!user) {
      user = await User.create({
        name: "Alice Reviewer",
        email: "reviewer@test.com",
        password: "password123",
      });
    }

    let user2 = await User.findOne({ email: "foodie@test.com" });
    if (!user2) {
      user2 = await User.create({
        name: "Bob The Foodie",
        email: "foodie@test.com",
        password: "password123",
      });
    }

    // Seed Reviews for Paneer
    await Review.findOneAndUpdate(
      { user: user._id, menuItemName: "Paneer Butter Masala" },
      { rating: 5, comment: "Absolutely incredible! The gravy was rich and creamy, and the paneer was melt-in-the-mouth soft. Would definitely order again." },
      { upsert: true }
    );
    await Review.findOneAndUpdate(
      { user: user2._id, menuItemName: "Paneer Butter Masala" },
      { rating: 4, comment: "Very good taste, but could have been slightly spicier. The naan pairing is a must!" },
      { upsert: true }
    );

    // Seed Reviews for Pizza
    await Review.findOneAndUpdate(
      { user: user._id, menuItemName: "Classic Pepperoni Pizza" },
      { rating: 5, comment: "The crust was perfectly baked and it had an extremely generous amount of pepperoni. Highly recommend the Cheese Burst!" },
      { upsert: true }
    );

    // Seed Reviews for Biryani
    await Review.findOneAndUpdate(
      { user: user2._id, menuItemName: "Hyd Chicken Biryani" },
      { rating: 5, comment: "Authentic Hyderabadi flavor! The chicken pieces were tender and the aroma of the spices was phenomenal." },
      { upsert: true }
    );

    console.log("Reviews seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedReviews();
