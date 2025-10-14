const { TryCatch, ErrorHandler } = require("../lib/error");
const {
  comapreHashedData,
  sendToken,
  GenerateOTP,
  GenerateToken,
  GenerateResetLink,
  decodeToken,
  GenerateUniqueUsername,
} = require("../lib/helper");
const { hashSync } = require("bcryptjs");
const User = require("../models/user");
const { SendOtpMail, sendResetPasswordLinkMail } = require("../services/mail");

const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return new ErrorHandler(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password +verified");

  if (!user || !user.verified)
    return new ErrorHandler(404, "User with this email does not exist");

  const isCorrectPassword = comapreHashedData(password, user.password);

  if (!isCorrectPassword)
    return new ErrorHandler(401, "Incorrect email or password");

  const resUser = {
    ...user._doc,
    password: undefined,
    otp: undefined,
    otp_expiry_time: undefined,
    reset_link_expiry: undefined,
    avatar: user._doc?.avatar?.url || undefined,
    verified: undefined,
    fcm_tokens: undefined,
  };

  return sendToken(res, resUser, 200, "Logged in successfully");
});

const register = TryCatch(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existing_user = await User.findOne({ email }).select("+verified");

  if (existing_user && existing_user.verified) {
    return new ErrorHandler(400, "User already exists");
  } else if (existing_user) {
    existing_user.name = name;
    existing_user.password = password;
    req.userId = existing_user._id.toString();
    await existing_user.save();
    return next();
  } else {
    // 🔐 Generate username before creating the new user
    const username = await GenerateUniqueUsername({ name, email });

    const new_user = await User.create({
      name,
      email,
      password,
      username, // ✅ Include it in the new user document
    });

    req.userId = new_user._id.toString();
    return next();
  }
});

const sendOTP = TryCatch(async (req, res, next) => {
  const { userId } = req;

  const otp = GenerateOTP(6);

  //   todo: delete the console.log(otp)
  console.log(otp);

  const hashed_otp = hashSync(otp, 10);

  const expiry_time = Date.now() + 10 * 60 * 1000; // 10 minutes

  const user = await User.findById(userId);

  user.otp = hashed_otp;
  user.otp_expiry_time = expiry_time;

  await user.save({
    new: true,
    validateModifiedOnly: true,
  });

  try {
    await SendOtpMail(user.email, otp);
  } catch (error) {
    throw new ErrorHandler(
      500,
      "Something went wrong, Please try again later."
    );
  }

  return res.status(200).json({
    success: true,
    message: "OTP send to mail",
  });
});

const verifyOTP = TryCatch(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return new ErrorHandler(400, "Email and OTP are required");

  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  }).select("+otp");

  if (!user) return new ErrorHandler(404, "Inavlid email of otp expired");

  const isCorrectOTP = comapreHashedData(otp, user.otp);

  if (!isCorrectOTP) return new ErrorHandler(401, "Incorrect OTP");

  user.verified = true;
  user.otp = undefined;
  user.otp_expiry_time = undefined;

  await user.save();

  const resUser = {
    ...user._doc,
    password: undefined,
    otp: undefined,
    otp_expiry_time: undefined,
    reset_link_expiry: undefined,
    avatar: user._doc?.avatar?.url || undefined,
    verified: undefined,
    fcm_tokens: undefined,
  };

  //   TODO: Send mail to the user email

  return sendToken(res, resUser, 200, "Otp verified successfully");
});

const SendResetLink = TryCatch(async (req, res, next) => {
  const { email } = req.body;
  if (!email)
    return new ErrorHandler(
      400,
      "Email is required to send reset password link"
    );

  const user = await User.findOne({ email });

  if (!user) return new ErrorHandler(404, "User does not exist");

  const token = GenerateToken({ _id: user._id });

  const reset_link = GenerateResetLink(token);
  console.log(reset_link);

  const reset_expiry = Date.now() + 10 * 60 * 1000; // 10 Minutes

  user.reset_link_expiry = reset_expiry;

  await user.save();

  //   TODO: SEND RESET LINK TO USER EMAIL
  try {
    await sendResetPasswordLinkMail(user.email, reset_link);
  } catch (error) {
    throw new ErrorHandler(
      500,
      "Something went wrong, Please try again later."
    );
  }

  return res.status(200).json({
    success: true,
    message: "Reset password link sent to user email",
  });
});

const changePassword = TryCatch(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const token = req.params.reset_token;
  const { _id } = decodeToken(token);

  const user = await User.findOne({
    _id,
    reset_link_expiry: { $gt: Date.now() },
  });

  if (!user)
    return new ErrorHandler(
      404,
      "Invalid token or link expired, try sending link again"
    );

  user.password = password;
  user.reset_link_expiry = undefined;
  user.passsowrd_changed_at = Date.now();

  await user.save({
    new: true,
    validateModifiedOnly: true,
  });

  return res.status(200).json({
    success: true,
    message: "Password changed successfully, please login",
  });
});

const validateToken = TryCatch(async (req, res, next) => {
  const token = req.params.reset_token;

  if (!token) return new ErrorHandler(400, "Token is required");

  const { _id } = decodeToken(token);

  const user = await User.findOne({
    _id,
    reset_link_expiry: { $gt: Date.now() },
  });
  if (!user) {
    return new ErrorHandler(
      404,
      "Invalid token or link expired, try sending link again"
    );
  }

  return res.status(200).json({
    success: true,
    message: "Token is valid",
  });
});

module.exports = {
  login,
  register,
  sendOTP,
  verifyOTP,
  SendResetLink,
  changePassword,
  validateToken,
};
