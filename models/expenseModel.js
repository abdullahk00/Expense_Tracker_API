const mongoose = require("mongoose");
const { type } = require("os");

const expenseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    amount: Number,
    type: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("expenses", expenseSchema);
