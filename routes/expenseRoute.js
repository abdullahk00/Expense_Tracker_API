const express = require("express");
const {
  expense,
  getExpense,
  deleteExpense,
  updateExpense,
  getAllExpense,
} = require("../controller/expenseController.js");
const { authorize } = require("../middleware/auth.js");

const router = express.Router();

router.post("/", authorize, expense);
router.get("/me", authorize, getAllExpense);
router.get("/:id", authorize, getExpense);
router.delete("/:id", authorize, deleteExpense);
router.put("/:id", authorize, updateExpense);

module.exports = router;
