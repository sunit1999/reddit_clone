const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/errorHandler");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  if (!req.get("Authorization")) {
    const error = new Error("Authorization failed");
    error.statusCode = 401;
    throw error;
  }

  const jwt_token = req.get("Authorization").split(" ")[1];

  try {
    const decodedToken = jwt.verify(jwt_token, JWT_SECRET);
    console.log("decodedToken", decodedToken);
    
    req.userId = decodedToken.userId;
  } catch (err) {
    errorHandler(err, next);
  }

  next();
};
