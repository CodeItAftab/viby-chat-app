const express = require("express");
const {
  UpdateProfile,
  getAllUsers,
  searchUsers,
  suggestedUsers,
  getAllFriends,
} = require("../controllers/user");

const router = express.Router();

router.post("/update-profile", UpdateProfile);
router.get("/all", getAllUsers);
router.get("/search", searchUsers);
router.get("/suggested-friends", suggestedUsers);
router.get("/all/friends", getAllFriends);

module.exports = router;
