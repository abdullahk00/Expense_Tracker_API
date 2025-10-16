const { default: mongoose } = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  type: String,
});

module.exports = mongoose.model("Item", itemSchema);
