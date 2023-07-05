/** @format */

const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

const getAllPosts = async (req, res) => {
  const posts = await Post.find({}).populate("createdBy", ["username"]);
  console.log(posts);
  // const user = await User.findOne({})
  res.status(200).json({ posts, postsCount: posts.length });
};

// =================================

const getSinglePost = async (req, res, next) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  const post = await Post.findOne({ _id: postId, createdBy: userId });

  if (!post) {
    const error = new Error(
      `No Post with ${postId} created by the current user`
    );
    console.log(error.message);
    return next(error);
  }

  res.status(200).json({ post });
};

// ========================================

const updatePost = async (req, res, next) => {
  const {
    body: { title, tags, story },
    user: { userId },
    params: { id: postId },
  } = req;
  if (title === "" || tags === "" || story === "") {
    const err = new Error("title, tags or story cannot be empty");
    err.statusCode = 400;
    throw err;
  }
  try {
    const post = await Post.findByIdAndUpdate(
      { _id: postId, createdBy: userId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!post) {
      const error = new Error(
        `No Post with ${postId} created by the current user`
      );
      error.statusCode = 400;
      return next(error);
    }
    res.status(200).json({ message: "Post Updated Successfully!", post });
  } catch (error) {
    const { errors } = error;
    const errArray = [];
    if (errors && errors.story) {
      errArray.push(errors.story.message);
    }
    if (errors && errors.title) {
      errArray.push(errors.title.message);
    }
    if (errors && errors.tags) {
      errArray.push(errors.tags.message);
    }
    error.message = errArray;
    error.statusCode = 400;
    return next(error);
  }
};

// ========================================

const createPost = async (req, res, next) => {
  req.body.createdBy = req.user.userId;
 
  try {
    // const {secure_url} = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    //   use_filename: true,
    //   folder: "positimages",
    // });
    // req.body.image = secure_url
    const post = await Post.create({ ...req.body });
    res.status(201).json({ message: "Post Created Successfully!", post });
  } catch (error) {
    const { errors } = error;
    const errorArray = [];
    if (errors && errors.title) {
      errorArray.push(errors.title.message);
    }
    if (errors && errors.tags) {
      errorArray.push(errors.tags.message);
    }
    if (errors && errors.story) {
      errorArray.push(errors.story.message);
    }
    error.message = errorArray;
    error.statusCode = 400;
    next(error);
  }
};

// =======================================

const deletePost = async (req, res, next) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  const post = await Post.findByIdAndRemove({
    _id: postId,
    createdBy: userId,
  });
  if (!post) {
    const error = new Error(
      `No Post with ${postId} created by the current user`
    );
    error.statusCode = 400;
    return next(error);
  }
  res.status(200).json({ message: "Post Deleted Successfully!" });
};

// ========================================

const getUserPost = async (req, res, next) => {
  const posts = await Post.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(200).json({ posts, postsCount: posts.length });
};

module.exports = {
  getAllPosts,
  getSinglePost,
  updatePost,
  createPost,
  deletePost,
  getUserPost,
};
