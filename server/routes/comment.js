const express = require("express");
const router = express.Router();

const {
  createComment,
  updateComment,
  getTopLevelComments,
  deleteComment,
  getReplies,
} = require("../controllers/comment");
const isAuth = require("../middlewares/is-auth");
const isPost = require("../middlewares/isPost");
const getUser = require("../middlewares/getUser");
const {
  topLevelCommentsCheck,
  repliesCheck,
  createCommentCheck,
  updateCommentCheck,
  deleteCommentCheck,
} = require("../middlewares/checkSchema");
const { validateReq } = require("../middlewares/validate");

// "/api/v1/comments"
router.get(
  "/replies/:parentCommentId(\\d+)",
  repliesCheck,
  validateReq,
  getUser,
  getReplies
);
router.get(
  "/:postId(\\d+)",
  topLevelCommentsCheck,
  validateReq,
  getUser,
  isPost,
  getTopLevelComments
);
router.post(
  "/",
  createCommentCheck,
  validateReq,
  isAuth,
  isPost,
  createComment
);
router.put(
  "/:commentId(\\d+)",
  updateCommentCheck,
  validateReq,
  isAuth,
  updateComment
);
router.delete(
  "/:commentId(\\d+)",
  deleteCommentCheck,
  validateReq,
  isAuth,
  deleteComment
);

module.exports = router;
