const { sequelize } = require("../models");
const errorHandler = require("../utils/errorHandler");

exports.createOrUpdateVote = async (req, res, next) => {
  const voterId = req.userId;
  const { postId, value } = req.body;
  try {
    const rows = await sequelize.models.PostVote.upsert({
      postId,
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
  const { postId } = req.body;
  try {
    const postVote = await sequelize.models.PostVote.findOne({
      where: {
        postId,
        voterId,
      },
    });

    if (!postVote) {
      const error = new Error("Not Found");
      error.statusCode = 404;
      throw error;
    }

    const destroyedVote = await postVote.destroy();
    res.status(200).json(destroyedVote);
  } catch (error) {
    errorHandler(error, next);
  }
};
