import { Phone, PhoneMissed, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import {
  ListItem,
  ListItemAvatar,
  ListItemContent,
  ListItemHeader,
  ListItemTitle,
  ListItemMeta,
  ListItemDescription,
} from "@/components/ui/list-item";
import { cn } from "@/lib/utils";
import type { Call } from "@/types";

interface CallListItemProps {
  call: Call;
  onClick?: () => void;
  onCallback?: () => void;
}

export function CallListItem({ call, onClick, onCallback }: CallListItemProps) {
  const avatarFallback = call.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const getCallIcon = () => {
    const iconClass = "w-3 h-3 sm:w-4 sm:h-4";

    switch (call.type) {
      case "missed":
        return <PhoneMissed className={cn(iconClass, "text-red-400")} />;
      case "incoming":
        return <PhoneIncoming className={cn(iconClass, "text-emerald-400")} />;
      case "outgoing":
        return <PhoneOutgoing className={cn(iconClass, "text-blue-400")} />;
      default:
        return <Phone className={cn(iconClass, "text-emerald-400")} />;
    }
  };

  const getCallText = () => {
    if (call.type === "missed") return "Missed call";
    return `${call.duration} • ${call.type}`;
  };

  return (
    <ListItem onClick={onClick}>
      <ListItemAvatar
        src={call.avatar}
        alt={call.name}
        fallback={avatarFallback}
      />

      <ListItemContent>
        <ListItemHeader>
          <ListItemTitle>{call.name}</ListItemTitle>
          <ListItemMeta>{call.timestamp}</ListItemMeta>
        </ListItemHeader>

        <div className="flex items-center">
          {getCallIcon()}
          <ListItemDescription className="ml-2">
            {getCallText()}
          </ListItemDescription>
        </div>
      </ListItemContent>
    </ListItem>
  );
}
