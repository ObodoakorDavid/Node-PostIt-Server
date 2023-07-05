/** @format */

const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  authHome,
  getUserDetails,
} = require("../controllers/authController");

const authenticationMiddleware = require("../middleware/authMiddleware");

router.get("/", authHome);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", authenticationMiddleware, getUserDetails);

module.exports = router;
