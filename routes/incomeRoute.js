const express = require("express");
const {
  income,
  getAllIncome,
  getIncome,
  deleteIncome,
  updateIncome,
} = require("../controller/incomeController.js");
const { authorize } = require("../middleware/auth.js");

const router = express.Router();

router.post("/", authorize, income);
router.get("/me", authorize, getAllIncome);
router.get("/:id", authorize, getIncome);
router.delete("/:id", authorize, deleteIncome);
router.put("/:id", authorize, updateIncome);

module.exports = router;
