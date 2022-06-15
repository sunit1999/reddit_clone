const { sequelize, Sequelize } = require("../models");
const errorHandler = require("../utils/errorHandler");

exports.getTopLevelComments = async (req, res, next) => {
  const { postId } = req.params;
  const voterId = req.userId || 0;
  const { page, limit, sortBy } = req.query;
  const offset = (page - 1) * limit;

  try {
    const comments = await sequelize.models.Comment.findAll({
      subQuery: false,
      where: {
        postId,
        parentCommentId: null,
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
      ],
      order: [[sortBy, "DESC"]],
      offset,
      limit: parseInt(limit),
    });

    const count = await sequelize.models.Comment.count({
      where: {
        postId,
        parentCommentId: null,
      },
    });

    res.status(200).json({ count, comments });
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.getReplies = async (req, res, next) => {
  const { parentCommentId } = req.params;
  const voterId = req.userId || 0;

  try {
    const comments = await sequelize.models.Comment.findAll({
      where: {
        parentCommentId,
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
      ],
    });

    res.status(200).json(comments);
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.createComment = async (req, res, next) => {
  const commenterId = req.userId;
  const { content, postId, parentCommentId } = req.body;

  try {
    const result = await sequelize.models.Comment.create({
      content,
      commenterId,
      postId,
      parentCommentId,
    });

    const newComment = await sequelize.models.Comment.findOne({
      where: {
        commentId: result.commentId,
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
            where: { voterId: commenterId },
          },
        },
        {
          model: sequelize.models.User,
          as: "commenter",
          attributes: ["userId", "username"],
        },
      ],
    });

    res.status(201).json(newComment);
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.updateComment = async (req, res, next) => {
  const commenterId = req.userId;
  const { commentId } = req.params;
  const { content } = req.body;
  try {
    const comment = await sequelize.models.Comment.findOne({
      where: {
        commentId,
        commenterId,
      },
    });

    if (!comment) {
      const error = new Error("Not Found");
      error.statusCode = 404;
      throw error;
    }

    const rows = await sequelize.models.Comment.update(
      {
        content,
      },
      {
        where: {
          commentId,
        },
      }
    );

    res.status(200).json(rows);
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.deleteComment = async (req, res, next) => {
  const commenterId = req.userId;
  const { commentId } = req.params;
  try {
    const comment = await sequelize.models.Comment.findOne({
      where: {
        commentId,
        commenterId,
      },
    });

    if (!comment) {
      const error = new Error("Not Found");
      error.statusCode = 404;
      throw error;
    }

    const result = await comment.destroy();

    res.status(200).json(result);
  } catch (error) {
    errorHandler(error, next);
  }
};