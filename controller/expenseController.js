const mongoose = require("mongoose");
const Expense = require("../models/expenseModel");
const User = require("../models/userModal");
const Item = require("../models/itemModel");
const { group } = require("console");
const { type } = require("os");

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

const getHomeExpense = async (req, res) => {
  try {
    let userId = req.params.id;

    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
    ]);

    return res.send(result);
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

//reprot k ciode 1 part hai/////////////////////////////////////////

// const result = await Expense.aggregate([
//   {
//     $match: {
//       // userId: new mongoose.Types.ObjectId(userId),
//       createdAt: { $gte: start, $lte: end },
//     },
//   },
//   {
//     $lookup: {
//       from: "users",
//       localField: "userId",
//       foreignField: "_id",
//       as: "userData",
//     },
//   },
//   {
//     $unwind: "$userData",
//   },
//   {
//     $project: {
//       productName: "$title",
//       description: 1,
//       amount: 1,
//       type: 1,
//       createdAt: {
//         $dateToString: {
//           date: "$createdAt",
//           format: "%d/%b/%Y %H:%M",
//         },
//       },
//       updatedAt: 1,
//       username: "$userData.username",
//       email: "$userData.email",
//       phoneNumber: "$userData.phoneNumber",
//     },
//   },
// ]);

// [
//   {
//     date: "2025-09-20",
//     data: [
//       {

//       },
//       {

//       }
//     ]
//   },
//   {
//     date: "2025-09-21",
//     data: [
//       {

//       },
//       {

//       }
//     ]
//   }
// ]

///uper vala code hai report ka

// const getReport = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     const matchStage = {};
//     if (startDate && endDate) {
//       matchStage.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
//       };
//     }

//     const result = await Expense.aggregate([
//       { $match: matchStage },

//       {
//         $addFields: {
//           date: {
//             $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
//           },
//         },
//       },

//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "userData",
//         },
//       },
//       { $unwind: "$userData" },

//       {
//         $group: {
//           _id: "$date",
//           data: {
//             $push: {
//               _id: "$_id",
//               title: "$title",
//               description: "$description",
//               amount: "$amount",
//               type: "$type",
//               userId: "$userId",
//               userName: "$userData.name",
//               createdAt: "$createdAt",
//               date: "$date",
//             },
//           },
//         },
//       },

//       {
//         $project: {
//           _id: 0,
//           date: "$_id",
//           data: 1,
//         },
//       },

//       { $sort: { date: -1 } },
//     ]);

//     if (!result || result.length === 0) {
//       return res
//         .status(404)
//         .send({ message: "No data found for selected range" });
//     }

//     res.status(200).send({
//       message: "Report generated successfully",
//       result,
//     });
//   } catch (error) {
//     console.error("Report Error:", error);
//     res.status(500).send({
//       message: "Failed to generate report",
//       error: error.message,
//     });
//   }
// };

// const getReport = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     const start = new Date(startDate);
//     const end = new Date(new Date(endDate).setHours(23, 59, 59, 999));

//     const result = await Expense.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: start, $lte: end },
//         },
//       },

//       {
//         $addFields: {
//           date: {
//             $dateToString: {
//               format: "%Y-%m-%d",
//               date: "$createdAt",
//             },
//           },
//         },
//       },

//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "userData",
//         },
//       },

//       { $unwind: "$userData" },

//       {
//         $group: {
//           _id: "$date",
//           data: {
//             $push: {
//               _id: "$_id",
//               title: "$title",
//               description: "$description",
//               amount: "$amount",
//               type: "$type",
//               userId: "$userId",
//               userName: "$userData.name",
//               createdAt: "$createdAt",
//               date: "$date",
//             },
//           },
//         },
//       },

//       {
//         $project: {
//           _id: 0,
//           date: "$_id",
//           data: 1,
//         },
//       },

//       { $sort: { date: -1 } },
//     ]);

//     let totalIncome = 0;
//     let totalExpense = 0;

//     result.forEach((day) => {
//       day.data.forEach((item) => {
//         if (item.type === "income") totalIncome += item.amount;
//         if (item.type === "expense") totalExpense += item.amount;
//       });
//     });

//     const netBalance = totalIncome - totalExpense;

//     if (!result || result.length === 0) {
//       return res
//         .status(404)
//         .send({ message: "No data found for selected range" });
//     }

//     res.status(200).send({
//       message: "Report generated successfully",
//       totalIncome,
//       totalExpense,
//       netBalance,
//       report: result,
//     });
//   } catch (error) {
//     console.error("Report Error:", error);
//     res.status(500).send({
//       message: "Failed to generate report",
//       error: error.message,
//     });
//   }
// };

const getReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.userId;

    if (!startDate || !endDate) {
      return res.status(400).send({ message: "Start and End date required" });
    }

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    const result = await Expense.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },

      {
        $addFields: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "usersInfo",
        },
      },

      { $unwind: "$usersInfo" },

      {
        $group: {
          _id: "$date",
          date: { $first: "$date" },
          type: { $first: "$type" },
          data: {
            $push: {
              _id: "$_id",
              title: "$title",
              description: "$description",
              amount: "$amount",
              type: "$type",
              userId: "$userId",
              username: "$usersInfo.username",
              createdAt: "$createdAt",
              date: "$date",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          data: 1,
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    if (!result || result.length === 0) {
      return res
        .status(404)
        .send({ message: "No data found for selected range" });
    }

    res.send(result);
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
  getHomeExpense,
};
