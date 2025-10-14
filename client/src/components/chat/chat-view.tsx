import { useEffect } from "react";
import { store } from "@/store/store";
import { useReadMessagesMutation } from "@/store/api/viby";
import { useParams } from "react-router-dom";
import ChatViewHeader from "./ChatViewHeader";
import { MessageInput } from "./message-input";
import MessageList from "./MessageList";
import type { Chat } from "@/types/message";

export function ChatView() {
  const chatId = useParams<{ chatId: string }>().chatId;
  const state = store.getState();

  const [readMessages] = useReadMessagesMutation();

  // check if the chat from chatList has unread messages greater than 0 in getchats query
  const chat = state.vibyApi.queries["getChats(undefined)"]?.data?.find(
    (chat: Chat) => chat._id === chatId
  );
  // if chat is not found, return null

  const hasUnreadMessages = (chat && chat?.unread_count > 0) || 0;

  useEffect(() => {
    if (chatId && hasUnreadMessages) {
      readMessages(chatId).catch((error) => {
        console.error("Failed to mark messages as read:", error);
      });
    }
    // Mark as read when chatId  updates
  }, [chatId, readMessages, hasUnreadMessages]);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-white dark:bg-slate-900">
      <ChatViewHeader />
      <MessageList />
      <div className="flex-shrink-0">
        <MessageInput />
      </div>
    </div>
  );
}
