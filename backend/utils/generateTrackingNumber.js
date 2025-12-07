// Generates a unique alphanumeric tracking number
export const generateTrackingNumber = () => {
  const prefix = "TF"; // Track Fast prefix
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
  return `${prefix}-${random}-${timestamp}`;
};
