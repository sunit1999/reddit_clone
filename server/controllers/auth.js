const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { sequelize } = require("../models");
const errorHandler = require("../utils/errorHandler");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY;

exports.signup = async (req, res, next) => {
  const { username, firstname, lastname, email, password } = req.body;

  try {
    const user = await sequelize.models.User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (user) {
      const error = new Error("Email or username already exists");
      error.statusCode = 401;
      throw error;
    }

    const hashedpwd = await bcryptjs.hash(password, 8);
    const newUser = await sequelize.models.User.create({
      username,
      firstname,
      lastname,
      email,
      password: hashedpwd,
    });

    res.status(201).json(newUser);
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await sequelize.models.User.findOne({
      where: {
        email,
      },
      attributes: ["userId", "username", "password"],
    });

    if (!result) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const isValid = await bcryptjs.compare(password, result.password);

    if (!isValid) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const user = { userId: result.userId, username: result.username };

    jwt.sign(
      user,
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRY,
      },
      (err, token) => {
        if (err) {
          const error = new Error("Some error occurred");
          error.statusCode = 401;
          throw error;
        }
        res.status(201).json({ user, token });
      }
    );
  } catch (error) {
    errorHandler(error, next);
  }
};
