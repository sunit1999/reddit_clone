const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const CommentVote = sequelize.define("CommentVote", {
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[-1, 0, 1]],
      },
    },
  });

  CommentVote.associate = () => {};

  CommentVote.afterUpsert(async (instance, options) => {
    const { commentId } = instance[0];

    try {
      const totalVotes = await sequelize.models.CommentVote.sum("value", {
        where: {
          commentId,
        },
      });

      await sequelize.models.Comment.update(
        {
          totalVotes,
        },
        {
          where: {
            commentId,
          },
        }
      );
      
    } catch (error) {
      console.log(error);
    }
  });

  return CommentVote;
};
