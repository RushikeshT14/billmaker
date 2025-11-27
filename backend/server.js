const bcrypt = require("bcrypt");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./Schemas/AdminSchema.js");
const Product = require("./Schemas/ProdectSchema.js");
const Bill = require("./Schemas/BillSchema.js");
const jwt = require("jsonwebtoken");
const auth = require("./Middleware/authMiddleware.js");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
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

// -----------------------------------------------------------------Product-------------------------------------

app.get("/products", auth, async (req, res) => {
  try {
    let search = req.query.search || "";

    const products = await Product.find({
      $or: [
        { productName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    });
    res.json({
      success: true,
      message: "Data Found",
      products,
    });
  } catch (error) {
    res.json({ success: false, message: "Server Error" });
  }
});

app.post("/addproduct", auth, async (req, res) => {
  const { productName, category, MRP, sellingPrice } = req.body;
  const name = productName.trim().toLowerCase();
  try {
    const existingProduct = await Product.findOne({ productName: name });
    if (existingProduct) {
      return res.json({
        success: false,
        message: "Product already Exist.",
      });
    }
    const newProduct = new Product({
      productName: name,
      category,
      MRP,
      sellingPrice,
    });
    await newProduct.save();
    return res.json({ success: true, message: "Product addded" });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Error while adding product." });
  }
});

app.get("/products/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/products/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const editProduct = await Product.findById(id);
    if (!editProduct) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    editProduct.productName = req.body.productName || editProduct.productName;
    editProduct.category = req.body.category || editProduct.category;
    editProduct.MRP = req.body.MRP || editProduct.MRP;
    editProduct.sellingPrice =
      req.body.sellingPrice || editProduct.sellingPrice;

    await editProduct.save();
    // console.log(editProduct);
    return res.json({
      success: true,
      message: "Product information updated successfully",
      product: editProduct,
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});

app.delete("/products/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const deleteProduct = await Product.findByIdAndDelete(id);
    if (!deleteProduct) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }
    // console.log(deleteProduct);
    return res.json({
      success: true,
      message: "Product Deleted",
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Server error" });
  }
});

// --------------------------------------------------------------------BILLING-------------------------------------
app.post("/bill", auth, async (req, res) => {
  try {
    const { clientName, address, contactNo, date, items, totalAmount } =
      req.body;
    const bill = new Bill({
      clientName,
      address,
      contactNo,
      date,
      items,
      totalAmount,
    });
    await bill.save();
    return res.json({ success: true, message: "Bill saved" });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
});
app.get("/allbills", auth, async (req, res) => {
  try {
    let search = req.query.search || "";

    const bills = await Bill.find({
      clientName: { $regex: search, $options: "i" },
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Bills Found",
      bills,
    });
  } catch (error) {
    res.json({ success: false, message: "Server Error" });
  }
});
app.delete("/allbills/:id", auth, async (req, res) => {
  try {
    const billId = req.params.id;

    const deletedBill = await Bill.findByIdAndDelete(billId);

    if (!deletedBill) {
      return res.json({
        success: false,
        message: "Bill not found",
      });
    }

    res.json({
      success: true,
      message: "Bill deleted",
      deletedBill,
    });
  } catch (error) {
    res.json({ success: false, message: "Server Error" });
  }
});

app.get("/checkauth", auth, (req, res) => {
  res.json({ success: true, user: req.user });
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
