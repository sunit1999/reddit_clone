const express = require("express");
const router = express.Router();

const { createOrUpdateVote, deleteVote } = require("../controllers/post_vote");
const {
  createPostVoteCheck,
  deletePostVoteCheck,
} = require("../middlewares/checkSchema");
const isAuth = require("../middlewares/is-auth");
const isPost = require("../middlewares/isPost");
const { validateReq } = require("../middlewares/validate");

// "/api/v1/votes/post"
router.post(
  "/",
  createPostVoteCheck,
  validateReq,
  isAuth,
  isPost,
  createOrUpdateVote
);
router.delete("/", deletePostVoteCheck, validateReq, isAuth, deleteVote);

module.exports = router;
