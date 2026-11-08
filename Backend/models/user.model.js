
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 1. User Identity
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must contain at least 2 characters"],
      maxlength: [80, "Full name cannot exceed 80 characters"],
    },

    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    // 2. Authentication
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false,
    },

    // 3. Authorization
    // All registered accounts are ordinary users initially.
    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },

    // 4. Account Status
    status: {
      type: String,
      enum: ["active", "suspended", "deactivated"],
      default: "active",
    },

    // 5. Email Verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationTokenHash: {
      type: String,
      select: false,
    },

    emailVerificationExpiresAt: {
      type: Date,
      select: false,
    },

    // 6. Password Recovery
    passwordResetTokenHash: {
      type: String,
      select: false,
    },

    passwordResetExpiresAt: {
      type: Date,
      select: false,
    },

    // 7. Security Information
    lastLoginAt: {
      type: Date,
      default: null,
    },

    // 8. User Preferences
    preferences: {
      defaultCurrency: {
        type: String,
        uppercase: true,
        default: "PKR",
      },

      timezone: {
        type: String,
        default: "Asia/Karachi",
      },

      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "users",
  }
);

// Remove sensitive fields from JSON responses.
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.emailVerificationTokenHash;
    delete ret.emailVerificationExpiresAt;
    delete ret.passwordResetTokenHash;
    delete ret.passwordResetExpiresAt;

    return ret;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
