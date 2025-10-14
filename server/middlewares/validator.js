const { query, body } = require("express-validator");

const EmailValidator = () =>
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail({
      gmail_remove_dots: false, // ✅ Preserve dots (important!)
      gmail_remove_subaddress: false, // ✅ Keep +tag parts (e.g., user+test@gmail.com)
      gmail_convert_googlemaildotcom: true, // ✅ Treat googlemail.com as gmail.com
      outlookdotcom_remove_subaddress: false, // For Outlook users
      yahoo_remove_subaddress: false, // For Yahoo users
      icloud_remove_subaddress: false, // For iCloud users
    });

const PasswordValidator = () =>
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[^a-zA-Z0-9]/)
    .withMessage("Password must contain at least one special character");

const NameValidator = () =>
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Name must be at least 4 characters long");

const PhoneNumberValidator = () =>
  body("phone_number")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Please enter a valid phone number")
    .optional(true);

const DateOfBirthValidator = () =>
  body("dob")
    .optional()
    .custom((value) => {
      if (!value) return true;
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 13 || age > 120) {
        throw new Error("You must be between 13 and 120 years old");
      }
      return true;
    });

const ImageValidator = () =>
  body("image").custom((value, { req }) => {
    if (!req.file) return true; // Optional: skip if no file
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new Error("Only JPEG, PNG, GIF, and WEBP images are allowed");
    }
    return true;
  });

const BioValidator = () =>
  body("bio")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Bio must be less than 500 characters");

const OtpValidator = () =>
  body("otp").trim().notEmpty().withMessage("OTP is required").isLength(6);

const PasswordMatchValidator = () =>
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password and confirm password do not match");
    }
    return true;
  });

module.exports = {
  EmailValidator,
  PasswordValidator,
  NameValidator,
  PhoneNumberValidator,
  PasswordMatchValidator,
  OtpValidator,
  BioValidator,
  ImageValidator,
  DateOfBirthValidator,
};
