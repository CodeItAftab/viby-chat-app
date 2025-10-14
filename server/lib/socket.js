const { Server } = require("socket.io");
const { CLIENT_URL } = require("../config/config");
const {
  MarkMessagesAsDelivered,
  SendMyOnlineStatusToFriends,
} = require("./socket-action");
const { SocketEvents } = require("../constants/event");
const Chat = require("../models/chat");

let io;

const ActiveUsers = new Map();

// --- Store socket for a user
const StoreSocketId = (userId, socketId) => {
  const idStr = userId.toString();
  if (!ActiveUsers.has(idStr)) {
    ActiveUsers.set(idStr, [socketId]);
  } else {
    const socketIds = ActiveUsers.get(idStr) || [];
    if (!socketIds.includes(socketId)) {
      socketIds.push(socketId);
      ActiveUsers.set(idStr, socketIds);
    }
  }
};

// --- Remove socket for a user
const RemoveSocketId = (userId, socketId) => {
  const idStr = userId.toString();
  if (ActiveUsers.has(idStr)) {
    const socketIds = ActiveUsers.get(idStr);
    const index = socketIds.indexOf(socketId);
    if (index !== -1) {
      socketIds.splice(index, 1);
      if (socketIds.length === 0) {
        ActiveUsers.delete(idStr);
      } else {
        ActiveUsers.set(idStr, socketIds);
      }
    }
  }
};

// --- Get all sockets for a user
const GetSocketIds = (userId) => {
  return ActiveUsers.get(userId.toString()) || null;
};

// --- Check if user is online
const isOnline = (userId) => {
  const idStr = userId.toString();
  return ActiveUsers.has(idStr) && ActiveUsers.get(idStr).length > 0;
};

// --- Initialize socket server
const connectSocket = (server) => {
  io = new Server(server, {
    cors: { origin: CLIENT_URL, credentials: true },
    transports: ["websocket", "polling"],
  });

  io.on("connection", async (socket) => {
    const { userId } = socket.handshake.query;
    if (!userId) return console.error("User ID required for socket connection");

    StoreSocketId(userId, socket.id);
    await MarkMessagesAsDelivered(io, userId, ActiveUsers);
    SendMyOnlineStatusToFriends(io, userId, ActiveUsers, true);

    console.log(`User ${userId} connected with socket ${socket.id}`);

    // --- Disconnect
    socket.on("disconnect", () => {
      RemoveSocketId(userId, socket.id);
      SendMyOnlineStatusToFriends(io, userId, ActiveUsers, false);

      console.log(`User ${userId} disconnected from socket ${socket.id}`);
    });

    // --- Typing event
    socket.on(SocketEvents.Typing, async ({ chatId, isTyping }) => {
      if (!chatId || typeof isTyping !== "boolean") return;
      const chat = await Chat.findById(chatId, "members");
      if (!chat) return;

      chat.members
        .filter((m) => m.toString() !== userId.toString())
        .forEach((memberId) => {
          const socketIds = GetSocketIds(memberId);
          socketIds?.forEach((id) =>
            io.to(id).emit(SocketEvents.Typing, { chatId, isTyping })
          );
        });
    });

    // --- Recording event
    socket.on(SocketEvents.Recording, async ({ chatId, isRecording }) => {
      if (!chatId || typeof isRecording !== "boolean") return;
      const chat = await Chat.findById(chatId, "members");
      if (!chat) return;

      chat.members
        .filter((m) => m.toString() !== userId.toString())
        .forEach((memberId) => {
          const socketIds = GetSocketIds(memberId);
          socketIds?.forEach((id) =>
            io.to(id).emit(SocketEvents.Recording, { chatId, isRecording })
          );
        });
    });
  });
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = {
  connectSocket,
  getIO,
  StoreSocketId,
  RemoveSocketId,
  GetSocketIds,
  isOnline,
  ActiveUsers,
};
