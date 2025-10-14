const { TryCatch, ErrorHandler } = require("../lib/error");
const { decodeToken } = require("../lib/helper");
const User = require("../models/user");

const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies["viby-token"];
  if (!token) {
    return new ErrorHandler(401, "You are not authenticated");
  }

  const decoded_data = decodeToken(token);
  if (!decoded_data) {
    return new ErrorHandler(401, "Invalid token");
  }

  //   Checck if user is logged in before password was changed and if so, logout the user
  const user = await User.findById(decoded_data._id).select(
    "+password_changed_at +fcm_tokens +avatar "
  );

  if (!user) {
    return new ErrorHandler(404, "User not found");
  }

  if (user.password_changed_at > decoded_data.iat) {
    return new ErrorHandler(401, "You are logged out. Please login again.");
  }

  req.user = user;

  next();
});

module.exports = { isAuthenticated };
