const express = require("express");
const {
  GetAllChats,
  SendMessage,
  GetMessages,
  GetChatFriendInfo,
  ReadMessages,
} = require("../controllers/chat");
const router = express.Router();

router.get("/all_chats", GetAllChats);

router.post("/send_message", SendMessage);

router.get("/get_messages/:chatId", GetMessages);

router.get("/info/:chatId", GetChatFriendInfo);

router.post("/read_messages/:chatId", ReadMessages);

module.exports = router;
