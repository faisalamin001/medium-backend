const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = async (req, res, next) => {
  const bearerToken = req.header("Authorization");
  const token = bearerToken.split(" ")[1];
  const secret = config.get("signIn.jwtSecret");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, secret);

    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
