import jwt from "jsonwebtoken";

/**
 * Generate JWT for a regular user (customer)
 * @param {Object} user - Mongoose User document
 * @returns {string} JWT token
 */
export const generateUserToken = (user) => {
  return jwt.sign(
    { id: user._id, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // token valid for 7 days
  );
};

/**
 * Generate JWT for staff or admin
 * @param {Object} staff - Mongoose User document
 * @returns {string} JWT token
 */
export const generateStaffToken = (staff) => {
  return jwt.sign(
    { id: staff._id, role: staff.role }, // role should be "staff" or "admin"
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
