module.exports = (sequelize, DataTypes) => {
  const Subreddit = sequelize.define("Subreddit", {
    subredditId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "No description",
    },
    totalMembers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });

  Subreddit.associate = ({ User, Post }) => {
    Subreddit.belongsTo(User, {
      as: "creator",
      foreignKey: { name: "creatorId", allowNull: false },
      onDelete: "CASCADE",
    });
    Subreddit.belongsToMany(User, {
      through: "SubredditMember",
      foreignKey: "subredditId",
      otherKey: "memberId",
    });
    Subreddit.hasMany(Post, {
      foreignKey: { name: "subredditId", allowNull: false },
      onDelete: "CASCADE",
    });
  };
  return Subreddit;
};
