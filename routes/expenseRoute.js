const express = require("express");
const {
  expense,
  getExpense,
  deleteExpense,
  updateExpense,
  getAllExpense,
  getReport,
} = require("../controller/expenseController.js");
const { authorize } = require("../middleware/auth.js");

const router = express.Router();

router.post("/", authorize, expense);
router.get("/me", authorize, getAllExpense);
router.get("/:id", authorize, getExpense);
router.delete("/:id", authorize, deleteExpense);
router.put("/:id", authorize, updateExpense);
router.get("/report/filter", authorize, getReport);

module.exports = router;
