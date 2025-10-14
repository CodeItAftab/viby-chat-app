import { ChatListHeader } from "@/components/chat-list-header";
import { EmptyState } from "@/components/empty-state";
import { FriendListItem } from "@/components/friend/friend-list-item";
import { useGetFriendsQuery } from "@/store/api/viby";
import { useNavigate } from "react-router-dom";

export default function FriendsPage() {
  const { data: friends, isLoading, error } = useGetFriendsQuery();
  console.log("Friends data:", friends);
  const navigate = useNavigate();

  return (
    <>
      {/* Friends List - Hide for full-screen pages on desktop */}
      <div className="w-full lg:w-84 bg-card/25 backdrop-blur-xl flex flex-col border-r border-border">
        {/* Header */}
        <ChatListHeader
          title="Friends"
          activeSection="friends"
          searchQuery=""
          onSearchChange={() => {}}
          showNotifications={false}
          profileData={{
            name: "User",
            email: "user@email.com",
            status: "Available",
          }}
          notificationSettings={false}
          onNotificationsClick={() => {}}
          onNotificationSettingsChange={() => {}}
        />

        {/* Content List */}
        <div className="flex-1 overflow-y-auto px-2 pb-20 lg:pb-4 pt-2 scrollbar-hide">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-muted-foreground">Loading friends...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-destructive">Failed to load friends</div>
            </div>
          ) : !friends || friends.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-muted-foreground">No friends yet</div>
            </div>
          ) : (
            friends.map((friend) => (
              <FriendListItem
                key={friend._id}
                friend={friend}
                // onClick={() => handleUserClick(friend)}
                onMessage={() => navigate(`/chat/${friend.chatId}`)}
              />
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col max-lg:hidden">
        <EmptyState activeSection="chats" />
      </div>
    </>
  );
}
