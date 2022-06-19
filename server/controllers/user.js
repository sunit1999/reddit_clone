const { sequelize, Sequelize } = require("../models");
const errorHandler = require("../utils/errorHandler");

exports.getUsersPosts = async (req, res, next) => {
  const { authorId } = req.params;
  const voterId = req.userId || 0;
  const { page, limit, sortBy } = req.query;
  const offset = (page - 1) * limit;

  try {
    const user = await sequelize.models.User.findOne({
      where: {
        userId: authorId,
      },
    });

    if (!user) {
      const error = new Error("Not Found");
      error.statusCode = 404;
      throw error;
    }

    const posts = await sequelize.models.Post.findAll({
      subQuery: false,
      where: {
        authorId,
      },
      attributes: {
        include: [[Sequelize.fn("MAX", Sequelize.col("value")), "hasVoted"]],
      },
      group: ["postId"],
      include: [
        {
          model: sequelize.models.User,
          as: "author",
          attributes: ["userId", "username"],
        },
        {
          model: sequelize.models.User,
          attributes: [],
          through: {
            where: { voterId },
          },
        },
        {
          model: sequelize.models.Subreddit,
        },
      ],
      order: [[sortBy, "DESC"]],
      offset,
      limit: parseInt(limit),
    });

    const count = await sequelize.models.Post.count({ where: { authorId } });

    res.status(200).json({ count, posts });
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.getUsersComments = async (req, res, next) => {
  const { commenterId } = req.params;
  const voterId = req.userId || 0;
  const { page, limit, sortBy } = req.query;
  const offset = (page - 1) * limit;

  try {
    const comments = await sequelize.models.Comment.findAll({
      subQuery: false,
      where: {
        commenterId,
      },
      attributes: {
        include: [[Sequelize.fn("MAX", Sequelize.col("value")), "hasVoted"]],
      },
      group: ["commentId"],
      include: [
        {
          model: sequelize.models.User,
          attributes: [],
          through: {
            where: { voterId },
          },
        },
        {
          model: sequelize.models.User,
          as: "commenter",
          attributes: ["userId", "username"],
        },
        {
          model: sequelize.models.Post,
        },
      ],
      order: [[sortBy, "DESC"]],
      offset,
      limit: parseInt(limit),
    });

    const count = await sequelize.models.Comment.count({
      where: { commenterId },
    });

    res.status(200).json({ count, comments });
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.getUsersLikedPosts = async (req, res, next) => {};

exports.getUsersProfile = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await sequelize.models.User.findOne({
      where: {
        userId,
      },
      attributes: { exclude: ["password", "updatedAt"] },
    });

    if (!user) {
      const error = new Error("Not Found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(user);
  } catch (error) {
    errorHandler(error, next);
  }
};
