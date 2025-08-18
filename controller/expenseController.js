const Expense = require("../models/expenseModel");
const User = require("../models/userModal");

const expense = async (req, res) => {
  try {
    const { title, description, amount, type } = req.body;
    const userId = req.userId;

    if (!title || !description || !amount || !type) {
      return res.status(400).send({ message: "Please fill all fields" });
    }

    const newExpense = new Expense({
      title,
      description,
      amount,
      type,
      userId: req.userId,
    });

    const user = await User.findById(userId);
    if (!user) res.status(404).send({ message: "user not found" });

    if (type == "expense") user.accountBalance -= amount;
    else user.accountBalance += amount;

    await user.save();

    await newExpense.save();

    res.status(201).send({
      message: "Expense created successfully",
      data: newExpense,
      newBalance: user.accountBalance,
    });
  } catch (error) {
    res.status(400).send({ message: "Invalid Expense", error: error.message });
  }
};

const getExpense = async (req, res) => {
  try {
    let expenceId = req.params.id;
    const expenses = await Expense.findById(expenceId);

    if (!expenses || expenses.length === 0) {
      return res.status(404).send({ message: "No expenses found" });
    }

    res
      .status(200)
      .send({ message: "Expenses fetched successfully", data: expenses });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Failed to fetch expenses", error: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const body = req.body;
    const expenseId = req.params.id;

    const updateExpense = await Expense.findByIdAndUpdate(expenseId, body);

    if (!updateExpense)
      return res.status(500).send({ message: "Internal server error" });

    res.send({ message: "expense update successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(401).send({ message: "expense not found" });
    }

    res.status(200).send({ message: "Expense Deleted Successfully" });
  } catch (error) {
    res.status(400).send({ message: "Server Error", error: error.message });
  }
};

const getAllExpense = async (req, res) => {
  try {
    const userId = req.userId;

    const expenses = await Expense.find({ userId }).populate(
      "userId",
      "username"
    );

    res.status(200).send({ message: "Expenses found ", data: expenses });
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Expense not found" });
  }
};

module.exports = {
  expense,
  getExpense,
  deleteExpense,
  updateExpense,
  getAllExpense,
};
