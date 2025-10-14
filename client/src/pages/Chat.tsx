import { ChatListHeader } from "@/components/chat-list-header";
import { ChatListItem } from "@/components/chat/chat-list-item";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";
import { useGetChatsQuery } from "@/store/api/viby";
import { Outlet, useNavigate, useParams } from "react-router-dom";

const Chat = () => {
  const pathname = window.location.pathname;
  const isChatRoot = pathname === "/chat" || pathname === "/chat/";
  const navigate = useNavigate();
  const chatId = useParams<"chatId">().chatId;

  const { data: chats = [] } = useGetChatsQuery();
  console.log("Fetched Chats:", chats);

  return (
    <>
      <div
        className={cn(
          "w-full lg:w-84 bg-card/25 backdrop-blur-xl flex flex-col border-r border-border",
          chatId && "max-lg:hidden"
        )}
      >
        {/* Header */}
        <ChatListHeader title="Messages" activeSection="chats" />

        {/* Content List */}
        <div className="flex-1 overflow-y-auto px-2 pb-20 lg:pb-4 pt-2 scrollbar-hide">
          {chats.map((chat) => (
            <ChatListItem
              key={chat._id}
              chat={chat}
              isSelected={chatId === chat._id}
              onClick={() => {
                if (chatId === chat._id) return;
                navigate(`/chat/${chat._id}`);
              }}
            />
          ))}
        </div>
      </div>
      {!chatId && (
        <div className="flex-1 flex flex-col max-md:hidden">
          {isChatRoot && <EmptyState activeSection="chats" />}
        </div>
      )}

      {!isChatRoot && (
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      )}
    </>
  );
};

export default Chat;
