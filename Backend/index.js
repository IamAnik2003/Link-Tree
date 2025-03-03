const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const conn = require("./db/db.connect");
const User = require("./db/User");
const path = require("path");
const mongoose = require("mongoose");
const { platform } = require("os");

const app = express();
conn();
dotenv.config();

const port = process.env.PORT || 3050;
const secret = process.env.SECRET_KEY;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/api/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: "User already already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  res.status(201).json({ message: "User registered successfully" });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const newuser = await User.findOne({ email });

  if (!newuser) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, newuser.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const payload = {
    firstname: newuser.firstname,
    email: newuser.email,
    password: newuser.password,
    username: newuser.username,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "1d" });
  console.log(token);

  res.status(200).json({
    token,
    fullname: newuser.firstname + " " + newuser.lastname,
    username: newuser.username,
    email: newuser.email,
    selectedColor: newuser.selectedColor,
    bio: newuser.bio,
    savedAddLinks: newuser.savedAddLinks,
    savedShopLinks: newuser.savedShopLinks,
    selectedLayout: newuser.selectedLayout,
    selectedButtonStyle: newuser.selectedButtonStyle,
    buttonColor: newuser.buttonColor,
    buttonFontColor: newuser.buttonFontColor,
    selectedTheme: newuser.selectedTheme,
    selectedFont: newuser.selectedFont,
    selectedFontColor: newuser.selectedFontColor,
    userID: newuser._id,
    profileImage: newuser.profileImage
  });
});

app.post("/api/tell-us-yourname", async (req, res) => {
  try {
    const { email, username, category } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists. Please choose a different username.",
      });
    }

    const loggedUser = await User.findOne({ email });
    if (!loggedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    loggedUser.username = username;
    loggedUser.category = category;
    await loggedUser.save();

    console.log("Updated User:", loggedUser);
    res.status(200).json({ message: "Data saved successfully!" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "An error occurred while saving data." });
  }
});

// Modified /api/profileSave POST Route (Saves filename instead of path)
app.post("/api/profileSave",async (req, res) => {
  try {
    const { email, username, bio, selectedColor } = req.body;
    const loggedUser = await User.findOne({ email });

    if (!loggedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user fields
    loggedUser.bio = bio;
    loggedUser.username = username;
    loggedUser.selectedColor = selectedColor;

    await loggedUser.save();
    res.status(200).json({ 
      message: "Data saved successfully!",
      user: {
        username: loggedUser.username,
        bio: loggedUser.bio,
        email: loggedUser.email,
        selectedColor: loggedUser.selectedColor,
      }
    });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "An error occurred while saving data." });
  }
});

app.post("/api/saveappsettings", async (req, res) => {
  try {
    const {
      email,
      selectedLayout,
      selectedButtonStyle,
      buttonColor,
      buttonFontColor,
      selectedTheme,
      selectedFont,
      selectedFontColor,
    } = req.body;
    const loggedUser = await User.findOne({ email });
    if (!loggedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    loggedUser.selectedLayout = selectedLayout;
    loggedUser.selectedButtonStyle = selectedButtonStyle;
    loggedUser.buttonColor = buttonColor;
    loggedUser.buttonFontColor = buttonFontColor;
    loggedUser.selectedTheme = selectedTheme;
    loggedUser.selectedFont = selectedFont;
    loggedUser.selectedFontColor = selectedFontColor;
    await loggedUser.save();
    res.status(200).json({ message: "Data saved successfully!" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "An error occurred while saving data." });
  }
});

app.get("/api/profile", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      username: user.username,
      bio: user.bio,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      selectedColor: user.selectedColor,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "An error occurred while fetching profile data." });
  }
});

app.patch("/api/profileSave", async (req, res) => {
  const { savedAddLinks, savedShopLinks, email } = req.body;

  try {
    const loggedUser = await User.findOne({ email });
    if (!loggedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    loggedUser.savedAddLinks = savedAddLinks;
    loggedUser.savedShopLinks = savedShopLinks;

    await loggedUser.save();
    res.status(200).json({ message: "Links saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.patch("/api/updateprofile", async (req, res) => {
  const { email, firstname, lastname, password, newEmail } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = newEmail;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/api/getUserProfile/:userID", async (req, res) => {
  const { userID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userID)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findOne({ _id: userID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      bio: user.bio,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      selectedColor: user.selectedColor,
      savedAddLinks: user.savedAddLinks,
      savedShopLinks: user.savedShopLinks,
      selectedLayout: user.selectedLayout,
      selectedButtonStyle: user.selectedButtonStyle,
      buttonColor: user.buttonColor,
      buttonFontColor: user.buttonFontColor,
      selectedTheme: user.selectedTheme,
      selectedFont: user.selectedFont,
      selectedFontColor: user.selectedFontColor,
      userID: user._id,
      profileImage: user.profileImage
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    res.status(500).json({ message: "Something went wrong" });
  }
});
app.patch("/api/updateProfileImage", async (req, res) => {
  const { email, imageURL } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profileImage = imageURL; // Update the profileImage field
    await user.save();

    res.status(200).json({ message: "Profile image updated successfully", profileImage: imageURL });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: "Failed to update profile image" });
  }
});
app.patch("/api/removeProfileImage", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profileImage = null; // Remove the profileImage field
    await user.save();

    res.status(200).json({ message: "Profile image removed successfully" });
  } catch (error) {
    console.error("Error removing profile image:", error);
    res.status(500).json({ message: "Failed to remove profile image" });
  }
});
app.post("/api/setCounts", async (req, res) => {
  const { userID, type, app, platform, url, linkId } = req.body;

  console.log("Received request:", req.body); // Debugging log

  try {
    const user = await User.findOne({ _id: userID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const click = {
      type,
      app,
      platform,
      url,     // Store the URL
      linkId,  // Store the linkId
      date: new Date(),
    };

    const isDuplicate = user.clicks.some(
      (c) =>
        c.type === click.type &&
        c.app === click.app &&
        c.platform === click.platform &&
        c.url === click.url && // Check URL for duplicates
        c.linkId === click.linkId &&
        c.date.getTime() === click.date.getTime()
    );

    if (!isDuplicate) {
      user.clicks.push(click);
      await user.save();
      console.log("User clicks updated:", user.clicks);
      res.status(200).json({ message: "Click tracked successfully" });
    } else {
      console.log("Duplicate click ignored:", click);
      res.status(200).json({ message: "Duplicate click ignored" });
    }
  } catch (error) {
    console.error("Error tracking click:", error);
    res.status(500).json({ message: "Failed to track click" });
  }
});
app.get("/api/getClickDetails/:userID", async (req, res) => {
  const { userID } = req.params;

  try {
    const user = await User.findOne({ _id: userID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ clicks: user.clicks });
  } catch (error) {
    console.error("Error fetching click details:", error);
    res.status(500).json({ message: "Failed to fetch click details" });
  }
});
app.get("/api/getClickDetails", async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ clicks: user.clicks });
  } catch (error) {
    console.error("Error fetching click details:", error);
    res.status(500).json({ message: "Failed to fetch click details" });
  }
});
app.get("/api/getCounts", async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate click counts from the clicks array
    const linkClicks = user.clicks.filter((click) => click.type === "link").length;
    const shopClicks = user.clicks.filter((click) => click.type === "shop").length;
    const getConnectedClicks = user.clicks.filter((click) => click.type === "getConnected").length;
    const facebookClicks = user.clicks.filter((click) => click.app === "facebook").length;
    const instagramClicks = user.clicks.filter((click) => click.app === "instagram").length;
    const youtubeClicks = user.clicks.filter((click) => click.app === "youtube").length;
    const otherClicks = user.clicks.filter(
      (click) => click.app && !["facebook", "instagram", "youtube"].includes(click.app)
    ).length;

    // Extract platform data from clicks
    const platforms = user.clicks.reduce((acc, click) => {
      if (click.platform) {
        acc[click.platform] = (acc[click.platform] || 0) + 1;
      }
      return acc;
    }, {});

    // Extract linkClicks and shopClicks by date
    const clicksByDate = user.clicks.reduce((acc, click) => {
      const date = new Date(click.date).toISOString().split('T')[0]; // Format as YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = { linkClicks: 0, shopClicks: 0 };
      }
      if (click.type === "link") acc[date].linkClicks += 1;
      if (click.type === "shop") acc[date].shopClicks += 1;
      return acc;
    }, {});

    // Calculate clicks for individual links (both savedAddLinks and savedShopLinks)
    const clicksByLink = [
      ...user.savedAddLinks.map((link) => {
        const linkClicks = user.clicks.filter(
          (click) => click.linkId?.toString() === link._id.toString()
        ).length;
        return {
          linkId: link._id,
          title: link.title,
          clicks: linkClicks,
        };
      }),
      ...user.savedShopLinks.map((link) => {
        const linkClicks = user.clicks.filter(
          (click) => click.linkId?.toString() === link._id.toString()
        ).length;
        return {
          linkId: link._id,
          title: link.title,
          clicks: linkClicks,
        };
      }),
    ];

    res.status(200).json({
      linkClicks,
      shopClicks,
      getConnectedClicks,
      facebookClicks,
      instagramClicks,
      youtubeClicks,
      otherClicks,
      platforms, // Platform counts
      clicksByDate, // LinkClicks and shopClicks by date
      clicksByLink, // Clicks for individual links
    });
  } catch (error) {
    console.error("Error fetching click counts:", error);
    res.status(500).json({ message: "Failed to fetch click counts" });
  }
});
app.get("/api/getClickDetailsByLink/:linkId", async (req, res) => {
  const { linkId } = req.params;

  try {
    const user = await User.findOne({ "savedAddLinks._id": linkId }); // Find user by linkId
    if (!user) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Filter clicks for the specific linkId
    const clicksForLink = user.clicks.filter((click) => click.linkId?.toString() === linkId);

    res.status(200).json({ clicks: clicksForLink });
  } catch (error) {
    console.error("Error fetching click details for link:", error);
    res.status(500).json({ message: "Failed to fetch click details for link" });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});