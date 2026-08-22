const sgMail = require("@sendgrid/mail");
const { APP_EMAIL, SENDGRID_API_KEY } = require("../config/config");
const { OTP_MAIL, RESET_PASSWORD_LINK_MAIL } = require("../constants/mail");

sgMail.setApiKey(SENDGRID_API_KEY);

const SendMail = (mailOptions) => {
  return sgMail.send(mailOptions);
};

const SendOtpMail = async (email, otp) => {
  const mailOptions = {
    from: APP_EMAIL, // must match your verified Single Sender email exactly
    to: email,
    subject: "Your OTP for email verification",
    text: `Your OTP is ${otp}. Please use this to verify your email.`,
    html: OTP_MAIL(otp),
  };

  return await SendMail(mailOptions);
};

const sendResetPasswordLinkMail = async (email, resetLink) => {
  const mailOptions = {
    from: APP_EMAIL, // must match your verified Single Sender email exactly
    to: email,
    subject: "Reset Your Password",
    text: `Click the following link to reset your password: ${resetLink}`,
    html: RESET_PASSWORD_LINK_MAIL(resetLink),
  };

  return await SendMail(mailOptions);
};

module.exports = { SendMail, SendOtpMail, sendResetPasswordLinkMail };
