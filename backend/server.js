const bcrypt = require("bcrypt");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./Schemas/AdminSchema.js");
const jwt = require("jsonwebtoken");
const auth = require("./Middleware/authMiddleware.js");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  // origin:true,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// app.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const hashedPass = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, password: hashedPass });
//     await newUser.save();
//     res.json({ success: true, message: "User created successfully" });
//   } catch (err) {
//     console.error(err);
//     res.json({ success: false, message: "Error creating user" });
//   }
// });

app.get("/login", (req, res) => {
  res.send("Login GET route working!");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Wrong password" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  return res.json({ success: true, message: "Logged out successfully" });
});


app.get("/", auth, (req, res) => {
  res.json({
    success: true,
    message: "This is a protected route",
    user: req.user,
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.name || "ServerError",
    message: err.message || "Something went wrong",
  });
});
