const { checkSchema, check } = require("express-validator");

const loginCheck = checkSchema({
  email: {
    in: "body",
    errorMessage: "Invalid email or password",
    isEmail: true,
    normalizeEmail: true,
  },
});

const signupCheck = checkSchema({
  username: {
    in: "body",
    isAlphanumeric: {
      errorMessage: "Username must be alphanumeric",
    },
    isLength: {
      errorMessage: "Username should be 3 to 20 chars long",
      options: { min: 3, max: 20 },
    },
    isEmpty: false,
    trim: true,
  },
  firstname: {
    in: "body",
    isAlpha: {
      errorMessage: "Firstname must contain only alphabets",
    },
    isLength: {
      errorMessage: "Firstname should be 3 to 20 chars long",
      options: { min: 3, max: 20 },
    },
    isEmpty: false,
    trim: true,
  },
  lastname: {
    in: "body",
    optional: true,
    isAlpha: {
      errorMessage: "Lastname must contain only alphabets",
    },
    isLength: {
      errorMessage: "Lastname should be 3 to 20 chars long",
      options: { min: 3, max: 20 },
    },
    trim: true,
  },
  email: {
    in: "body",
    isEmpty: false,
    isEmail: true,
    errorMessage: "Invalid Email",
    normalizeEmail: true,
  },
  password: {
    in: "body",
    isAscii: true,
    isLength: {
      errorMessage: "Password should be 3 to 20 chars long",
      options: { min: 3, max: 20 },
    },
  },
});

const createVoteCheck = checkSchema({
  commentId: {
    in: "body",
    isNumeric: true,
  },
  value: {
    in: "body",
    isNumeric: true,
  },
});

const deleteVoteCheck = checkSchema({
  commentId: {
    in: "body",
    isNumeric: true,
  },
});

const topLevelCommentsCheck = checkSchema({
  postId: {
    in: "params",
    isNumeric: true,
  },
  page: {
    in: "query",
    isNumeric: true,
  },
  limit: {
    in: "query",
    isNumeric: true,
  },
  sortBy: {
    in: "query",
    isAlpha: true,
  },
});

const repliesCheck = checkSchema({
  parentCommentId: {
    in: "params",
    isNumeric: true,
  },
});

const createCommentCheck = checkSchema({
  postId: {
    in: "body",
    isNumeric: true,
  },
  parentCommentId: {
    in: "body",
    isNumeric: true,
    optional: true,
  },
  content: {
    in: "body",
    trim: true,
    isEmpty: false,
  },
});

const updateCommentCheck = checkSchema({
  commentId: {
    in: "body",
    isNumeric: true,
  },
  content: {
    in: "body",
    isEmpty: false,
    trim: true,
  },
});

const deleteCommentCheck = checkSchema({
  commentId: {
    in: "body",
    isNumeric: true,
  },
});

const createPostVoteCheck = checkSchema({
  postId: {
    in: "body",
    isNumeric: true,
  },
  value: {
    in: "body",
    isNumeric: true,
  },
});

const deletePostVoteCheck = checkSchema({
  postId: {
    in: "body",
    isNumeric: true,
  },
});

const allPostsCheck = checkSchema({
  page: {
    in: "query",
    isNumeric: true,
  },
  limit: {
    in: "query",
    isNumeric: true,
  },
  sortBy: {
    in: "query",
    isAlpha: true,
  },
});

const subredditPostsCheck = checkSchema({
  subredditId: {
    in: "params",
    isNumeric: true,
  },
  page: {
    in: "query",
    isNumeric: true,
  },
  limit: {
    in: "query",
    isNumeric: true,
  },
  sortBy: {
    in: "query",
    isAlpha: true,
  },
});

const postCheck = checkSchema({
  postId: {
    in: "params",
    isNumeric: true,
  },
});

const createPostCheck = checkSchema({
  subredditId: {
    in: "body",
    isNumeric: true,
  },
  title: {
    in: "body",
    isAlphanumeric: true,
    isEmpty: false,
    isLength: { min: 1, max: 100 },
    trim: true,
  },
  content: {
    in: "body",
    trim: true,
  },
});

const updatePostCheck = checkSchema({
  postId: {
    in: "params",
    isNumeric: true,
  },
  title: {
    in: "body",
    isAlphanumeric: true,
    isEmpty: false,
    isLength: { min: 1, max: 100 },
    trim: true,
  },
  content: {
    in: "body",
    trim: true,
  },
});

const deletePostCheck = checkSchema({
  postId: {
    in: "params",
    isNumeric: true,
  },
});

const createSubredditCheck = checkSchema({
  name: {
    in: "body",
    isAlphanumeric: true,
    isLength: { min: 1, max: 20 },
    isEmpty: false,
    trim: true,
  },
  description: {
    in: "body",
    isAlphanumeric: true,
    isLength: { max: 200 },
    isEmpty: true,
    trim: true,
  },
});

const subredditCheck = checkSchema({
  subredditId: {
    in: "params",
    isNumeric: true,
  },
});

const allSubredditCheck = checkSchema({
  name: {
    in: "body",
    isAlphanumeric: true,
    isLength: { min: 1, max: 20 },
    isEmpty: false,
    trim: true,
    optional: true,
  },
  page: {
    in: "query",
    isNumeric: true,
  },
  limit: {
    in: "query",
    isNumeric: true,
  },
  sortBy: {
    in: "query",
    isAlpha: true,
  },
});

const updateSubredditCheck = checkSchema({
  subredditId: {
    in: "params",
    isNumeric: true,
  },
  name: {
    in: "body",
    isAlphanumeric: true,
    isLength: { min: 1, max: 20 },
    isEmpty: false,
    trim: true,
  },
  description: {
    in: "body",
    isAlphanumeric: true,
    isLength: { max: 200 },
    isEmpty: true,
    trim: true,
  },
});

module.exports = {
  loginCheck,
  signupCheck,
  createVoteCheck,
  deleteVoteCheck,
  topLevelCommentsCheck,
  repliesCheck,
  createCommentCheck,
  updateCommentCheck,
  deleteCommentCheck,
  createPostVoteCheck,
  deletePostVoteCheck,
  allPostsCheck,
  subredditPostsCheck,
  postCheck,
  createPostCheck,
  updatePostCheck,
  deletePostCheck,
  createSubredditCheck,
  subredditCheck,
  allSubredditCheck,
  updateSubredditCheck,
};
