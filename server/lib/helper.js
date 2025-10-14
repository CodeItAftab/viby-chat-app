const { compareSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, CLIENT_URL } = require("../config/config");
const otpGenerator = require("otp-generator");
const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
const { nanoid } = require("nanoid");
const { getIO, GetSocketIds } = require("./socket");
const { SocketEvents } = require("../constants/event");

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const GenerateToken = (payload) => {
  const token = jwt.sign({ ...payload }, JWT_SECRET);
  return token;
};

const comapreHashedData = (data, hashedData) => {
  const isEqual = compareSync(data, hashedData);
  return isEqual;
};

const sendToken = (res, user, statusCode, message) => {
  const token = GenerateToken({ _id: user._id });

  return res
    .status(statusCode)
    .cookie("viby-token", token, cookieOptions)
    .json({
      success: true,
      message,
      user,
    });
};

const GenerateOTP = (length) => {
  const otp = otpGenerator.generate(length, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  return otp;
};

const GenerateResetLink = (token) => {
  const link = `${CLIENT_URL}/auth/reset-password/${token}`;
  return link;
};

const decodeToken = (token) => {
  const data = jwt.verify(token, JWT_SECRET);
  return data;
};

const convertToDate = (date) => {
  try {
    d = new Date(date);
    return d;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

const normalizeEmail = (email) => {
  return email.toLowerCase().trim();
};

const GetDirectFriends = async (userId) => {
  const chats = await Chat.find({
    isGroup: false,
    members: userId,
  }).select("members");

  const directFriends = new Set();

  for (const chat of chats) {
    for (const member of chat.members) {
      if (member.toString() !== userId.toString()) {
        directFriends.add(member.toString());
      }
    }
  }

  return Array.from(directFriends);
};

const GetMututalFriends = async (userAId, userBId) => {
  const [aFriends, bFriends] = await Promise.all([
    GetDirectFriends(userAId),
    GetDirectFriends(userBId),
  ]);
  const aSet = new Set(aFriends);
  const mutuals = bFriends.filter((id) => aSet.has(id));

  return mutuals; // array of user IDs (as strings)
};

const GetMutualFriendsCount = async (userAId, userBId) => {
  const mutualFriends = await GetMututalFriends(userAId, userBId);
  return mutualFriends.length;
};

const GenerateUniqueUsername = async ({ name = "", email = "" }) => {
  const MAX_USERNAME_LENGTH = 20;
  const SUFFIX = "@viby";
  const MAX_BASE_LENGTH = MAX_USERNAME_LENGTH - SUFFIX.length;

  // 1. Extract base from name or email
  let base =
    name?.split(" ")[0]?.toLowerCase() ||
    email?.split("@")[0]?.toLowerCase() ||
    "vibyuser";

  base = base.replace(/[^a-z0-9]/gi, ""); // remove non-alphanumeric

  if (!base || base.length < 3) base = "vibyuser";

  base = base.slice(0, MAX_BASE_LENGTH); // trim if too long

  let username = `${base}${SUFFIX}`;
  let counter = 0;

  // 2. Try variations if username is taken
  while (await User.exists({ username })) {
    counter++;
    const counterStr = String(counter);
    const newBase = base.slice(0, MAX_BASE_LENGTH - counterStr.length); // trim for counter
    username = `${newBase}${counterStr}${SUFFIX}`;

    // Fallback after 5 tries: use short nanoid (letters/numbers only, no dash)
    if (counter > 5) {
      const id = nanoid(3)
        .replace(/[^a-z0-9]/gi, "")
        .toLowerCase(); // safe fallback
      const fallbackBase = base.slice(0, MAX_BASE_LENGTH - id.length);
      username = `${fallbackBase}${id}${SUFFIX}`;
      break;
    }
  }

  return username;
};

const GetOtherMemberForPersonalChat = (userId, users) => {
  if (!users || users.length !== 2) {
    throw new Error("Invalid chat members");
  }

  return users.find((user) => user._id.toString() !== userId.toString());
};

const GetUnreadMessagesCount = async (userId, chatId) => {
  const unreadCount = await Message.countDocuments({
    chatId,
    state: { $in: ["sent", "delivered"] },
    read_list: { $ne: userId },
    sender: { $ne: userId },
  });

  return unreadCount;
};

const IsMessageReadByUser = (message, userId) => {
  if (!message || !message.read_list) return false;
  return message.read_list.some(
    (user) => user.toString() === userId.toString()
  );
};

const IsMessageDeliveredToUser = (message, userId) => {
  if (!message || !message.delivered_list) return false;
  return message.delivered_list.some(
    (user) => user.toString() === userId.toString()
  );
};

const IsMessageReadByAllUsers = (message) => {
  if (!message || !message.read_list) return false;
  return message.read_list.length === message.chatId.members.length;
};

const IsMessageDeliveredToAllUsers = (message) => {
  if (!message || !message.delivered_list) return false;
  return message.delivered_list.length === message.chatId.members.length;
};

const SendSocketNotification = (userIds, event, data) => {
  const io = getIO();
  if (!io) {
    console.error("Socket.io not initialized");
    return;
  }

  if (!userIds || userIds.length === 0) {
    console.warn("No user IDs provided for socket notification");
    return;
  }

  // Check if it has multiple user IDs
  const isMultipleUsers = Array.isArray(userIds);
  if (isMultipleUsers && userIds.length === 0) {
    console.warn("No user IDs provided for socket notification");
    return;
  }

  if (isMultipleUsers) {
    userIds.forEach((userId) => {
      const socketIds = GetSocketIds(userId.toString());
      if (socketIds && socketIds.length > 0) {
        socketIds.forEach((socketId) => {
          io.to(socketId).emit(event, data);
        });
      }
    });
  } else {
    const socketIds = GetSocketIds(userIds.toString());
    if (socketIds && socketIds.length > 0) {
      socketIds.forEach((socketId) => {
        io.to(socketId).emit(event, data);
      });
    }
  }
};

module.exports = {
  comapreHashedData,
  sendToken,
  GenerateOTP,
  GenerateToken,
  GenerateResetLink,
  decodeToken,
  convertToDate,
  normalizeEmail,
  GetMututalFriends,
  GetMutualFriendsCount,
  GetDirectFriends,
  GenerateUniqueUsername,
  GetOtherMemberForPersonalChat,
  GetUnreadMessagesCount,
  IsMessageReadByUser,
  IsMessageDeliveredToUser,
  IsMessageReadByAllUsers,
  IsMessageDeliveredToAllUsers,
  SendSocketNotification,
};
