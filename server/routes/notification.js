const express = require("express");
const router = express.Router();
const {
  UpdateUserFCMToken,
  RemoveUserFCMToken,
} = require("../controllers/notification");

router.post("/update-fcm-token", UpdateUserFCMToken);

router.post("/remove-fcm-token", RemoveUserFCMToken);

module.exports = router;
