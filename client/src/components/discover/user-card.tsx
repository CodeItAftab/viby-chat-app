import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useCancelFriendRequestMutation,
  useSendFriendRequestMutation,
} from "@/store/api/viby";
import {
  MapPin,
  UserCheck,
  UserPlus,
  Users,
  MessageCircle,
  Check,
  X,
  Sparkles,
} from "lucide-react";

export interface User {
  _id: string;
  name: string;
  username?: string;
  avatar?: string;
  email?: string;
  bio?: string; // Keeping bio in interface, but not displaying it as per request
  online?: boolean;
  mutualFriendsCount?: number;
  location?: string;
  type?: "user" | "friend" | "sent_req" | "req";
  age?: number;
  dob?: string | Date;
  requestId?: string;
  chatId?: string;
}

interface UserCardProps {
  user: User;
  showSuggestionBadge?: boolean;
}

export function UserCard({ user, showSuggestionBadge }: UserCardProps) {
  const [sendFriendRequest, { isLoading }] = useSendFriendRequestMutation();
  const [cancelFriendRequest, { isLoading: isCancelling }] =
    useCancelFriendRequestMutation();

  const handleSendRequest = async (userId: string) => {
    await sendFriendRequest(userId);
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!requestId) return;
    await cancelFriendRequest(requestId);
  };

  const handleAcceptRequest = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // setCurrentType("friend");
  };

  const handleDeclineRequest = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    // setCurrentType("user");
  };

  const renderActionButtons = () => {
    switch (user.type) {
      case "friend":
        return (
          <Button
            variant="outline"
            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 hover:border-primary transition-all duration-200 h-9 px-4 sm:h-10 sm:px-6 text-sm font-medium w-full sm:w-auto"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
        );

      case "sent_req":
        return (
          <Button
            onClick={() => handleCancelRequest(user.requestId!)}
            className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/10 border border-yellow-500/20 h-9 px-4 sm:h-10 sm:px-6 text-sm font-medium w-full sm:w-auto"
          >
            {isCancelling ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <UserCheck className="h-4 w-4 mr-2" />
            )}
            {isCancelling ? "Cancelling" : "Sent"}
          </Button>
        );

      case "req":
        return (
          <div className="flex items-center gap-2 w-full">
            <Button
              onClick={handleAcceptRequest}
              disabled={isLoading}
              className="bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white border border-green-500/20 hover:border-green-500 transition-all duration-200 h-9 px-3 sm:h-10 sm:px-4 text-sm font-medium flex-1"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1.5" />
                  Accept
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleDeclineRequest}
              disabled={isLoading}
              className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 transition-all duration-200 h-9 px-3 sm:h-10 sm:px-4 text-sm font-medium flex-1"
            >
              <X className="h-4 w-4 mr-1.5" />
              Decline
            </Button>
          </div>
        );

      default: // "user"
        return (
          <Button
            onClick={() => handleSendRequest(user._id)}
            disabled={isLoading}
            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 hover:border-primary transition-all duration-200 h-9 px-4 sm:h-10 sm:px-6 text-sm font-medium w-full sm:w-auto"
          >
            {isLoading ? (
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <UserPlus className="h-4 w-4 mr-2" />
            )}
            {isLoading ? "Adding..." : "Add"}
          </Button>
        );
    }
  };

  const getStatusBadge = () => {
    switch (user.type) {
      case "friend":
        return (
          <Badge className="bg-green-500/20 text-green-300 text-xs">
            Friend
          </Badge>
        );
      case "sent_req":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 text-xs">
            Request Sent
          </Badge>
        );
      case "req":
        return (
          <Badge className="bg-blue-500/20 text-blue-300 text-xs">
            Wants to Connect
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSuggestedBadge = () => {
    if (!showSuggestionBadge) return null;
    return (
      <Badge
        variant="secondary"
        className="bg-primary/10 text-primary border-primary/20 text-xs flex items-center gap-1 animate-in fade-in-0 zoom-in-95 duration-300"
      >
        <Sparkles className="h-3 w-3" />
        Suggested
      </Badge>
    );
  };

  return (
    <Card className="group relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          {/* Left Section: Avatar + Name/Username + Badges + Meta Info */}
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-2 ring-background/10 group-hover:ring-primary/20 transition-all duration-300">
                <AvatarImage
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground font-semibold text-sm sm:text-base">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {user.online && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-green-500 ring-2 ring-background animate-pulse" />
              )}
            </div>

            {/* Name, Username, Badges, Mutual Friends, Location */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-1 flex-wrap">
                <h3 className="font-semibold text-foreground text-base sm:text-lg truncate group-hover:text-primary transition-colors duration-200">
                  {user.name}
                </h3>
                {getStatusBadge()}
                {getSuggestedBadge()}
              </div>
              {user.username && (
                <p className="text-sm text-muted-foreground truncate">
                  {user.username}
                </p>
              )}

              {/* Meta Information (Mutual Friends, Location) - now directly below username */}
              <div className="flex items-center gap-4 flex-wrap mt-2">
                {user.mutualFriendsCount !== undefined &&
                  user.mutualFriendsCount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{user.mutualFriendsCount} mutual</span>
                    </div>
                  )}

                {/* {user.location && ( */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-[120px] sm:max-w-none">
                    {user.location || "India"}
                  </span>
                </div>
                {/* )} */}
              </div>
            </div>
          </div>

          {/* Right Section: Action Buttons */}
          <div className="w-full sm:w-auto sm:flex-shrink-0 sm:ml-auto mt-4 sm:mt-0">
            <div className="flex justify-center sm:justify-end">
              {renderActionButtons()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
