import vibyApi from "@/store/api/viby";
import { setIsTyping } from "@/store/slices/app";
import { store } from "@/store/store";
import type { FriendRequest, User } from "@/types";
import type { LastMessage, Message } from "@/types/message";

export const HandleNewMessage = (data: { message: Message }) => {
  console.log("📩 New message received:", data.message);
  // Handle new message event, e.g., update state or notify user
  const { message } = data;
  const state = store.getState();
  const dispatch = store.dispatch;

  // 1️⃣ Updating the Chat List here

  dispatch(
    vibyApi.util.updateQueryData("getChats", undefined, (draft) => {
      // Find the chat index in the draft state
      const chatIndex = draft.findIndex((chat) => chat._id === message.chatId);

      if (chatIndex === -1) {
        // Chat doesn't exist → create a new one from friends list
        const friend = state.vibyApi.queries?.["getFriends"]?.data?.find(
          (f: User) => f.chatId === message.chatId
        );

        if (friend) {
          draft.push({
            _id: friend.chatId,
            name: friend.name,
            username: friend.username,
            friendId: friend._id,
            online: friend.online ?? false,
            avatar: friend.avatar,
            last_message: message as LastMessage,
            unread_count: 1,
          });
        } else {
          // Invalidate the getChats query to refetch the chats
          dispatch(vibyApi.util.invalidateTags(["Chats"]));
        }
      } else {
        // Chat exists → update the last message and unread count
        const chat = draft[chatIndex];
        chat.last_message = message as LastMessage;
        chat.unread_count = (chat.unread_count ?? 0) + 1;
      }

      // Sort chats by last_message.timestamp descending
      draft.sort((a, b) => {
        const aTime = a.last_message?.timestamp
          ? new Date(a.last_message.timestamp).getTime()
          : 0;
        const bTime = b.last_message?.timestamp
          ? new Date(b.last_message.timestamp).getTime()
          : 0;
        return bTime - aTime;
      });
    })
  );

  // 2️⃣ Update Messages if we're on the same chat

  const selectedChatId = state.app?.selectedChatId;
  console.log("Selected Chat ID:", selectedChatId);

  // If the new message belongs to the currently selected chat, update its messages
  if (selectedChatId === message.chatId) {
    dispatch(
      vibyApi.util.updateQueryData("getMessages", selectedChatId, (draft) => {
        draft.push(message);
      })
    );

    // dispatch readMessages mutation to mark the message as read
    dispatch(vibyApi.endpoints.readMessages.initiate(selectedChatId));
  }
};

export const HandleMessageRead = (data: { chatId: string }) => {
  console.log("📖 Messages read in chat:", data);
  const { chatId } = data;

  const state = store.getState();
  const dispatch = store.dispatch;

  // 1️⃣ Update the chat list to reset unread count
  dispatch(
    vibyApi.util.updateQueryData("getChats", undefined, (draft) => {
      const chatIndex = draft.findIndex((chat) => chat._id === chatId);
      if (chatIndex !== -1) {
        draft[chatIndex].unread_count = 0; // Reset unread count
        if (draft[chatIndex].last_message) {
          draft[chatIndex].last_message.state = "read"; // Update last message state
        }
      }
    })
  );

  // 2️⃣ Update messages in the selected chat
  const selectedChatId = state.app?.selectedChatId;

  if (selectedChatId === chatId) {
    dispatch(
      vibyApi.util.updateQueryData("getMessages", selectedChatId, (draft) => {
        draft.forEach((message) => {
          if (message.state !== "read" && message.is_sender) {
            message.state = "read"; // Update all messages in the chat to read
          }
        });
      })
    );
  }
};

export const HanldeMessageDelivered = (data: { chatId: string }) => {
  const { chatId } = data;

  // if the chatId is selected chatId, update the messages in the selected chat
  const state = store.getState();
  const dispatch = store.dispatch;
  const selectedChatId = state.app?.selectedChatId;
  if (selectedChatId === chatId) {
    dispatch(
      vibyApi.util.updateQueryData("getMessages", selectedChatId, (draft) => {
        draft.forEach((message) => {
          if (message.state === "sent" && message.is_sender) {
            message.state = "delivered"; // Update all messages in the chat to delivered
          }
        });
      })
    );
  }

  // Update the chat list to reflect message delivery if the chat exists and last message is sent by the user
  dispatch(
    vibyApi.util.updateQueryData("getChats", undefined, (draft) => {
      const chatIndex = draft.findIndex((chat) => chat._id === chatId);
      if (chatIndex !== -1 && draft[chatIndex].last_message?.is_sender) {
        draft[chatIndex].last_message.state = "delivered"; // Update last message state
      }
    })
  );
};

export const HandleFrinedOnlineStatusChange = (data: {
  friendId: string;
  online: boolean;
}) => {
  const { friendId, online } = data;

  console.log("👤 Friend online status changed:", data);

  // 1. Update the online status of the friend in the friends list
  store.dispatch(
    vibyApi.util.updateQueryData("getFriends", undefined, (draft) => {
      const friendIndex = draft.findIndex((f) => f._id === friendId);
      if (friendIndex !== -1) {
        draft[friendIndex].online = online; // Update online status
      }
    })
  );

  // 2. Update the online status in the selected chat info if it's the same friend
  const state = store.getState();
  const selectedChatId = state.app?.selectedChatId;
  if (selectedChatId) {
    store.dispatch(
      vibyApi.util.updateQueryData(
        "getSelectedChatInfo",
        selectedChatId,
        (draft) => {
          if (draft && draft.friendId === friendId) {
            draft.online = online; // Update online status in selected chat info
          }
        }
      )
    );
  }

  // 3. Update the chat list to reflect the online status change
  store.dispatch(
    vibyApi.util.updateQueryData("getChats", undefined, (draft) => {
      const chatIndex = draft.findIndex((chat) => chat.friendId === friendId);
      if (chatIndex !== -1) {
        draft[chatIndex].online = online; // Update online status in chat list
      }
    })
  );
};

export const HanldeTypingStatus = (data: {
  chatId: string;
  isTyping: boolean;
}) => {
  const { chatId, isTyping } = data;
  const state = store.getState();
  const dispatch = store.dispatch;

  // update the chat list to reflect typing status
  dispatch(
    vibyApi.util.updateQueryData("getChats", undefined, (draft) => {
      const chatIndex = draft.findIndex((chat) => chat._id === chatId);
      if (chatIndex !== -1) {
        draft[chatIndex].isTyping = isTyping; // Update typing status
      }
    })
  );

  // If the selected chat is the one being typed in, update its typing status
  const selectedChatId = state.app?.selectedChatId;
  if (selectedChatId === chatId) {
    // dispatch setIsTyping action to update the app state
    dispatch(setIsTyping(isTyping));

    vibyApi.util.updateQueryData("getSelectedChatInfo", chatId, (draft) => {
      if (draft && draft._id === chatId) {
        draft.isTyping = isTyping; // Update typing status in selected chat info
      }
    });
  }
};

export const handleRecordingStatus = (data: {
  chatId: string;
  isRecording: boolean;
}) => {
  const { chatId, isRecording } = data;
  const state = store.getState();
  const dispatch = store.dispatch;
  console.log("🎙️ Recording status changed:", data);

  // update the chat list to reflect recording status
  dispatch(
    vibyApi.util.updateQueryData("getChats", undefined, (draft) => {
      const chatIndex = draft.findIndex((chat) => chat._id === chatId);
      if (chatIndex !== -1) {
        draft[chatIndex].isRecording = isRecording; // Update recording status
      }
    })
  );

  // If the selected chat is the one being recorded in, update its recording status
  const selectedChatId = state.app?.selectedChatId;
  if (selectedChatId === chatId) {
    vibyApi.util.updateQueryData("getSelectedChatInfo", chatId, (draft) => {
      if (draft && draft._id === chatId) {
        draft.isRecording = isRecording; // Update recording status in selected chat info
      }
    });
  }
};

export const HanldeNewFriendRequest = (data: { request: FriendRequest }) => {
  const { request } = data;

  // Push the new friend request to the recieved requests query data
  store.dispatch(
    vibyApi.util.updateQueryData("getReceivedRequests", undefined, (draft) => {
      draft.push(request);
    })
  );
};

export const HanldeFriendRequestAccepted = (data: {
  requestId: string;
  friend: User;
}) => {
  const { requestId, friend } = data;

  // Remove the accepted request from the sent requests query data
  store.dispatch(
    vibyApi.util.updateQueryData("getSentRequests", undefined, (draft) => {
      const index = draft.findIndex((req) => req._id === requestId);
      if (index !== -1) {
        draft.splice(index, 1); // Remove the request
      }
    })
  );

  // Add the new friend to the friends list
  store.dispatch(
    vibyApi.util.updateQueryData("getFriends", undefined, (draft) => {
      // Check if the friend already exists
      const existingFriendIndex = draft.findIndex((f) => f._id === friend._id);
      if (existingFriendIndex === -1) {
        draft.push(friend); // Add the new friend
      } else {
        // If the friend already exists, update their information
        draft[existingFriendIndex] = {
          ...draft[existingFriendIndex],
          ...friend,
        };
      }
    })
  );

  // update the suggested users query and search results
  store.dispatch(
    vibyApi.util.updateQueryData("getSuggestedUsers", undefined, (draft) => {
      // Remove the accepted friend from suggested users
      const index = draft.findIndex((user) => user._id === friend._id);
      if (index !== -1) {
        // change into friend object
        draft[index] = {
          ...draft[index],
          ...friend,
          requestId: undefined, // Remove requestId as it's no longer a request
          type: "friend", // Set type to friend
        };
      }
    })
  );

  store.dispatch(
    vibyApi.util.updateQueryData("searchUsers", "", (draft) => {
      // Remove the accepted friend from search results
      const index = draft.findIndex((user) => user._id === friend._id);
      if (index !== -1) {
        // change into friend object
        draft[index] = {
          ...draft[index],
          ...friend,
          requestId: undefined, // Remove requestId as it's no longer a request
          type: "friend", // Set type to friend
        };
      }
    })
  );
};

export const HanldeFriendRequestRejected = (data: { requestId: string }) => {
  const { requestId } = data;

  // Remove the rejected request from the received requests query data
  store.dispatch(
    vibyApi.util.updateQueryData("getSentRequests", undefined, (draft) => {
      const index = draft.findIndex((req) => req._id === requestId);
      if (index !== -1) {
        draft.splice(index, 1); // Remove the request
      }
    })
  );
};

export const HanldeFriendRequestCancelled = (data: { requestId: string }) => {
  const { requestId } = data;

  // Remove the cancelled request from the received requests query data
  store.dispatch(
    vibyApi.util.updateQueryData("getReceivedRequests", undefined, (draft) => {
      const index = draft.findIndex((req) => req._id === requestId);
      if (index !== -1) {
        draft.splice(index, 1); // Remove the request
      }
    })
  );
};
