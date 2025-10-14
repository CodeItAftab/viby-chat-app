const { SocketEvents } = require("../constants/event");
const Chat = require("../models/chat");
const Message = require("../models/message");

MarkMessagesAsDelivered = async (io, userId, ActiveUsers) => {
  const senderToChatIds = new Set();

  const chats = await Chat.find({
    members: userId,
    isGroup: false,
  });

  for (let chat of chats) {
    const messages = await Message.find({
      chatId: chat._id,
      state: "sent",
      delivered_list: { $ne: userId },
    });

    if (messages.length === 0) continue;

    // Mark messages as delivered
    for (let msg of messages) {
      if (msg.state === "delivered" || msg.state === "read") continue;
      if (msg.sender.toString() === userId.toString()) continue;
      if (msg.delivered_list.includes(userId.toString())) continue;

      msg.delivered_list.push(userId);
      if (msg.delivered_list.length === chat.members.length - 1) {
        msg.state = "delivered";
        senderToChatIds.add(
          `${msg.sender.toString()}=%=%${chat._id.toString()}`
        );
      }

      await msg.save();
    }
  }

  for (let entry of senderToChatIds) {
    const [senderId, chatId] = entry.split("=%=%");
    if (!io) {
      console.error("Socket.io not initialized");
      return;
    }
    const socketIds = ActiveUsers.get(senderId);
    if (socketIds && socketIds.length > 0) {
      io.to(socketIds).emit(SocketEvents.Message_Delivered, {
        chatId,
        userId: senderId,
      });
    }
  }
};

const SendMyOnlineStatusToFriends = async (io, userId, ActiveUsers, online) => {
  if (!io) {
    console.error("Socket.io not initialized");
    return;
  }

  const chats = await Chat.find({
    members: userId,
    isGroup: false,
  });

  for (let chat of chats) {
    const otherMembers = chat.members.filter(
      (member) => member.toString() !== userId.toString()
    );

    otherMembers.forEach((memberId) => {
      const socketIds = ActiveUsers.get(memberId.toString());
      if (socketIds) {
        socketIds.forEach((id) => {
          io.to(id).emit(SocketEvents.Friend_Online_Status_Changed, {
            friendId: userId.toString(),
            online: online,
          });
        });
      }
    });
  }
};

module.exports = {
  MarkMessagesAsDelivered,
  SendMyOnlineStatusToFriends,
};
