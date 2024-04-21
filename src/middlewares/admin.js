const adminMiddleware = (req, res, next) => {
    if (!req.user.isAdmin) { // Presume que "isAdmin" indica se é admin
      return res.status(403).json({ error: "Acesso não autorizado." });
    }
  
    next();
  };
  
  module.exports = adminMiddleware;
  