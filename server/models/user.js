const { model, Schema } = require("mongoose");
const { hashSync } = require("bcryptjs");

const schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // ✅ good: converts to lowercase
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      maxlength: 20,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    bio: {
      type: String,
      maxlength: 200,
      default: "Hey there! I am using Vib.",
    },
    dob: {
      type: Date,
    },
    verified: {
      type: Boolean,
      default: false,
      select: false,
    },
    otp: {
      type: String,
      select: false,
    },
    otp_expiry_time: {
      type: Date,
      select: false,
    },
    reset_link_expiry: {
      type: Date,
      select: false,
    },
    passsowrd_changed_at: {
      type: Date,
      select: false,
    },
    fcm_tokens: [
      {
        browserId: {
          type: String,
        },
        token: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

schema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  this.password = hashSync(this.password, 10);
  return next();
});

module.exports = model("User", schema);
