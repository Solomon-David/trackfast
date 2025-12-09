import bcrypt from "bcryptjs";

/**
 * hashPassword - hashes a plaintext password
 * @param {string} password - plain text password
 * @returns {Promise<string>} hashed password
 */
export const hashPassword = async (password) => {
  if (!password) throw new Error("Password is required for hashing");
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

/**
 * comparePassword - compares a plain password with a hash
 * @param {string} password - plain text password
 * @param {string} hash - hashed password from DB
 * @returns {Promise<boolean>} true if match
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
