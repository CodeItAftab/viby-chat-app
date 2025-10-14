const User = require("../models/user");
const { TryCatch, ErrorHandler } = require("../lib/error");

const UpdateUserFCMToken = TryCatch(async (req, res, next) => {
  const { token, browserId } = req.body;

  if (!token || !browserId) {
    return new ErrorHandler(400, "Token and browserId are required");
  }

  const user = await User.findById(req.user._id, "fcm_tokens");

  //   check if the token with the same browserId already exists
  const existingTokenIndex = user.fcm_tokens.findIndex(
    (t) => t.browserId === browserId
  );

  if (existingTokenIndex !== -1) {
    // Update existing token
    user.fcm_tokens[existingTokenIndex].token = token;
  } else {
    // Add new token
    // if the tokens are already 3 then remove the oldest one
    if (user.fcm_tokens.length >= 5) {
      user.fcm_tokens.shift(); // Remove the oldest token
    }
    user.fcm_tokens.push({ browserId, token });
  }

  await user.save();

  return res
    .status(200)
    .json({ success: true, message: "FCM token updated successfully" });
});

const RemoveUserFCMToken = TryCatch(async (req, res, next) => {
  const { browserId } = req.body;
  if (!browserId) {
    return new ErrorHandler(400, "browserId is required");
  }
  const user = await User.findById(req.user._id, "fcm_tokens");
  // Find the index of the token with the given browserId
  const tokenIndex = user.fcm_tokens.findIndex(
    (t) => t.browserId === browserId
  );
  if (tokenIndex === -1) {
    return new ErrorHandler(404, "Token not found");
  }
  // Remove the token from the array
  user.fcm_tokens.splice(tokenIndex, 1);
  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "FCM token removed successfully" });
});

module.exports = {
  UpdateUserFCMToken,
  RemoveUserFCMToken,
};
