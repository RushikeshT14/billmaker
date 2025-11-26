const mongoose = require("mongoose");

const BillItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: String,
  quantity: Number,
  sellingPrice: Number,
  total: Number,
});

const BillSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    contactNo: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    items: {
      type: [BillItemSchema],
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

BillSchema.index({ clientName: "text" });

module.exports = mongoose.model("Bill", BillSchema);
