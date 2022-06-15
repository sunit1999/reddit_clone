const { sequelize } = require("../models");
const errorHandler = require("../utils/errorHandler");

exports.createOrUpdateVote = async (req, res, next) => {
  const voterId = req.userId;
  const { commentId, value } = req.body;
  try {
    const comment = await sequelize.models.Comment.findOne({
      where: {
        commentId,
      },
    });

    if (!comment) {
      const error = new Error("Not Found");
      error.statusCode = 404;
      throw error;
    }

    const rows = await sequelize.models.CommentVote.upsert({
      commentId,
      voterId,
      value,
    });

    res.status(201).json(rows);
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.deleteVote = async (req, res, next) => {
  const voterId = req.userId;
  const { commentId } = req.body;
  try {
    const commentVote = await sequelize.models.CommentVote.findOne({
      where: {
        commentId,
        voterId,
      },
    });

    if (!commentVote) {
      const error = new Error("Not Found");
      error.statusCode = 404;
      throw error;
    }

    const destroyedVote = await commentVote.destroy();
    res.status(200).json(destroyedVote);
  } catch (error) {
    errorHandler(error, next);
  }
};