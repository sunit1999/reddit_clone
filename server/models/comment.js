const updateReplies = require("../utils/triggers/updateReplies");

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    commentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    totalVotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    totalReplies: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  });

  Comment.associate = ({ CommentVote, User, Post }) => {
    Comment.belongsToMany(User, {
      through: CommentVote,
      foreignKey: "commentId",
      otherKey: "voterId",
    });
    Comment.belongsTo(User, {
      as: "commenter",
      foreignKey: { name: "commenterId", allowNull: false },
      onDelete: "CASCADE",
    });
    Comment.belongsTo(Post, {
      foreignKey: { name: "postId", allowNull: false },
      onDelete: "CASCADE",
    });
    Comment.hasOne(Comment, {
      foreignKey: { name: "parentCommentId" },
    });
  };

  Comment.afterCreate((instance, options) => {
    updateReplies(instance, options, sequelize);
  });

  Comment.afterDestroy((instance, options) => {
    updateReplies(instance, options, sequelize);
  });

  return Comment;
};
