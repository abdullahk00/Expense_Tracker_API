const express = require("express");
const {
  register,
  login,
  setAccountBalance,
  getMyProfile,
  refreshToken,
} = require("../controller/userController.js");
const { authorize } = require("../middleware/auth.js");
const upload = require("../middleware/upload.js");
const { uploadProfilePic } = require("../middleware/upload");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.patch("/set-balance/:id", authorize, setAccountBalance);
router.get("/me", authorize, getMyProfile);
router.post("/upload-profile", uploadProfilePic, (req, res) => {
  res.json({
    message: "File uploaded successfully",
    file: req.file,
  });
});

module.exports = router;
