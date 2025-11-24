const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "General",
    },
    MRP: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);


productSchema.index({
  productName: "text",
  category: "text",
});

module.exports = mongoose.model("Product", productSchema);
