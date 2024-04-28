const adminMiddleware = (req, res, next) => {
    if (!req.user.isAdmin) { 
      return res.status(403).json({ error: "Acesso não autorizado." });
    }
  
    next();
  };
  
  module.exports = adminMiddleware;
  