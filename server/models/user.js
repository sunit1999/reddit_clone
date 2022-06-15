module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.associate = ({ PostVote, CommentVote, Post, Subreddit, Comment }) => {
    User.hasMany(Post, {
      as: "author",
      foreignKey: { name: "authorId", allowNull: false },
      onDelete: "CASCADE",
    });
    User.hasMany(Subreddit, {
      as: "creator",
      foreignKey: { name: "creatorId", allowNull: false },
      onDelete: "CASCADE",
    });
    User.hasMany(Comment, {
      as: "commenter",
      foreignKey: { name: "commenterId", allowNull: false },
      onDelete: "CASCADE",
    });
    User.belongsToMany(Post, {
      through: PostVote,
      foreignKey: "voterId",
      otherKey: "postId",
    });
    User.belongsToMany(Comment, {
      through: CommentVote,
      foreignKey: "voterId",
      otherKey: "commentId",
    });
    User.belongsToMany(Subreddit, {
      through: "SubredditMember",
      foreignKey: "memberId",
      otherKey: "subredditId",
    });
  };

  return User;
};
