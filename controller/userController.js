const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModal.js");
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

const register = async (req, res) => {
  try {
    const { username, email, phoneNumber, password } = req.body;

    if (!username || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    savedUser.refreshToken = refreshToken;
    await savedUser.save();

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        phoneNumber: savedUser.phoneNumber,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.refreshToken = refreshToken;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      token,
      refreshToken,
      user: userObj,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "required refresh token" });
    }

    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.refreshToken = newRefreshToken;
    await user.save();
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

const getMyProfile = async (req, res) => {
  try {
    let user = await User.findById(req?.userId);

    if (!user) return res.status(404).send({ message: "User not found" });

    let { password, ...myProfile } = user.toJSON();

    res.status(200).send(myProfile);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server Error" });
  }
};

const setAccountBalance = async (req, res) => {
  try {
    let { id } = req.params;
    let accountBalance = req.body?.accountBalance;

    if (!accountBalance)
      return res.status(400).send({ message: "Account balance is invalid" });

    const user = await User.findById(id);
    if (!user) return res.status(404).send({ message: "User not found" });

    user.accountBalance = accountBalance;

    await user.save();

    res.status(200).send({ message: "Account balance saved." });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profilePic: imageUrl },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile picture updated successfully",
      user,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  setAccountBalance,
  getMyProfile,
  uploadProfilePic,
};
