/** @format */

const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  createPost,
  getSinglePost,
  getUserPost,
  updatePost,
  deletePost,
} = require("../controllers/postsController");
const isAuthenticated = require("../middleware/authMiddleware");

router.get("/", getAllPosts);
router.post("/", isAuthenticated, createPost);
router.get("/user", isAuthenticated, getUserPost);
router.get("/:id", isAuthenticated, getSinglePost);
router.patch("/:id", isAuthenticated, updatePost);
router.delete("/:id", isAuthenticated, deletePost);

module.exports = router;
