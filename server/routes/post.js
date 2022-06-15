const express = require("express");
const router = express.Router();

const {
  getPost,
  updatePost,
  getAllPosts,
  deletePost,
  createPost,
} = require("../controllers/post");
const { validateReq } = require("../middlewares/validate");

const {
  postCheck,
  updatePostCheck,
  allPostsCheck,
  deletePostCheck,
  createPostCheck,
} = require("../middlewares/checkSchema");
const getUser = require("../middlewares/getUser");
const isAuth = require("../middlewares/is-auth");

// "/api/v1/posts"
router.get("/:postId(\\d+)", postCheck, validateReq, getUser, getPost);
router.put("/:postId(\\d+)", updatePostCheck, validateReq, isAuth, updatePost);
router.delete(
  "/:postId(\\d+)",
  deletePostCheck,
  validateReq,
  isAuth,
  deletePost
);
router.get("/", allPostsCheck, validateReq, getUser, getAllPosts);
router.post("/", createPostCheck, validateReq, isAuth, createPost);

module.exports = router;