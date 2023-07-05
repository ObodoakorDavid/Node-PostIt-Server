/** @format */

const User = require("../models/User");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("No Token Provided");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);
    req.user = { userId: payload.userId, username: payload.username };
    next();
  } catch (error) {
    const err = new Error("Invalid Token");
    err.statusCode = 401;
    throw err;
  }
};

module.exports = auth;
