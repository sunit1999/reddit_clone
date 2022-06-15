module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    postId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
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
    totalComments: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  });

  Post.associate = ({ PostVote, User, Comment, Subreddit }) => {
    Post.belongsToMany(User, {
      through: PostVote,
      foreignKey: "postId",
      otherKey: "voterId",
    });
    Post.hasMany(Comment, {
      foreignKey: { name: "postId", allowNull: false },
      onDelete: "CASCADE",
    });
    Post.belongsTo(User, {
      as: "author",
      foreignKey: { name: "authorId", allowNull: false },
      onDelete: "CASCADE",
    });
    Post.belongsTo(Subreddit, {
      foreignKey: { name: "subredditId", allowNull: false },
      onDelete: "CASCADE",
    });
  };

  return Post;
};
