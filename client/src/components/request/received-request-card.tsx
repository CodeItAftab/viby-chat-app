import { UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RequestCard,
  RequestCardAvatar,
  RequestCardContent,
  RequestCardHeader,
  RequestCardActions,
} from "@/components/ui/request-card";
import type { FriendRequest } from "@/types";
import { formatRelativeTime, getISOString } from "@/lib/helper";
import {
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
} from "@/store/api/viby";

interface ReceivedRequestCardProps {
  request: FriendRequest;
}

export function ReceivedRequestCard({ request }: ReceivedRequestCardProps) {
  const [acceptFriendRequest, { isLoading: isAccepting }] =
    useAcceptFriendRequestMutation();
  const [rejectFriendRequest, { isLoading: isDeclining }] =
    useRejectFriendRequestMutation();

  const handleAcceptRequest = async (requestId: string) => {
    if (!requestId) return;
    await acceptFriendRequest(requestId);
  };

  const handleDeclineRequest = async (requestId: string) => {
    if (!requestId) return;
    await rejectFriendRequest(requestId);
  };

  const avatarFallback =
    request?.sender?.name
      ?.split(" ")
      ?.map((n: string) => n[0])
      .join("") || "U";

  const badge = (
    <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-full p-1">
      <UserCheck className="w-2.5 h-2.5 text-white" />
    </div>
  );

  const statusBadge = (
    <Badge className="bg-gradient-to-r from-emerald-500/15 to-green-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-400/30 text-[10px] sm:text-xs font-medium px-1.5 py-0.5">
      New Request
    </Badge>
  );

  return (
    <RequestCard className="hover:shadow--emerald-100/50 shadow-none hover:shadow-sm dark:hover:shadow--emerald-900/10 hover:border--emerald-200/40 dark:hover:border--emerald-700/40">
      <div className="flex items-start gap-3">
        <RequestCardAvatar
          src={request.sender?.avatar}
          alt={request.sender!.name}
          fallback={avatarFallback}
          badge={badge}
        />
        <RequestCardContent>
          <RequestCardHeader
            name={request.sender!.name}
            timestamp={formatRelativeTime(
              getISOString(request.createdAt) || ""
            )}
            badge={statusBadge}
            // mutualFriends={request.mutualFriends}
          />
          <RequestCardActions layout="vertical">
            <div className="flex items-center gap-2 sm:gap-3 w-full">
              <Button
                onClick={() => handleAcceptRequest(request._id)}
                disabled={isAccepting}
                size="sm"
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl px-3 sm:px-4 py-2 font-semibold shadow--xs hover:shadow--sm hover:shadow---emerald-500/25 transition-all duration-300 text-xs sm:text-sm flex-1 sm:flex-none min-w-0"
              >
                <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="truncate">Accept</span>
              </Button>
              <Button
                onClick={() => handleDeclineRequest(request._id)}
                disabled={isDeclining}
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-300/60 dark:border-slate-600/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300 hover:border--slate-400/60 dark:hover:border--slate-500/60 px-3 sm:px-4 py-2 font-semibold transition-all duration-300 text-xs sm:text-sm flex-1 sm:flex-none min-w-0"
              >
                <UserX className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="truncate">Decline</span>
              </Button>
            </div>
          </RequestCardActions>
        </RequestCardContent>
      </div>
    </RequestCard>
  );
}
