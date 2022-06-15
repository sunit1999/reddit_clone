const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/errorHandler");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  if (req.get("Authorization")) {
    const jwt_token = req.get("Authorization").split(" ")[1];
    try {
      const decodedToken = jwt.verify(jwt_token, JWT_SECRET);
      console.log("decodedToken", decodedToken);

      req.userId = decodedToken.userId;
    } catch (err) {
      console.log(err);
    }
  }

  next();
};
