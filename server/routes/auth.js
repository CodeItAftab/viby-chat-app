const express = require("express");
const {
  login,
  register,
  sendOTP,
  verifyOTP,
  SendResetLink,
  changePassword,
  validateToken,
} = require("../controllers/auth");
const {
  NameValidator,
  EmailValidator,
  PasswordValidator,
  OtpValidator,
  PasswordMatchValidator,
} = require("../middlewares/validator");

const router = express.Router();

router.post("/login", [EmailValidator(), PasswordValidator()], login);

router.post(
  "/register",
  // [NameValidator(), EmailValidator(), PasswordValidator()],
  register,
  sendOTP
);

router.post("/verify-otp", [OtpValidator()], verifyOTP);

router.post("/reset-password", [EmailValidator()], SendResetLink);

router.post(
  "/change-password/:reset_token",
  [PasswordValidator(), PasswordMatchValidator()],
  changePassword
);

router.get("/validate-token/:reset_token", validateToken);

module.exports = router;
