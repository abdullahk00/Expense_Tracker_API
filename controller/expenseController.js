const mongoose = require("mongoose");
const Expense = require("../models/expenseModel");
const User = require("../models/userModal");

const expense = async (req, res) => {
  try {
    const { title, description, amount, type } = req.body;
    const userId = req.userId;

    if (!title || !description || !amount || !type) {
      return res.status(400).send({ message: "Please fill all fields" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ message: "User not found" });

    const newExpense = new Expense({
      title,
      description,
      amount,
      type,
      userId,
    });

    if (type === "expense") {
      user.accountBalance -= amount;
    } else if (type === "income") {
      user.accountBalance += amount;
    }

    await user.save();
    await newExpense.save();

    res.status(201).send({
      message: "Expense created successfully",
      data: newExpense,
      newBalance: user.accountBalance,
    });
  } catch (error) {
    console.error("Create Expense Error:", error);
    res.status(400).send({ message: "Invalid Expense", error: error.message });
  }
};

const getExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).send({ message: "Expense not found" });
    }

    res.status(200).send({
      message: "Expense fetched successfully",
      data: expense,
    });
  } catch (error) {
    console.error("Get Expense Error:", error);
    res
      .status(500)
      .send({ message: "Failed to fetch expense", error: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const body = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(expenseId, body, {
      new: true,
    });

    if (!updatedExpense) {
      return res.status(404).send({ message: "Expense not found" });
    }

    res.status(200).send({
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    console.error("Update Expense Error:", error);
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).send({ message: "Expense not found" });
    }

    res.status(200).send({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    res.status(500).send({ message: "Server Error", error: error.message });
  }
};

const getAllExpense = async (req, res) => {
  try {
    const userId = req.userId;
    const expenses = await Expense.find({ userId }).populate(
      "userId",
      "username"
    );

    res.status(200).send({
      message: "Expenses found",
      data: expenses,
    });
  } catch (error) {
    console.error("Get All Expenses Error:", error);
    res
      .status(500)
      .send({ message: "Expense not found", error: error.message });
  }
};

const getReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.userId;

    if (!startDate || !endDate) {
      return res.status(400).send({ message: "Start and End date required" });
    }

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    const expenses = await Expense.find({
      userId: mongoose.Types.ObjectId(userId),
      createdAt: { $gte: start, $lte: end },
    });

    console.log("Found Expenses:", expenses.length);

    if (!expenses || expenses.length === 0) {
      return res.status(404).send({ message: "No data found " });
    }

    let totalIncome = 0;
    let totalExpense = 0;

    expenses.forEach((item) => {
      if (item.type === "income") totalIncome += item.amount;
      else if (item.type === "expense") totalExpense += item.amount;
    });

    res.status(200).send({
      message: "Report generated",
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      data: expenses,
    });
  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).send({
      message: "Failed to generate report",
      error: error.message,
    });
  }
};



module.exports = {
  expense,
  getExpense,
  updateExpense,
  deleteExpense,
  getAllExpense,
  getReport,
  deleteExpense,
};
