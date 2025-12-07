// backend/middleware/roleMiddleware.js

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};

export const staffOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "staff") {
    return res.status(403).json({ message: "Staff only" });
  }
  next();
};

export const staffOrAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== "staff" && req.user.role !== "admin")) {
    return res.status(403).json({ message: "Staff or Admin access only" });
  }
  next();
};
