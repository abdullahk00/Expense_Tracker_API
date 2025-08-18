const Income = require("../models/incomeModal.js");
const User = require("../models/userModal");

const income = async (req, res) => {
  try {
    const { title, description, amount, type } = req.body;
    const userId = req.userId;

    if (!title || !description || !amount || !type) {
      return res.status(400).send({ message: "Please fill all fields" });
    }

    const newIncome = new Income({
      title,
      description,
      amount,
      type,
      userId,
    });

    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ message: "User not found" });

    if (type === "income") {
      user.accountBalance += amount;
    }

    await user.save();
    await newIncome.save();

    res.status(201).send({
      message: "Income created successfully",
      data: newIncome,
    });
  } catch (error) {
    res.status(400).send({
      message: "Invalid Income",
      error: error.message,
    });
  }
};

const getAllIncome = async (req, res) => {
  try {
    const userId = req.userId;
    const incomes = await Income.find({ userId }).populate(
      "userId",
      "username"
    );

    res.status(200).send({ message: "Incomes found", data: incomes });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch incomes", error: error.message });
  }
};

const getIncome = async (req, res) => {
  try {
    const incomeId = req.params.id;
    const income = await Income.findById(incomeId);

    if (!income) return res.status(404).send({ message: "Income not found" });

    res.status(200).send({ message: "Income fetched", data: income });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch income", error: error.message });
  }
};

const updateIncome = async (req, res) => {
  try {
    const incomeId = req.params.id;
    const body = req.body;

    const updatedIncome = await Income.findByIdAndUpdate(incomeId, body, {
      new: true,
    });

    if (!updatedIncome) {
      return res.status(404).send({ message: "Income not found" });
    }

    res.status(200).send({
      message: "Income updated successfully",
      data: updatedIncome,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const deleteIncome = async (req, res) => {
  try {
    const deleted = await Income.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).send({ message: "income not found" });
    }

    res.status(200).send({ message: "Income Deleted Successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  income,
  getAllIncome,
  getIncome,
  updateIncome,
  deleteIncome,
};
