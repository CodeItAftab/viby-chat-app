const express = require("express");
const fileUpload = require("express-fileupload");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const requestRoutes = require("./request");
const chatRoutes = require("./chat");
const notificationRoutes = require("./notification");
const cloudinaryRoutes = require("./cloudinary");
const { errorMiddleware } = require("../middlewares/error");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/request", requestRoutes);

router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

router.use("/user", isAuthenticated, userRoutes);

router.use("/cloudinary", isAuthenticated, cloudinaryRoutes);

router.use("/chat", isAuthenticated, chatRoutes);

router.use("/notification", isAuthenticated, notificationRoutes);

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the server" });
});

router.use(errorMiddleware);

module.exports = router;
