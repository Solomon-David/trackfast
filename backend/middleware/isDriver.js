// backend/middleware/isDriver.js

export const driverOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "driver") {
    return res.status(403).json({ message: "Drivers only." });
  }
  next();
};
