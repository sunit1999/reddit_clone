const express = require("express");
const router = express.Router();

const {
  getUsersPosts,
  getUsersComments,
  getUsersProfile,
} = require("../controllers/user");
const isAuth = require("../middlewares/is-auth");

router.get("/:authorId(\\d+)/posts", getUsersPosts);
router.get("/:commenterId(\\d+)/comments", getUsersComments);
router.get("/:userId(\\d+)", getUsersProfile);

module.exports = router;
