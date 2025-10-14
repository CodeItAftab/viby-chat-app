import { BASE_SERVER_URL } from "@/config/config";
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { FriendRequest, User } from "@/types";
import type { Chat, Media, Message } from "@/types/message";

interface SuggestedUsersResponse {
  success: boolean;
  message?: string;
  users?: User[];
}

interface SendFriendRequestResponse {
  success: boolean;
  message?: string;
  request?: {
    _id: string;
    receiver: {
      _id: string;
      name: string;
      username: string;
      avatar?: string;
    };
  };
}

interface CancelFriendRequestResponse {
  success: boolean;
  message?: string;
  requestId?: string;
}

interface GetFriendRequestsResponse {
  success: boolean;
  requests?: FriendRequest[];
  message?: string;
}

// Video processing utilities
const getVideoMetadata = (
  file: File
): Promise<{
  width: number;
  height: number;
  duration: number;
  aspectRatio: number;
}> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      const metadata = {
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
        aspectRatio: video.videoWidth / video.videoHeight,
      };
      URL.revokeObjectURL(video.src);
      resolve(metadata);
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error("Failed to load video metadata"));
    };

    video.src = URL.createObjectURL(file);
  });
};

const generateVideoThumbnail = (
  file: File,
  timeOffset: number = 1
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    video.preload = "metadata";
    video.currentTime = timeOffset;

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    video.onseeked = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.8);
      URL.revokeObjectURL(video.src);
      resolve(thumbnailUrl);
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error("Failed to generate thumbnail"));
    };

    video.src = URL.createObjectURL(file);
  });
};

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_SERVER_URL}/`,
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log(result);
    // I want to logout here
    api.dispatch({ type: "auth/logout" });
  }

  return result;
};

type UsersTag = { type: "Users"; id: string };

const vibyApi = createApi({
  reducerPath: "vibyApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users", "Chats", "Messages"],
  endpoints: (builder) => ({
    getSuggestedUsers: builder.query<User[], void>({
      query: () => "/user/suggested-friends",
      transformResponse: (response: SuggestedUsersResponse) =>
        response.users || [],
      providesTags: (result): UsersTag[] =>
        result
          ? [
              ...result.map((user) => ({
                type: "Users" as const,
                id: user._id,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    sendFriendRequest: builder.mutation<SendFriendRequestResponse, string>({
      query: (userId) => ({
        url: `/request/send`,
        body: { to: userId },
        method: "POST",
      }),
      async onQueryStarted(userId, { dispatch, queryFulfilled, getState }) {
        const patchSuggested = dispatch(
          vibyApi.util.updateQueryData(
            "getSuggestedUsers",
            undefined,
            (draft) => {
              const user = draft.find((u) => u._id === userId);
              if (user) user.type = "sent_req";
            }
          )
        );

        const patchSent = dispatch(
          vibyApi.util.updateQueryData(
            "getSentRequests",
            undefined,
            (draft) => {
              draft.push({
                _id: "temp-" + userId,
                createdAt: new Date().toISOString(),
                receiver: {
                  _id: userId,
                  name: "",
                  username: "",
                },
              });
            }
          )
        );

        const searchPatches: Array<{ undo: () => void }> = [];
        const state = getState() as {
          vibyApi?: { queries?: Record<string, unknown> };
        };
        const searchQueries = state.vibyApi?.queries;

        if (searchQueries) {
          Object.keys(searchQueries).forEach((queryKey) => {
            if (queryKey.startsWith("searchUsers(")) {
              const match = queryKey.match(/searchUsers\("([^"]*)"\)/);
              if (match) {
                const searchTerm = match[1];
                const patch = dispatch(
                  vibyApi.util.updateQueryData(
                    "searchUsers",
                    searchTerm,
                    (draft) => {
                      const user = draft.find((u) => u._id === userId);
                      if (user) user.type = "sent_req";
                    }
                  )
                );
                searchPatches.push(patch);
              }
            }
          });
        }

        try {
          const { data } = await queryFulfilled;

          if (data.request?.receiver) {
            dispatch(
              vibyApi.util.updateQueryData(
                "getSuggestedUsers",
                undefined,
                (draft) => {
                  const user = draft.find(
                    (u) => u._id === data.request?.receiver._id
                  );
                  if (user && data.request) user.requestId = data.request._id;
                }
              )
            );

            dispatch(
              vibyApi.util.updateQueryData(
                "getSentRequests",
                undefined,
                (draft) => {
                  const index = draft.findIndex(
                    (r) => r._id === "temp-" + userId
                  );
                  if (index !== -1 && data.request) {
                    draft[index] = {
                      _id: data.request._id,
                      createdAt: new Date().toISOString(),
                      receiver: data.request.receiver,
                    };
                  }
                }
              )
            );

            if (searchQueries) {
              Object.keys(searchQueries).forEach((queryKey) => {
                if (queryKey.startsWith("searchUsers(")) {
                  const match = queryKey.match(/searchUsers\("([^"]*)"\)/);
                  if (match) {
                    const searchTerm = match[1];
                    dispatch(
                      vibyApi.util.updateQueryData(
                        "searchUsers",
                        searchTerm,
                        (draft) => {
                          const user = draft.find(
                            (u) => u._id === data.request?.receiver._id
                          );
                          if (user && data.request)
                            user.requestId = data.request._id;
                        }
                      )
                    );
                  }
                }
              });
            }
          }
        } catch {
          patchSuggested.undo();
          patchSent.undo();
          searchPatches.forEach((p) => p.undo());
        }
      },
    }),

    cancelFriendRequest: builder.mutation<CancelFriendRequestResponse, string>({
      query: (requestId) => ({
        url: `/request/cancel/${requestId}`,
        method: "DELETE",
      }),
      async onQueryStarted(requestId, { dispatch, queryFulfilled, getState }) {
        const patchSuggested = dispatch(
          vibyApi.util.updateQueryData(
            "getSuggestedUsers",
            undefined,
            (draft) => {
              const user = draft.find((u) => u.requestId === requestId);
              if (user) {
                user.type = "user";
                delete user.requestId;
              }
            }
          )
        );

        const patchSent = dispatch(
          vibyApi.util.updateQueryData(
            "getSentRequests",
            undefined,
            (draft) => {
              const index = draft.findIndex((r) => r._id === requestId);
              if (index !== -1) draft.splice(index, 1);
            }
          )
        );

        const searchPatches: Array<{ undo: () => void }> = [];
        const state = getState() as {
          vibyApi?: { queries?: Record<string, unknown> };
        };
        const searchQueries = state.vibyApi?.queries;

        if (searchQueries) {
          Object.keys(searchQueries).forEach((queryKey) => {
            if (queryKey.startsWith("searchUsers(")) {
              const match = queryKey.match(/searchUsers\("([^"]*)"\)/);
              if (match) {
                const searchTerm = match[1];
                const patch = dispatch(
                  vibyApi.util.updateQueryData(
                    "searchUsers",
                    searchTerm,
                    (draft) => {
                      const user = draft.find((u) => u.requestId === requestId);
                      if (user) {
                        user.type = "user";
                        delete user.requestId;
                      }
                    }
                  )
                );
                searchPatches.push(patch);
              }
            }
          });
        }

        try {
          await queryFulfilled;
        } catch {
          patchSuggested.undo();
          patchSent.undo();
          searchPatches.forEach((p) => p.undo());
        }
      },
    }),

    acceptFriendRequest: builder.mutation<
      {
        success: boolean;
        message: string;
        requestId: string;
        chatId: string;
        friend: {
          _id: string;
          name: string;
          username: string;
          avatar?: string;
          online: boolean;
          chatId: string;
        };
      },
      string
    >({
      query: (requestId) => ({
        url: `/request/accept/${requestId}`,
        method: "POST",
      }),
      async onQueryStarted(requestId, { dispatch, queryFulfilled }) {
        const patchReceived = dispatch(
          vibyApi.util.updateQueryData(
            "getReceivedRequests",
            undefined,
            (draft) => {
              const index = draft.findIndex((r) => r._id === requestId);
              if (index !== -1) draft.splice(index, 1);
            }
          )
        );

        try {
          const { data } = await queryFulfilled;

          if (data?.friend) {
            dispatch(
              vibyApi.util.updateQueryData(
                "getFriends",
                undefined,
                (draft: User[]) => {
                  draft.push(data.friend);
                }
              )
            );
          }
        } catch {
          patchReceived.undo();
        }
      },
    }),

    rejectFriendRequest: builder.mutation<
      { success: boolean; message: string; requestId: string },
      string
    >({
      query: (requestId) => ({
        url: `/request/reject/${requestId}`,
        method: "DELETE",
      }),
      async onQueryStarted(requestId, { dispatch, queryFulfilled }) {
        const patchReceived = dispatch(
          vibyApi.util.updateQueryData(
            "getReceivedRequests",
            undefined,
            (draft) => {
              const index = draft.findIndex((r) => r._id === requestId);
              if (index !== -1) draft.splice(index, 1);
            }
          )
        );

        const patchSuggested = dispatch(
          vibyApi.util.updateQueryData(
            "getSuggestedUsers",
            undefined,
            (draft) => {
              const user = draft.find((u) => u.requestId === requestId);
              if (user) {
                user.type = "user";
                delete user.requestId;
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchReceived.undo();
          patchSuggested.undo();
        }
      },
    }),

    searchUsers: builder.query<User[], string>({
      query: (searchQuery) => ({
        url: `/user/search`,
        method: "GET",
        params: { query: searchQuery },
      }),
      transformResponse: (response: { success: boolean; users: User[] }) =>
        response.users || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((user) => ({
                type: "Users" as const,
                id: user._id,
              })),
              { type: "Users", id: "SEARCH" },
            ]
          : [{ type: "Users", id: "SEARCH" }],
    }),

    getSentRequests: builder.query<FriendRequest[], void>({
      query: () => "/request/all-sent-req",
      transformResponse: (res: GetFriendRequestsResponse) => res.requests || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({
                type: "Users" as const,
                id: r.receiver?._id,
              })),
              { type: "Users", id: "SENT_LIST" },
            ]
          : [{ type: "Users", id: "SENT_LIST" }],
    }),

    getReceivedRequests: builder.query<FriendRequest[], void>({
      query: () => "/request/all-received-req",
      transformResponse: (res: GetFriendRequestsResponse) => res.requests || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((r) => ({
                type: "Users" as const,
                id: r.sender?._id,
              })),
              { type: "Users", id: "RECEIVED_LIST" },
            ]
          : [{ type: "Users", id: "RECEIVED_LIST" }],
    }),

    getFriends: builder.query<User[], void>({
      query: () => "/user/all/friends",
      transformResponse: (res: { success: boolean; friends: User[] }) =>
        (res.friends || []).map((friend) => ({
          _id: friend._id,
          name: friend.name,
          username: friend.username,
          bio: friend.bio,
          chatId: friend.chatId ?? "",
          online: friend.online ?? false,
          avatar: friend.avatar,
          friendsSince: friend.friendsSince,
          mututalFriendsCount: friend.mutualFriendsCount,
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map((friend) => ({
                type: "Users" as const,
                id: friend._id,
              })),
              { type: "Users", id: "FRIENDS_LIST" },
            ]
          : [{ type: "Users", id: "FRIENDS_LIST" }],
    }),

    getChats: builder.query<Chat[], void>({
      query: () => "/chat/all_chats",
      transformResponse: (res: { success: boolean; chats: Chat[] }) =>
        res.chats || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((chat) => ({
                type: "Chats" as const,
                id: chat._id,
              })),
              { type: "Chats", id: "LIST" },
            ]
          : [{ type: "Chats", id: "LIST" }],
    }),

    getMessages: builder.query<Message[], string>({
      query: (chatId) => ({
        url: `/chat/get_messages/${chatId}`,
      }),
      transformResponse: (res: { success: boolean; messages: Message[] }) =>
        res.messages || [],
      providesTags: (result, error, chatId) =>
        result
          ? [
              ...result.map((msg) => ({
                type: "Messages" as const,
                id: msg._id,
              })),
              { type: "Messages", id: chatId }, // to invalidate per-chat messages
            ]
          : [{ type: "Messages", id: chatId }],
    }),

    sendMessage: builder.mutation<Message, FormData>({
      query: (formData) => ({
        url: "/chat/send_message",
        method: "POST",
        body: formData,
      }),
      transformResponse: (res: { success: boolean; message: Message }) =>
        res.message,

      async onQueryStarted(formData, { dispatch, queryFulfilled, getState }) {
        const chatId = formData.get("chatId") as string;
        const text = formData.get("text_content") as string;
        let type = formData.get("type") as Message["type"];
        // Ensure type is not "raw"
        if (type === "raw") {
          type = "file"; // or another valid type, depending on your logic
        }
        const mediaFiles = formData.getAll("media") as File[];
        const duration = formData.get("duration") as string;

        const tempId = `temp-${Date.now()}`;

        // Process media files with metadata extractions
        const previewMedia: (Media & {
          width?: number;
          height?: number;
          duration?: number;
          aspectRatio?: number;
          thumbnail_url?: string;
        })[] = await Promise.all(
          mediaFiles.map(async (file, index) => {
            let resourceType: "image" | "video" | "file" | "audio" = "file";
            const typePart = file.type.split("/")[0];

            if (
              typePart === "image" ||
              typePart === "video" ||
              typePart === "audio"
            ) {
              resourceType = typePart as typeof resourceType;
            }

            const baseMedia: Media = {
              url: URL.createObjectURL(file),
              // type: file.type.startsWith("image")
              //   ? "image"
              //   : file.type.startsWith("video")
              //   ? "video"
              //   : "file",
              _id: `temp-media-${tempId}-${index}`,
              public_id: `temp-public-id-${tempId}-${index}`,
              resource_type: resourceType,
              bytes: file.size,
              name: file.name,
              duration: parseFloat(duration) || 0,
            };

            // Extract video metadata if it's a video file
            if (file.type.startsWith("video/")) {
              try {
                const metadata = await getVideoMetadata(file);
                const thumbnailUrl = await generateVideoThumbnail(file, 1);

                return {
                  ...baseMedia,
                  width: metadata.width,
                  height: metadata.height,
                  duration: metadata.duration,
                  aspectRatio: metadata.aspectRatio,
                  thumbnail_url: thumbnailUrl,
                };
              } catch (error) {
                console.warn("Failed to extract video metadata:", error);
                return baseMedia;
              }
            }

            return baseMedia;
          })
        );

        const optimisticMessage: Message = {
          _id: tempId,
          chatId,
          sender: "me", // replace with current user ID
          type,
          text_content: text,
          media: previewMedia,
          state: "sending", // different from "sent" to reflect pending status
          timestamp: new Date().toISOString(),
          is_sender: true,
        };

        // Insert optimistic message
        const patch = dispatch(
          vibyApi.util.updateQueryData("getMessages", chatId, (draft) => {
            draft.push(optimisticMessage);
          })
        );

        const chatPatchs = dispatch(
          vibyApi.util.updateQueryData("getChats", undefined, (draft) => {
            const chatIndex = draft.findIndex((c) => c._id === chatId);
            const state = getState() as {
              vibyApi: { queries?: Record<string, unknown> };
            };
            const friend =
              state?.vibyApi.queries?.["getFriends"] &&
              (
                state.vibyApi.queries["getFriends"] as { data?: User[] }
              )?.data?.find((f: User) => f.chatId === chatId);

            if (chatIndex !== -1) {
              const chat = draft[chatIndex];
              chat.last_message = {
                text_content: text,
                media: previewMedia,
                sender: optimisticMessage.sender,
                state: "sending",
                timestamp: optimisticMessage.timestamp,
                type,
                is_sender: true,
              };
            } else if (friend) {
              // If chat not found, create a new one from friends list
              if (
                friend &&
                typeof friend === "object" &&
                "name" in friend &&
                "username" in friend &&
                "avatar" in friend &&
                "online" in friend
              ) {
                draft.push({
                  _id: chatId,
                  name: (friend as User).name,
                  username: (friend as User).username,
                  avatar: (friend as User).avatar,
                  friendId: (friend as User)._id,
                  last_message: {
                    text_content: text,
                    media: previewMedia,
                    sender: optimisticMessage.sender,
                    state: "sending",
                    timestamp: optimisticMessage.timestamp,
                    type,
                    is_sender: true,
                  },
                  unread_count: 0,
                  online: (friend as User).online || false,
                });
              }
            } else {
              // Friend is not preset then fire the get friends query
              // This will ensure that the chat is created with the correct last message
              if (!draft.some((c) => c._id === chatId)) {
                dispatch(
                  vibyApi.util.invalidateTags([{ type: "Chats", id: "LIST" }])
                );
              }
            }

            // sort chats by last message timestamp
            draft.sort((a, b) => {
              const aTime = new Date(a.last_message?.timestamp || 0).getTime();
              const bTime = new Date(b.last_message?.timestamp || 0).getTime();
              return bTime - aTime; // sort descending
            });
          })
        );

        try {
          const { data } = await queryFulfilled;

          // Replace optimistic message with actual message
          dispatch(
            vibyApi.util.updateQueryData("getMessages", chatId, (draft) => {
              const index = draft.findIndex((m) => m._id === tempId);
              if (index !== -1) {
                draft[index] = {
                  ...data,
                  is_sender: true,
                  state:
                    draft[index].state === "read"
                      ? draft[index].state
                      : data.state, // Update state to sent
                };
              }
            })
          );

          // Update chat with the new message
          dispatch(
            vibyApi.util.updateQueryData("getChats", undefined, (draft) => {
              const chatIndex = draft.findIndex((c) => c._id === chatId);
              if (chatIndex !== -1) {
                const chat = draft[chatIndex];
                chat.last_message = {
                  text_content: text,
                  media: previewMedia,
                  sender: data.sender,
                  state:
                    chat.last_message && chat.last_message.state === "read"
                      ? "read"
                      : data.state,
                  timestamp: data.timestamp,
                  type,
                  is_sender: true,
                };
              }
              // sort chats by last message timestamp
              draft.sort((a, b) => {
                const aTime = new Date(
                  a.last_message?.timestamp || 0
                ).getTime();
                const bTime = new Date(
                  b.last_message?.timestamp || 0
                ).getTime();
                return bTime - aTime; // sort descending
              });
            })
          );

          // Revoke blob URLs to clean up memory
          previewMedia.forEach((m) => {
            URL.revokeObjectURL(m.url);
            if (m.thumbnail_url && m.thumbnail_url.startsWith("data:")) {
              // Thumbnail is a data URL, no need to revoke
            }
          });
        } catch {
          patch.undo();
          chatPatchs.undo();

          // Revoke even on failure
          previewMedia.forEach((m) => {
            URL.revokeObjectURL(m.url);
          });
        }
      },
    }),

    getSelectedChatInfo: builder.query<Chat, string>({
      query: (chatId) => ({
        url: `/chat/info/${chatId}`,
        method: "GET",
      }),
      transformResponse: (res: { success: boolean; chat: Chat }) =>
        res.chat || {},
    }),

    readMessages: builder.mutation<void, string>({
      query: (chatId) => ({
        url: `/chat/read_messages/${chatId}`,
        method: "POST",
      }),

      async onQueryStarted(chatId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          vibyApi.util.updateQueryData("getMessages", chatId, (draft) => {
            draft.forEach((msg) => {
              if (!msg.is_sender) {
                msg.state = "read";
              }
            });
          })
        );

        const chatPatch = dispatch(
          vibyApi.util.updateQueryData("getChats", undefined, (draft) => {
            const chat = draft.find((c) => c._id === chatId);
            if (chat && chat.last_message && !chat.last_message.is_sender) {
              chat.last_message.state = "read";
              chat.unread_count = 0; // Reset unread count
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
          chatPatch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetSuggestedUsersQuery,
  useSendFriendRequestMutation,
  useCancelFriendRequestMutation,
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useGetSentRequestsQuery,
  useGetReceivedRequestsQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useGetFriendsQuery,
  useGetChatsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetSelectedChatInfoQuery,
  useReadMessagesMutation,
} = vibyApi;

export default vibyApi;

// This is a placeholder for getState, which should return the current Redux state.
// In actual usage, getState is provided by RTK Query's onQueryStarted context.
// Here, we return an empty object with the correct shape for type safety.
// function getState(): { vibyApi: { queries?: Record<string, unknown> } } {
//   return { vibyApi: { queries: {} } };
// }
