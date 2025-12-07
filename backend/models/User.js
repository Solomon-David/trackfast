import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["customer", "staff", "admin"],
      default: "customer",
    },

    // For Staff Only
    staffPosition: {
      type: String,
      enum: ["warehouse", "driver", "support", "manager", null],
      default: null,
    },

    //For verification
    verified: {
      type: Boolean,
      default: false,
    },

    verificationCode: {
      type: String,
      default: null,
    },

    verificationExpires: {
      type: Date,
      default: null,
    },

  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
