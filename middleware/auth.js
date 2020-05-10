// middleware is just a function that access to the request and response cycle and object
// with each request we want to see if there's a token in the header

const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get the token form header
  const token = req.header("x-auth-token");

  // Check if not token exists
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    //req.user would be the id of user which is in the payload
    req.user = decoded.user;

    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
