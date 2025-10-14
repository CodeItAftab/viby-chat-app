import { MessageCircle, MoreHorizontal } from "lucide-react";
import {
  ListItem,
  ListItemAvatar,
  ListItemContent,
  ListItemHeader,
  ListItemTitle,
  ListItemActions,
} from "@/components/ui/list-item";
import { ActionButton } from "@/components/ui/action-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types";

// Helper function to format friendship date to "Jan 2024" format
const formatFriendshipDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

interface FriendListItemProps {
  friend: User;
  onClick?: () => void;
  onMessage?: () => void;
  onViewProfile?: () => void;
  onBlock?: () => void;
  onRemove?: () => void;
}

export function FriendListItem({
  friend,
  onClick,
  onViewProfile,
  onBlock,
  onRemove,
  onMessage,
}: FriendListItemProps) {
  const avatarFallback = friend.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <ListItem
      onClick={onClick}
      className="hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-cyan-600/10 hover:border-blue-500/20 transition-all duration-300 p-2 sm:p-4 mb-2 rounded-xl gap-2"
    >
      <ListItemAvatar
        src={friend.avatar}
        alt={friend.name}
        fallback={avatarFallback}
        online={friend.online}
        // size="md"
      />
      <ListItemContent className="ml-2 sm:ml-4">
        <ListItemHeader>
          <ListItemTitle className="text-foreground text-base font-semibold flex-1 min-w-0 pr-2">
            {friend.name}
          </ListItemTitle>
          <ListItemActions className="ml-auto flex-shrink-0 max-lg:opacity-100">
            {/* {onMessage && ( */}
            <ActionButton
              icon={<MessageCircle className="w-4 h-4" />}
              tooltip="Send Message"
              className="text-blue-500 hover:bg-blue-500/20 hover:text-blue-600 transition-colors duration-200 w-8 h-8 sm:w-9 sm:h-9"
              onClick={(e) => {
                e.stopPropagation();
                onMessage?.();
              }}
            />
            {/* )} */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ActionButton
                  icon={<MoreHorizontal className="w-4 h-4" />}
                  tooltip="More Options"
                  className="w-8 h-8 sm:w-9 sm:h-9"
                  onClick={(e) => e.stopPropagation()}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-card border-border shadow-lg"
                align="end"
              >
                {onViewProfile && (
                  <DropdownMenuItem
                    className="text-foreground hover:bg-muted text-sm cursor-pointer"
                    onClick={onViewProfile}
                  >
                    View Profile
                  </DropdownMenuItem>
                )}
                {onBlock && (
                  <DropdownMenuItem
                    className="text-foreground hover:bg-muted text-sm cursor-pointer"
                    onClick={onBlock}
                  >
                    Block User
                  </DropdownMenuItem>
                )}
                {onRemove && (
                  <DropdownMenuItem
                    className="text-red-500 hover:bg-red-500/10 text-sm cursor-pointer"
                    onClick={onRemove}
                  >
                    Remove Friend
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </ListItemActions>
        </ListItemHeader>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          {friend.mutualFriendsCount && friend.mutualFriendsCount > 0 && (
            <span className="flex-shrink-0">
              {friend.mutualFriendsCount} mutual friend
              {friend.mutualFriendsCount !== 1 ? "s" : ""}
            </span>
          )}
          {friend.friendsSince && (
            <span className="flex-shrink-0">
              {friend.mutualFriendsCount &&
                friend.mutualFriendsCount > 0 &&
                " • "}
              Friends since {formatFriendshipDate(friend.friendsSince)}
            </span>
          )}
        </div>
      </ListItemContent>
    </ListItem>
  );
}
