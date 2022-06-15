const express = require("express");
const router = express.Router();

const {
  getAllSubreddits,
  getSubreddit,
  updateSubreddit,
  createSubreddit,
} = require("../controllers/subreddit");
const { getAllPostsInSubreddit } = require("../controllers/post");
const isAuth = require("../middlewares/is-auth");
const getUser = require("../middlewares/getUser");
const { validateReq } = require("../middlewares/validate");
const {
  allSubredditCheck,
  subredditCheck,
  updateSubredditCheck,
  createSubredditCheck,
} = require("../middlewares/checkSchema");

// "api/v1/subreddit"
router.get(
  "/:subredditId(\\d+)/posts",
  allSubredditCheck,
  validateReq,
  getUser,
  getAllPostsInSubreddit
);
router.get("/:subredditId(\\d+)", subredditCheck, validateReq, getSubreddit);
router.put(
  "/:subredditId(\\d+)",
  updateSubredditCheck,
  validateReq,
  isAuth,
  updateSubreddit
);
router.post("/", createSubredditCheck, validateReq, isAuth, createSubreddit);
router.get("/", allSubredditCheck, validateReq, getAllSubreddits);

module.exports = router;
