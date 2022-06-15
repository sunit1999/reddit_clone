const express = require("express");
const router = express.Router();

const {
  createOrUpdateVote,
  deleteVote,
} = require("../controllers/comment_vote");

const {
  createVoteCheck,
  deleteVoteCheck,
} = require("../middlewares/checkSchema");

const isAuth = require("../middlewares/is-auth");
const { validateReq } = require("../middlewares/validate");

// "/api/v1/votes/comment"
router.post("/", isAuth, createVoteCheck, validateReq, createOrUpdateVote);
router.delete("/", isAuth, deleteVoteCheck, validateReq, deleteVote);

module.exports = router;
