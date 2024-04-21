const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Token mal formatado." });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, "tokensupersecretobackend");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido." });
  }
};

module.exports = authMiddleware;
