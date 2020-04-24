const jwt = require("jsonwebtoken");

const secrets = require("../secrets");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  const { JWT_SECRET } = secrets;

  if (token) {
    jwt.verify(token, JWT_SECRET, (error, decodedToken) => {
      if (error) {
        res.status(401).json({ error });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(400).json({ errorMessage: "Please provide credentials." });
  }
};
