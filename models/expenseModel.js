const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    amount: Number,
    type: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("expenses", expenseSchema);
