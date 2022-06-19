const { sequelize, Sequelize } = require("../models");
const errorHandler = require("../utils/errorHandler");

exports.getAllPosts = async (req, res, next) => {
  const voterId = req.userId || 0;
  const { page, limit, sortBy, query } = req.query;
  const offset = (page - 1) * limit;

  const whereOpts = {};

  if (query) {
    whereOpts.title = {
      [Sequelize.Op.substring]: query,
    };
  }

  try {
    const posts = await sequelize.models.Post.findAll({
      where: whereOpts,
      subQuery: false,
      attributes: {
        include: [[Sequelize.fn("MAX", Sequelize.col("value")), "hasVoted"]],
      },
      group: ["postId"],
      include: [
        {
          model: sequelize.models.User,
          as: "author",
          attributes: ["userId", "username"],
        },
        {
          model: sequelize.models.User,
          attributes: [],
          through: {
            where: { voterId },
          },
        },
        {
          model: sequelize.models.Subreddit,
        },
      ],
      order: [[sortBy, "DESC"]],
      offset,
      limit: parseInt(limit),
    });

    const count = await sequelize.models.Post.count({ where: whereOpts });

    res.status(200).json({ count, posts });
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.getAllPostsInSubreddit = async (req, res, next) => {
  const { subredditId } = req.params;
  const voterId = req.userId || 0;
  const { page, limit, sortBy } = req.query;
  const offset = (page - 1) * limit;

  try {
    const subreddit = await sequelize.models.Subreddit.findOne({
      where: {
        subredditId,
      },
    });

    if (!subreddit) {
      const error = new Error("Not Found");
      error.statusCode = 404;
      throw error;
    }

    const posts = await sequelize.models.Post.findAll({
      subQuery: false,
      where: {
        subredditId,
      },
      attributes: {
        include: [[Sequelize.fn("MAX", Sequelize.col("value")), "hasVoted"]],
      },
      group: ["postId"],
      include: [
        {
          model: sequelize.models.User,
          as: "author",
          attributes: ["userId", "username"],
        },
        {
          model: sequelize.models.User,
          attributes: [],
          through: {
            where: { voterId },
          },
        },
        {
          model: sequelize.models.Subreddit,
        },
      ],
      order: [[sortBy, "DESC"]],
      offset,
      limit: parseInt(limit),
    });

    const count = await sequelize.models.Post.count({ where: { subredditId } });

    res.status(200).json({ count, posts });
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.getPost = async (req, res, next) => {
  const { postId } = req.params;
  const voterId = req.userId || 0;

  try {
    const post = await sequelize.models.Post.findOne({
      where: {
        postId,
      },
      attributes: {
        include: [[Sequelize.fn("MAX", Sequelize.col("value")), "hasVoted"]],
      },
      group: ["postId"],
      include: [
        {
          model: sequelize.models.User,
          as: "author",
          attributes: ["userId", "username"],
        },
        {
          model: sequelize.models.User,
          attributes: [],
          through: {
            where: { voterId },
          },
        },
        {
          model: sequelize.models.Subreddit,
        },
      ],
    });

    if (!post) {
      const error = new Error("Not Found");
      error.statusCode = 404;
      throw error;
    }

    // const hasVoted = await sequelize.models.PostVote.count({
    //   where: {
    //     postId,
    //     voterId,
    //   },
    // });

    res.status(200).json({
      post,
      // hasVoted,
    });
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.createPost = async (req, res, next) => {
  const { title, content, subredditId } = req.body;
  const authorId = req.userId;

  try {
    const newPost = await sequelize.models.Post.create({
      title,
      content,
      authorId,
      subredditId,
    });

    res.status(201).json(newPost);
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.updatePost = async (req, res, next) => {
  const { title, content } = req.body;
  const { postId } = req.params;
  const authorId = req.userId;

  try {
    const post = await sequelize.models.Post.findOne({
      where: {
        postId,
        authorId,
      },
    });

    if (!post) {
      const error = new Error("Not Found");
      error.statusCode = 404;
      throw error;
    }

    const rows = await sequelize.models.Post.update(
      {
        title,
        content,
      },
      {
        where: {
          postId,
          authorId,
        },
      }
    );

    res.status(200).json(rows);
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;
  const authorId = req.userId;

  try {
    const post = await sequelize.models.Post.findOne({
      where: {
        postId,
        authorId,
      },
    });

    if (!post) {
      const error = new Error("Not Found");
      error.statusCode = 404;
      throw error;
    }

    const rows = await sequelize.models.Post.destroy({
      where: {
        postId,
        authorId,
      },
    });

    res.status(200).json(rows);
  } catch (error) {
    errorHandler(error, next);
  }
};
