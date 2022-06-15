const Sequelize = require("sequelize");
const errorHandler = require("../utils/errorHandler");

module.exports = (sequelize, DataTypes) => {
  const PostVote = sequelize.define("PostVote", {
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[-1, 0, 1]],
      },
    },
  });

  PostVote.associate = () => {};

  PostVote.afterUpsert(async (instance, options) => {
    const { postId } = instance[0];

    try {
      const totalVotes = await sequelize.models.PostVote.sum("value", {
        where: {
          postId,
        },
      });

      await sequelize.models.Post.update(
        {
          totalVotes,
        },
        {
          where: {
            postId,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  });

  return PostVote;
};
