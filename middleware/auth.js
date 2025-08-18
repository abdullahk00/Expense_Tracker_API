const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
  const authHeader =
    req.headers?.["authorization"] || req.headers?.["Authorization"];

  if (!authHeader)
    return res.status(401).send({ message: "Unauthorized access" });

  let token = authHeader?.split(" ")?.[1];
  if (!token) return res.status(401).send({ message: "Unauthorized access" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};

module.exports = { authorize };
