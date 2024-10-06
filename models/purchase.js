const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    }, // User who purchased
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contents",
      required: true,
    }, // Content purchased
    purchaseDate: { type: Date, default: Date.now }, // Date of purchase
  },
  {
    timestamps: true,
  }
);

const Purchase = mongoose.model("Purchases", purchaseSchema);

module.exports = Purchase;
