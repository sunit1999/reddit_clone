const express = require("express");
const router = express.Router();

const {
  getUsersPosts,
  getUsersComments,
  getUsersProfile,
} = require("../controllers/user");
const isAuth = require("../middlewares/is-auth");

router.get("/:authorId(\\d+)/posts", isAuth, getUsersPosts);
router.get("/:commenterId(\\d+)/comments", isAuth, getUsersComments);
router.get("/:userId(\\d+)", isAuth, getUsersProfile);

module.exports = router;
