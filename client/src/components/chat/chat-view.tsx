import { useEffect } from "react";
import { useGetChatsQuery, useReadMessagesMutation } from "@/store/api/viby";
import { useParams } from "react-router-dom";
import ChatViewHeader from "./ChatViewHeader";
import { MessageInput } from "./message-input";
import MessageList from "./MessageList";

export function ChatView() {
  const chatId = useParams<{ chatId: string }>().chatId;
  const [readMessages] = useReadMessagesMutation();
  const { data: chats = [] } = useGetChatsQuery();

  const chat = chats.find((candidate) => candidate._id === chatId);

  const initialUnreadCount = chat?.unread_count ?? 0;
  const hasUnreadMessages = initialUnreadCount > 0;

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
      <MessageList initialUnreadCount={initialUnreadCount} />
      <div className="flex-shrink-0">
        <MessageInput />
      </div>
    </div>
  );
}
