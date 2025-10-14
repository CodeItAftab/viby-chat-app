const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
const { TryCatch, ErrorHandler } = require("../lib/error");
const {
  GetOtherMemberForPersonalChat,
  GetUnreadMessagesCount,
  IsMessageDeliveredToAllUsers,
  SendSocketNotification,
} = require("../lib/helper");
const { isOnline } = require("../lib/socket");
const { UploadOnCloudinary } = require("../lib/cloudinary");
const { SocketEvents } = require("../constants/event");
const { SendNewMessageNotification } = require("../services/notification");

const GetAllChats = TryCatch(async (req, res, next) => {
  const friends = await Chat.find({ members: req.user._id })
    .populate("members", "-password -__v -createdAt -updatedAt")
    .lean();

  const chats = [];

  for (const friend of friends) {
    // Check if there is any message in the
    const message = await Message.findOne(
      { chatId: friend._id },
      {},
      { sort: { createdAt: -1 } }
    ).populate("sender");

    if (!message) continue;

    const otherMember = GetOtherMemberForPersonalChat(
      req.user._id,
      friend.members
    );

    const unread_count = await GetUnreadMessagesCount(req.user._id, friend._id);

    // for personal chats not for groups
    const chat = {
      _id: friend._id,
      friendId: otherMember._id,
      name: otherMember.name,
      username: otherMember.username,
      online: isOnline(otherMember._id),
      avatar: otherMember?.avatar?.url,
      last_message: {
        _id: message._id,
        text_content: message.text_content,
        type: message.type,
        is_sender: message.sender._id.toString() === req.user._id.toString(),
        timestamp: message.createdAt,
        state: message.state,
      },
      unread_count: unread_count,
    };

    chats.push(chat);
  }

  // Sort chats by last message timestamp descending
  chats.sort((a, b) => {
    const aTime = new Date(a.last_message.timestamp).getTime();
    const bTime = new Date(b.last_message.timestamp).getTime();
    return bTime - aTime;
  });

  res.status(200).json({
    success: true,
    message: "Chats fetched successfully",
    chats,
  });
});

const SendMessage = TryCatch(async (req, res, next) => {
  const { chatId, text_content, type } = req.body;

  const media = req.files?.media;
  let uploadedFiles;
  let messageType = "text";

  if (!chatId) throw new ErrorHandler(400, "Chat ID is required");

  if (!text_content && !media) {
    throw new ErrorHandler(400, "Message content or attachments are required");
  }

  const chat = await Chat.findById(chatId).lean();

  if (!chat) {
    throw new ErrorHandler(404, "Chat not found");
  }

  // console.log(text_content, mediaArray);

  const otherMemberId = GetOtherMemberForPersonalChat(
    req.user._id,
    chat.members
  );

  if (!otherMemberId) {
    throw new ErrorHandler(404, "Other member not found in chat");
  }

  if (media) {
    uploadedFiles = await UploadOnCloudinary(media);
    console.log(uploadedFiles);
    if (Array.isArray(uploadedFiles)) {
      messageType = uploadedFiles[0].resource_type;
    } else {
      messageType = uploadedFiles.resource_type;
    }
  }

  // console.log(isMessageDelivered);

  const msg = await Message.create({
    chatId: chat._id,
    sender: req.user._id,
    text_content: text_content || "",
    media: uploadedFiles || [],
    type: type ?? messageType,
    state: isOnline(otherMemberId) ? "delivered" : "sent",
    read_list: [],
    delivered_list: isOnline(otherMemberId)
      ? chat.members.filter((m) => m._id.toString() !== req.user._id.toString())
      : [],
  });

  //  Notify the other user about the new message using socket.io

  const MessageForRealTime = {
    _id: msg._id,
    chatId: chat._id,
    text_content: msg.text_content,
    type: msg.type,
    media: msg.media,
    sender: {
      _id: req.user._id,
      name: req.user.name,
      username: req.user.username,
      avatar: req.user.avatar?.url || "",
    },
    is_sender: false,
    timestamp: msg.createdAt,
    state: msg.state,
  };

  //Socket notification to the other member
  SendSocketNotification(otherMemberId, SocketEvents.New_Message, {
    message: MessageForRealTime,
    chatId: chat._id,
  });

  // Push notification to the other member
  SendNewMessageNotification(otherMemberId, MessageForRealTime);

  // ! Server Response
  res.status(200).json({
    success: true,
    message: {
      ...msg._doc,
      is_sender: true,
      timestamp: msg.updatedAt,
    },
  });
});

const GetMessages = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;

  if (!chatId) throw new ErrorHandler(400, "Chat ID is required");

  const chat = await Chat.findOne({
    _id: chatId,
    members: req.user._id,
    isGroup: false,
  });

  if (!chat) {
    throw new ErrorHandler(404, "Chat not found");
  }

  const messages = await Message.find({ chatId }).sort({ createdAt: 1 }).lean();

  res.status(200).json({
    success: true,
    messages: messages.map((msg) => ({
      ...msg,
      is_sender: msg.sender.toString() === req.user._id.toString(),
      timestamp: msg.createdAt,
    })),
  });
});

const GetChatFriendInfo = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;

  if (!chatId) throw new ErrorHandler(400, "Chat ID is required");

  const chat = await Chat.findById(chatId, "members").populate(
    "members",
    "-password -__v -createdAt -updatedAt"
  );

  if (!chat) {
    throw new ErrorHandler(404, "Chat not found");
  }

  const otherMember = GetOtherMemberForPersonalChat(req.user._id, chat.members);

  const friendInfo = {
    _id: otherMember._id,
    name: otherMember.name,
    username: otherMember.username,
    avatar: otherMember.avatar?.url || "",
    online: isOnline(otherMember._id),
  };

  return res.status(200).json({
    success: true,
    chat: {
      friendId: otherMember._id,
      ...friendInfo,
      _id: chat._id,
    },
  });
});

const ReadMessages = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;

  if (!chatId) throw new ErrorHandler(400, "Chat ID is required");

  const chat = await Chat.findOne({
    _id: chatId,
    members: req.user._id,
    isGroup: false,
  });

  if (!chat) {
    throw new ErrorHandler(404, "Chat not found");
  }

  const messages = await Message.find({
    chatId,
    read_list: { $ne: req.user._id },
    sender: { $ne: req.user._id },
    state: { $ne: "read" },
  });

  const senders = new Set();

  if (messages.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  }

  for (const message of messages) {
    if (
      message.state === "read" ||
      message.sender.toString() === req.user._id.toString() ||
      message.read_list.includes(req.user._id)
    )
      continue;

    // push the user to read_list
    message.read_list.push(req.user._id);
    message.state = "read";
    senders.add(message.sender.toString());
    await message.save();
  }

  // Notify the other users in the chat that the messages have been read
  console.log("Senders:", senders);
  SendSocketNotification(Array.from(senders), SocketEvents.Message_Read, {
    chatId,
  });

  return res.status(200).json({
    success: true,
    message: "Messages marked as read",
  });
});

module.exports = {
  GetAllChats,
  SendMessage,
  GetMessages,
  GetChatFriendInfo,
  ReadMessages,
};
