const express = require("express");
const logger = require("morgan");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

const { sequelize } = require("./models");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const subredditRouter = require("./routes/subreddit");
const postVoteRouter = require("./routes/post_vote");
const commentVoteRouter = require("./routes/comment_vote");
const commentRouter = require("./routes/comment");
const userRouter = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.REACT_URL,
  })
);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/subreddit", subredditRouter);
app.use("/api/v1/votes/post", postVoteRouter);
app.use("/api/v1/votes/comment", commentVoteRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/user", userRouter);

app.use("/", express.static(path.join(__dirname, "..", "client", "build")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

// Error Handler
app.use((err, req, res, next) => {
  console.log("oops an error - ", err);

  if (
    err.name.toLowerCase().includes("sequelize") &&
    process.env.NODE_ENV === "production"
  ) {
    err.message = "Oops Some error occured";
  }

  res.status(err.statusCode).json({ error: err.message });
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ force: true });
    console.log(`database connected`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
  });
});
