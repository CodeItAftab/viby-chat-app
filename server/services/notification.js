const admin = require("./firebase");
const User = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();

const removeInvalidTokens = async (userId, invalidTokens) => {
  await User.findByIdAndUpdate(userId, {
    $pull: {
      fcm_tokens: {
        token: { $in: invalidTokens },
      },
    },
  });
};

const SendNotification = async (payload) => {
  try {
    const res = await admin.messaging().send(payload);
    console.log("Notification sent successfully:", res);
    return { success: true, response: res };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error };
  }
};

const SendNewFriendRequestNotification = async (userId, requestId) => {
  const user = await User.findById(userId).select("name avatar fcm_tokens");
  if (!user) {
    console.error("User not found or no FCM tokens available");
    return;
  }

  if (!user.fcm_tokens || user.fcm_tokens.length === 0) {
    return;
  }

  const tokens = user.fcm_tokens.map((token) => token.token).filter(Boolean);
  if (tokens.length === 0) {
    return;
  }

  const notificationData = {
    type: "friend_request",
    tag: "new_friend_request" + requestId,
    title: "New Friend Request",
    body: `${user.name} has sent you a friend request.`,
    avatar: user.avatar ? user.avatar.url : "",
    userId: userId,
    icon: user.avatar ? user.avatar.url : undefined,
    requestId: requestId,
    click_action: process.env.CLIENT_URL + "/requests",
  };

  console.log("Sending notification to tokens:", tokens);

  // Use sendEachForMulticast for better error handling
  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      data: notificationData,
    });

    console.log(`Successfully sent ${response.successCount} notifications`);
    console.log(`Failed to send ${response.failureCount} notifications`);

    // Check for invalid tokens
    const invalidTokens = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const error = resp.error;
        if (
          error.code === "messaging/invalid-registration-token" ||
          error.code === "messaging/registration-token-not-registered"
        ) {
          invalidTokens.push(tokens[idx]);
          console.log(
            `Invalid token detected: ${tokens[idx].substring(0, 20)}...`
          );
        }
      }
    });

    // Remove invalid tokens from database
    if (invalidTokens.length > 0) {
      await removeInvalidTokens(userId, invalidTokens);
      console.log(
        `Removed ${invalidTokens.length} invalid tokens for user ${userId}`
      );
    }

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokensRemoved: invalidTokens.length,
    };
  } catch (error) {
    console.error("Error sending multicast notification:", error);
    return { error };
  }
};

const SendFriendRequestAcceptedNotification = async (userId, senderId) => {
  const sender = await User.findById(senderId).select("name avatar fcm_tokens");
  const user = await User.findById(userId).select("name avatar");
  if (!sender || !sender.fcm_tokens || sender.fcm_tokens.length === 0) {
    console.error("Sender not found or no FCM tokens available");
    return;
  }

  if (!user) {
    console.error("User not found");
    return;
  }

  const tokens = sender.fcm_tokens.map((token) => token.token).filter(Boolean);
  if (tokens.length === 0) {
    console.error("No valid FCM tokens found for sender");
    return;
  }

  const notificationData = {
    type: "friend_request_accepted",
    tag: "friend_request_accepted" + userId,
    title: "Friend Request Accepted",
    body: `${user.name} has accepted your friend request.`,
    avatar: user.avatar ? user.avatar.url : "",
    icon: user.avatar ? user.avatar.url : undefined,
    click_action: process.env.CLIENT_URL + "/friends",
  };

  console.log(
    "Sending friend request accepted notification to tokens:",
    tokens
  );

  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      data: notificationData,
    });

    console.log(`Successfully sent ${response.successCount} notifications`);
    console.log(`Failed to send ${response.failureCount} notifications`);

    // Check for invalid tokens
    const invalidTokens = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const error = resp.error;
        if (
          error.code === "messaging/invalid-registration-token" ||
          error.code === "messaging/registration-token-not-registered"
        ) {
          invalidTokens.push(tokens[idx]);
          console.log(
            `Invalid token detected: ${tokens[idx].substring(0, 20)}...`
          );
        }
      }
    });

    // Remove invalid tokens from database
    if (invalidTokens.length > 0) {
      await removeInvalidTokens(senderId, invalidTokens);
      console.log(
        `Removed ${invalidTokens.length} invalid tokens for sender ${senderId}`
      );
    }

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokensRemoved: invalidTokens.length,
    };
  } catch (error) {
    console.error("Error sending multicast notification:", error);
    return { error };
  }
};

const SendNewMessageNotification = async (userId, message) => {
  const user = await User.findById(userId).select("name avatar fcm_tokens");
  console.log("User for notification:", user);
  if (!user || !user.fcm_tokens || user.fcm_tokens.length === 0) {
    console.error("User not found or no FCM tokens available");
    return;
  }
  const tokens = user.fcm_tokens.map((token) => token.token).filter(Boolean);
  if (tokens.length === 0) {
    console.error("No valid FCM tokens found for user");
    return;
  }

  const notificationData = {
    type: "new_message",
    tag: "new_message" + message.chatId,
    title: `New message from ${message.sender.name}`,
    body: message.text_content || "You have a new message",
    image: message.media?.[0]?.url || "",
    avatar: message.sender.avatar || "",
    icon: message.sender.avatar || undefined,
    click_action: process.env.CLIENT_URL + `/chat/${message.chatId}`,
  };

  console.log("Sending new message notification to tokens:", tokens);
  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      data: notificationData,
    });

    console.log(response);

    console.log(`Successfully sent ${response.successCount} notifications`);
    console.log(`Failed to send ${response.failureCount} notifications`);

    // Check for invalid tokens
    const invalidTokens = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const error = resp.error;
        if (
          error.code === "messaging/invalid-registration-token" ||
          error.code === "messaging/registration-token-not-registered"
        ) {
          invalidTokens.push(tokens[idx]);
          console.log(
            `Invalid token detected: ${tokens[idx].substring(0, 20)}...`
          );
        }
      }
    });

    // Remove invalid tokens from database
    if (invalidTokens.length > 0) {
      await removeInvalidTokens(userId, invalidTokens);
      console.log(
        `Removed ${invalidTokens.length} invalid tokens for user ${userId}`
      );
    }

    return;
  } catch (error) {
    console.error("Error sending multicast notification:", error);
    return;
  }
};

module.exports = {
  SendNotification,
  SendNewFriendRequestNotification,
  SendFriendRequestAcceptedNotification,
  SendNewMessageNotification,
};
