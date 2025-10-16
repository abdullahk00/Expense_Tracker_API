const express = require("express");
const {
  expense,
  getExpense,
  deleteExpense,
  updateExpense,
  getAllExpense,
  getReport,
  getHomeExpense,
} = require("../controller/expenseController.js");
const { authorize } = require("../middleware/auth.js");

const router = express.Router();

router.post("/", authorize, expense);
router.get("/me", authorize, getAllExpense);
router.get("/get-home-expense/:id", getHomeExpense);
router.get("/:id", authorize, getExpense);
router.delete("/:id", authorize, deleteExpense);
router.put("/:id", authorize, updateExpense);
router.get("/report/filter", getReport);

module.exports = router;
