const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/auth");
const { loginCheck, signupCheck } = require("../middlewares/checkSchema");
const { validateReq } = require("../middlewares/validate");

// "/api/v1/auth"
router.post("/signup", signupCheck, validateReq, signup);
router.post("/login", loginCheck, validateReq, login);

module.exports = router;
