const nodemailer = require("nodemailer");
const { APP_EMAIL, GOOGLE_APP_PASSWORD } = require("../config/config");
const { OTP_MAIL, RESET_PASSWORD_LINK_MAIL } = require("../constants/mail");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: APP_EMAIL,
    pass: GOOGLE_APP_PASSWORD,
  },
});

const SendMail = (mailOptions) => {
  return transporter.sendMail(mailOptions);
};

const SendOtpMail = async (email, otp) => {
  const mailOptions = {
    from: APP_EMAIL,
    to: email,
    subject: "Your OTP for email verification",
    text: `Your OTP is ${otp}. Please use this to verify your email.`,
    html: OTP_MAIL(otp),
  };

  return (info = await SendMail(mailOptions));
};

const sendResetPasswordLinkMail = async (email, resetLink) => {
  mailOptions = {
    from: APP_EMAIL,
    to: email,
    subject: "Reset Your Password",
    text: `Click the following link to reset your password: ${resetLink}`,
    html: RESET_PASSWORD_LINK_MAIL(resetLink),
  };

  return (info = await SendMail(mailOptions));
};

module.exports = { SendMail, SendOtpMail, sendResetPasswordLinkMail };
