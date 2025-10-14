const { ErrorHandler, TryCatch } = require("../lib/error");

const Request = require("../models/request");
const Chat = require("../models/chat");
const User = require("../models/user");
const {
  GetMutualFriendsCount,
  SendSocketNotification,
} = require("../lib/helper");
const { isOnline, getIO } = require("../lib/socket");
const { SocketEvents } = require("../constants/event");
const {
  SendNewFriendRequestNotification,
  SendFriendRequestAcceptedNotification,
} = require("../services/notification");

const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { to } = req.body;
  const userId = req?.user?._id;

  //   Check if to is a valid user id
  if (!to) {
    throw new ErrorHandler(400, "Receiver ID is required");
  }

  // check if the user is sending a friend request to himself
  if (userId.toString() === to.toString()) {
    throw new ErrorHandler(400, "You cannot send a friend request to yourself");
  }

  // Check if there is a chat between the two users
  const existingChat = await Chat.findOne({
    members: { $all: [userId.toString(), to.toString()] },
    isGroup: false,
  });

  if (existingChat) {
    throw new ErrorHandler(400, "You are already friends");
  }

  //   Check if there is an existing friend request between the two users
  const existingRequest = await Request.findOne({
    $or: [
      { sender: userId, receiver: to },
      { sender: to, receiver: userId },
    ],
  });

  if (existingRequest) {
    throw new ErrorHandler(400, "Friend request already exists");
  }

  //   Create a new friend request
  const request = await Request.create({
    sender: userId,
    receiver: to,
  });

  //   Populate the sender and receiver fields for realtime notification
  const old_requset = await Request.findById(request._id)
    .populate("sender receiver", "name avatar")
    .lean();

  // Send a notification to the receiver via socket.io and a push notification
  SendSocketNotification(to.toString(), SocketEvents.New_Friend_Request, {
    request: {
      _id: old_requset._id,
      sender: {
        ...old_requset.sender,
        avatar: old_requset?.sender?.avatar?.url,
      },
      createdAt: old_requset.createdAt,
    },
  });

  // Push notification
  SendNewFriendRequestNotification(to.toString(), old_requset._id.toString());

  return res.status(200).json({
    success: true,
    message: "Friend request sent",
    request: {
      _id: old_requset._id,
      receiver: {
        ...old_requset.receiver,
        avatar: old_requset?.receiver?.avatar?.url,
      },
    },
  });
});

const cancelFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId } = req.params;
  //   Check if the request id is provided
  if (!requestId) {
    throw new ErrorHandler(400, "Request ID is required");
  }

  //   Find the request by id
  const request = await Request.findById(requestId);

  //   Check if the request exists
  if (!request) {
    throw new ErrorHandler(404, "Friend request not found");
  }

  //   Check if the user is the sender of the request
  if (request.sender.toString() !== req?.user?._id.toString()) {
    throw new ErrorHandler(
      403,
      "You are not authorized to cancel this request"
    );
  }

  //   Delete the request
  await Request.findByIdAndDelete(requestId);

  // Notify the receiver that the request has been cancelled
  SendSocketNotification(
    request.receiver.toString(),
    SocketEvents.Friend_Request_Cancelled,
    {
      requestId: requestId,
    }
  );

  //   Send a success response
  return res.status(200).json({
    success: true,
    message: "Friend request cancelled",
    requestId: requestId,
  });
});

const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId } = req.params;

  //  Check if the request id is provided
  if (!requestId) {
    throw new ErrorHandler(400, "Request ID is required");
  }

  //  Find the request by id
  const request = await Request.findById(requestId);

  if (!request) {
    throw new ErrorHandler(404, "Friend request not found");
  }

  // Check if the user is the receiver of the request
  if (request.receiver.toString() !== req?.user?._id.toString()) {
    throw new ErrorHandler(
      403,
      "You are not authorized to accept this request"
    );
  }

  //   Create a new chat between the two users

  const existingChat = await Chat.findOne({
    members: { $all: [request.sender, request.receiver] },
    isGroup: false,
  });

  if (existingChat) {
    throw new ErrorHandler(400, "You are already friends");
  }

  //   Create a new chat
  const chat = await Chat.create({
    members: [request.sender, request.receiver],
  });

  //   Delete the request
  await Request.findByIdAndDelete(requestId);

  const senderFriend = await User.findById(
    request.sender,
    "name avatar username"
  ).lean();

  SendSocketNotification(
    request.sender.toString(),
    SocketEvents.Friend_Request_Accepted,
    {
      requestId: requestId,
      friend: {
        _id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        avatar: req.user?.avatar?.url,
        online: isOnline(req.user._id),
        chatId: chat._id,
      },
    }
  );

  // todo: Send a push notification to the sender
  SendFriendRequestAcceptedNotification(
    req.user._id.toString(),
    request.sender.toString()
  );

  //   Send a success response

  return res.status(200).json({
    success: true,
    message: "Friend request accepted",
    requestId: requestId,
    chatId: chat._id,
    friend: {
      _id: senderFriend._id,
      name: senderFriend.name,
      username: senderFriend.username,
      avatar: senderFriend?.avatar?.url,
      online: isOnline(request.sender._id),
      chatId: chat._id,
    },
  });
});

const rejectFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId } = req.params;

  //  Check if the request id is provided
  if (!requestId) {
    throw new ErrorHandler(400, "Request ID is required");
  }

  //  Find the request by id
  const request = await Request.findById(requestId);
  if (!request) {
    throw new ErrorHandler(404, "Friend request not found");
  }

  // Check if the user is the receiver of the request
  if (request.receiver.toString() !== req?.user?._id.toString()) {
    throw new ErrorHandler(
      403,
      "You are not authorized to reject this request"
    );
  }

  // Delete the request
  await Request.findByIdAndDelete(requestId);

  // Notify the sender that the request has been rejected
  SendSocketNotification(
    request.sender.toString(),
    SocketEvents.Friend_Request_Declined,
    {
      requestId: requestId,
    }
  );

  //   Send a success response
  return res.status(200).json({
    success: true,
    message: "Friend request rejected",
    requestId: requestId,
  });
});

const getAllSentRequests = TryCatch(async (req, res, next) => {
  const requests = await Request.find(
    { sender: req?.user?._id },
    "receiver createdAt"
  )
    .populate("receiver", "name avatar username")
    .lean();

  // Calculate mututal friends count for each reques

  // change avatar to avatar.url
  const modifiedRequests = requests.map((request) => {
    return {
      _id: request._id,
      createdAt: request.createdAt,
      receiver: {
        _id: request.receiver._id,
        name: request.receiver.name,
        avatar: request.receiver?.avatar?.url,
        username: request.receiver.username,
      },
    };
  });

  const processed_requests = [];

  for (let request of modifiedRequests) {
    const mututalFriendsCount = await GetMutualFriendsCount(
      req.user._id,
      request.receiver._id
    );

    processed_requests.push({
      ...request,
      receiver: {
        ...request.receiver,
        mutualFriendsCount: mututalFriendsCount,
      },
    });
  }

  res.status(200).json({ success: true, requests: processed_requests });
});

const getAllRequests = TryCatch(async (req, res, next) => {
  const requests = await Request.find(
    { receiver: req?.user?._id },
    "sender createdAt"
  )
    .populate("sender", "name avatar username")
    .lean();

  // console.log("received request", requests);

  // change avatar to avatar.url
  const modifiedRequests = requests.map((request) => {
    console.log("request", request);
    return {
      _id: request?._id,
      createdAt: request.createdAt,
      sender: {
        _id: request.sender._id,
        name: request.sender.name,
        avatar: request.sender?.avatar?.url,
        username: request.sender.username,
      },
    };
  });

  const processed_requests = [];

  for (let request of modifiedRequests) {
    const mututalFriendsCount = await GetMutualFriendsCount(
      req.user._id,
      request.sender._id
    );

    processed_requests.push({
      ...request,
      sender: {
        ...request.sender,
        mutualFriendsCount: mututalFriendsCount,
      },
    });
  }

  res.status(200).json({ success: true, requests: processed_requests });
});

module.exports = {
  sendFriendRequest,
  cancelFriendRequest,
  getAllSentRequests,
  getAllRequests,
  acceptFriendRequest,
  rejectFriendRequest,
};
