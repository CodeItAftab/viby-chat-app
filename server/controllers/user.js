const { UploadAvatar } = require("../lib/cloudinary");
const { TryCatch, ErrorHandler } = require("../lib/error");
const { GetMutualFriendsCount } = require("../lib/helper");
const User = require("../models/user");
const Chat = require("../models/chat");
const Request = require("../models/request");
const { isOnline } = require("../lib/socket");

const UpdateProfile = TryCatch(async (req, res, next) => {
  const avatar = req?.files?.avatar || undefined;

  const user = await User.findById(req.user._id).select(
    "+name +bio +dob +avatar"
  );

  console.log(req.body);

  if (req.body) {
    // add fields to updateFields object which are not undefined
    if (req.body.name !== undefined) {
      user.name = req.body.name;
    }
    if (req.body.bio !== undefined) {
      user.bio = req.body.bio;
    }

    if (req.body.dob !== undefined) {
      console.log(req.body.dob);
    }

    // Todo :  implement date of birth update
  }

  if (avatar) {
    const avt = await UploadAvatar(avatar);
    if (avt) {
      user.avatar = {
        public_id: avt.public_id,
        url: avt.url,
      };
    }
  }

  const updatedUser = await user.save({
    new: true,
    validateModifiedOnly: true,
  });

  return res.json({
    success: true,
    message: "Profile updated successfully",
    user: { ...user._doc, avatar: user._doc?.avatar?.url },
  });
});

const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find(
    {
      _id: { $ne: req.user._id },
    },
    "name avatar"
  ).lean();

  const processed_users = [];

  for (let user of users) {
    const chat = await Chat.findOne({
      members: { $all: [req.user._id, user._id] },
      isGroup: false,
    });

    // Check if user is already friend with this user
    if (chat) {
      processed_users.push({
        ...user,
        type: "friend",
        chatId: chat._id,
        avatar: user?.avatar?.url,
      });
      continue;
    }

    const request = await Request.findOne({
      $or: [
        { sender: req.user._id, receiver: user._id },
        { sender: user._id, receiver: req.user._id },
      ],
    });

    if (request) {
      const isSender = request?.sender.toString() === req.user._id.toString();

      processed_users.push({
        ...user,
        type: isSender ? "sent_req" : "req",
        requestId: request._id,
        avatar: user?.avatar?.url,
      });

      continue;
    }

    processed_users.push({
      ...user,
      type: "user",
      avatar: user?.avatar?.url,
    });
  }

  const final_processed_users = [];

  for (let user of processed_users) {
    const mututalFriendsCount = await GetMutualFriendsCount(
      req.user._id,
      user._id
    );

    final_processed_users.push({
      ...user,
      mutualFriendsCount: mututalFriendsCount,
    });
  }

  res.status(200).json({ success: true, users: final_processed_users });
});

const searchUsers = TryCatch(async (req, res, next) => {
  const { query } = req.query;
  const currentUserId = req.user._id;
  console.log(req.query);

  if (!query || query.trim() === "") {
    return new ErrorHandler(400, "Search query is required");
  }

  const regex = new RegExp(query, "i"); // case-insensitive regex

  const users = await User.find({
    _id: { $ne: currentUserId }, // exclude self
    $or: [{ name: regex }, { email: regex }],
  })
    .select("_id name avatar username")
    .lean(); // return only necessary fields

  const processed_users = [];

  for (let user of users) {
    const chat = await Chat.findOne({
      members: { $all: [req.user._id, user._id] },
      isGroup: false,
    });

    // Check if user is already friend with this user
    if (chat) {
      processed_users.push({
        ...user,
        type: "friend",
        chatId: chat._id,
        avatar: user?.avatar?.url,
        online: isOnline(user._id),
      });
      continue;
    }

    const request = await Request.findOne({
      $or: [
        { sender: req.user._id, receiver: user._id },
        { sender: user._id, receiver: req.user._id },
      ],
    });

    if (request) {
      const isSender = request?.sender.toString() === req.user._id.toString();

      processed_users.push({
        ...user,
        type: isSender ? "sent_req" : "req",
        requestId: request._id,
        avatar: user?.avatar?.url,
      });

      continue;
    }

    processed_users.push({
      ...user,
      type: "user",
      avatar: user?.avatar?.url,
    });
  }

  const final_processed_users = [];

  for (let user of processed_users) {
    const mututalFriendsCount = await GetMutualFriendsCount(
      req.user._id,
      user._id
    );

    final_processed_users.push({
      ...user,
      mutualFriendsCount: mututalFriendsCount,
    });
  }

  return res.status(200).json({ success: true, users: final_processed_users });
});

const suggestedUsers = TryCatch(async (req, res, next) => {
  const currentUserId = req.user._id;

  if (!currentUserId) {
    return new ErrorHandler(400, "User ID is required");
  }

  // Step 1: Get all other users
  const allOtherUsers = await User.find({ _id: { $ne: currentUserId } })
    .select("_id name avatar username")
    .lean();

  const suggestions = [];

  for (let user of allOtherUsers) {
    const userId = user._id;

    // Step 2: Skip if already in a 1-to-1 chat (friend)
    const isFriend = await Chat.exists({
      members: { $all: [currentUserId, userId] },
      isGroup: false,
    });

    if (isFriend) continue;

    // Step 3: Skip if a friend request exists (sent or received)
    const hasRequest = await Request.exists({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    });

    if (hasRequest) continue;

    // Step 4: Compute mutual friend count
    const mutualFriendsCount = await GetMutualFriendsCount(
      currentUserId,
      userId
    );

    // Step 5: Add to suggestions
    suggestions.push({
      ...user,
      avatar: user?.avatar?.url,
      type: "user",
      mutualFriendsCount,
    });
  }

  // Step 6: Sort by mutual friends (optional)
  suggestions.sort((a, b) => b.mutualFriendsCount - a.mutualFriendsCount);

  return res.status(200).json({
    success: true,
    users: suggestions,
  });
});

const getAllFriends = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user._id,
    isGroup: false,
  })
    .populate("members", "name avatar username bio")
    .lean();

  const friends = chats.map((chat) => {
    const friend = chat.members.find(
      (member) => member._id.toString() !== req.user._id.toString()
    );
    return {
      _id: friend._id,
      name: friend.name,
      username: friend.username,
      bio: friend.bio,
      chatId: chat._id,
      online: isOnline(friend._id),
      avatar: friend?.avatar?.url,
      friendsSince: chat.createdAt.toISOString().split("T")[0], // Format date as YYYY-MM-DD
    };
  });

  const final_processed_friends = [];
  for (let friend of friends) {
    const mutualFriendsCount = await GetMutualFriendsCount(
      req.user._id,
      friend._id
    );
    final_processed_friends.push({
      ...friend,
      mutualFriendsCount: mutualFriendsCount,
    });
  }

  res.status(200).json({ success: true, friends: final_processed_friends });
});

module.exports = {
  UpdateProfile,
  getAllUsers,
  searchUsers,
  suggestedUsers,
  getAllFriends,
};
