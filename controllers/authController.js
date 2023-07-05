/** @format */

const User = require("../models/User");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    const error = new Error("Please provide a username, email and password");
    error.statusCode = 400;
    return next(error);
  }
  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash(password, salt);
  //   const tempUser = { username, email, password: hashedPassword };
  try {
    const user = await User.create({ ...req.body });
    // const token = jwt.sign({ userId: user._id, name: user.name }, "jwtsecret", {
    //   expiresIn: "30d",
    // });
    const token = user.createJWT();
    res.status(201).json({ user: { username: user.username }, token });
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error("Please provide a username and password");
    error.statusCode = 400;
    return next(error);
  }
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid Credentials");
    error.statusCode = 401;
    return next(error);
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    const error = new Error("Invalid Credentials");
    error.statusCode = 401;
    return next(error);
  }

  const token = user.createJWT();

  res.status(200).json({ user: { username: user.username }, token });
};

const authHome = async (req, res) => {
  res.status(200).json({ mg: "no resource here" });
};

const getUserDetails = async (req, res) => {
  const {
    user: { userId },
  } = req;

  const currentUser = await User.findOne({ _id: userId });

  res.status(200).json({
    user: { username: currentUser.username, email: currentUser.email },
  });
};

module.exports = {
  registerUser,
  loginUser,
  authHome,
  getUserDetails,
};
