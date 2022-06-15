const { sequelize } = require("../models");
const errorHandler = require("../utils/errorHandler");

module.exports = async (req, res, next) => {
  const postId = req.body.postId || req.params.postId;

  try {
    const post = await sequelize.models.Post.findOne({
      where: {
        postId,
      },
    });

    if (!post) {
      const error = new Error("Not Found");
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    errorHandler(err, next);
  }
  next();
};
