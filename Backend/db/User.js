const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Click Schema
const ClickSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Type of click (e.g., "link", "shop", "getConnected")
  app: { type: String }, // App associated with the click (e.g., "facebook", "instagram")
  date: { type: Date, default: Date.now }, // Date of the click
  platform: { type: String }, // Platform/device type (e.g., "Windows", "Mac", "Android")
  linkId: { type: mongoose.Schema.Types.ObjectId }, // Reference to the specific link
  url: { type: String }, // New field: The specific URL clicked
});

// User Schema
const UserSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String },
    username: { type: String },
    category: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    bio: { type: String },
    selectedColor: { type: String },
    selectedLayout: { type: String },
    selectedButtonStyle: { type: String },
    buttonColor: { type: String },
    buttonFontColor: { type: String },
    selectedTheme: { type: String },
    selectedFont: { type: String },
    selectedFontColor: { type: String },
    savedAddLinks: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Unique ID for each link
        title: { type: String, required: true },
        url: { type: String, required: true },
        app: { type: String }, // Optional: Stores the selected app (e.g., Instagram, Facebook)
        createdAt: { type: Date, default: Date.now }, // Timestamp for when the link was added
      },
    ],
    savedShopLinks: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Unique ID for each shop link
        title: { type: String, required: true },
        url: { type: String, required: true },
        image: { type: String }, // Optional: Stores the shop image URL
        createdAt: { type: Date, default: Date.now }, // Timestamp for when the shop link was added
      },
    ],
    clicks: [ClickSchema], // Array to store click details
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);