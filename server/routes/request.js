const { Router } = require("express");

const { isAuthenticated } = require("../middlewares/auth");
const {
  sendFriendRequest,
  cancelFriendRequest,
  getAllSentRequests,
  getAllRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} = require("../controllers/request");

const router = Router();

router.use(isAuthenticated);
router.post("/send", sendFriendRequest);
router.delete("/cancel/:requestId", cancelFriendRequest);
router.post("/accept/:requestId", acceptFriendRequest);
router.delete("/reject/:requestId", rejectFriendRequest);

router.get("/all-sent-req", getAllSentRequests);
router.get("/all-received-req", getAllRequests);

module.exports = router;
