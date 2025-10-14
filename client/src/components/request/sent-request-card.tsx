import { Clock, UserX } from "lucide-react";
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
import { useCancelFriendRequestMutation } from "@/store/api/viby";
import { formatRelativeTime, getISOString } from "@/lib/helper";

interface SentRequestCardProps {
  request: FriendRequest;
}

export function SentRequestCard({ request }: SentRequestCardProps) {
  const [cancelFriendRequest, { isLoading: isCancelling }] =
    useCancelFriendRequestMutation();

  const handleCancel = async (requestId: string) => {
    if (!requestId) return;
    await cancelFriendRequest(requestId);
  };

  const avatarFallback =
    request.receiver?.name
      ?.split(" ")
      ?.map((n: string) => n[0])
      .join("") || "U";

  const badge = (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-1">
      <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
    </div>
  );

  const statusBadge = (
    <Badge className="bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 dark:border-amber-400/30 text-[10px] sm:text-xs font-medium px-1.5 py-0.5">
      <Clock className="w-2.5 h-2.5 mr-1 flex-shrink-0" />
      Pending
    </Badge>
  );

  return (
    <RequestCard className="hover:--amber-100/50 dark:hover:--blue-900/10 shadow-none hover:shadow-sm hover:border-blue-200/40 dark:hover:border-blue-700/40">
      <div className="flex items-start gap-3">
        <RequestCardAvatar
          src={request.receiver?.avatar}
          alt={request.receiver!.name}
          fallback={avatarFallback}
          badge={badge}
        />
        <RequestCardContent>
          <RequestCardHeader
            name={request.receiver!.name}
            timestamp={`Sent ${formatRelativeTime(
              getISOString(request.createdAt)
            )}`}
            badge={statusBadge}
          />
          <RequestCardActions>
            <Button
              onClick={() => handleCancel(request._id)}
              disabled={isCancelling}
              variant="outline"
              size="sm"
              className="rounded-xl border-red-300/60 dark:border-red-600/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-300 hover:border-red-400/60 dark:hover:border-red-500/60 px-3 sm:px-4 py-2 font-semibold transition-all duration-300 text-xs sm:text-sm --sm hover:--md"
            >
              <UserX className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Cancel Request</span>
            </Button>
          </RequestCardActions>
        </RequestCardContent>
      </div>
    </RequestCard>
  );
}
