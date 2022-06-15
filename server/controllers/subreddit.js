const { sequelize, Sequelize } = require("../models");
const errorHandler = require("../utils/errorHandler");
const { Op } = Sequelize;

exports.createSubreddit = async (req, res, next) => {
  const { name, description } = req.body;
  const userId = req.userId;

  try {
    const subreddit = await sequelize.models.Subreddit.findOne({
      where: {
        name,
      },
    });

    if (subreddit) {
      const error = new Error("Subreddit already exists");
      error.statusCode = 409;
      throw error;
    }

    const newSubreddit = await sequelize.models.Subreddit.create({
      name,
      description,
      totalMembers: 1,
      creatorId: userId,
    });

    await sequelize.models.SubredditMember.create({
      subredditId: newSubreddit.subredditId,
      memberId: userId,
    });

    res.status(201).json(newSubreddit);
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.getSubreddit = async (req, res, next) => {
  const { subredditId } = req.params;
  try {
    const subreddit = await sequelize.models.Subreddit.findOne({
      where: {
        subredditId,
      },
      include: [
        {
          model: sequelize.models.User,
          as: "creator",
          attributes: ["userId", "username"],
        },
      ],
    });

    if (!subreddit) {
      const error = new Error("Not Found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(subreddit);
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.getAllSubreddits = async (req, res, next) => {
  const name = req.query.name;
  const { page, limit, sortBy } = req.query;
  const offset = (page - 1) * limit;
  const whereOpts = {};

  if (name) {
    whereOpts.name = {
      [Op.startsWith]: name,
    };
    // console.log(whereOpts);
  }

  try {
    const subreddits = await sequelize.models.Subreddit.findAll({
      subQuery: false,
      where: whereOpts,
      include: [
        {
          model: sequelize.models.User,
          as: "creator",
          attributes: ["userId", "username"],
        },
      ],
      order: [[sortBy, "DESC"]],
      offset,
      limit: parseInt(limit),
    });
    res.status(200).json(subreddits);
  } catch (error) {
    errorHandler(error, next);
  }
};

exports.updateSubreddit = async (req, res, next) => {
  const userId = req.userId;
  const { subredditId } = req.params;
  const { name, description } = req.body;

  try {
    const subreddit = await sequelize.models.Subreddit.findOne({
      where: {
        subredditId,
        creatorId: userId,
      },
    });

    if (!subreddit) {
      const error = new Error("Not Found");
      error.statusCode = 404;
      throw error;
    }

    const rows = await sequelize.models.Subreddit.update(
      {
        name,
        description,
      },
      {
        where: {
          subredditId,
        },
      }
    );

    res.status(201).json(rows);
  } catch (error) {
    errorHandler(error, next);
  }
};
