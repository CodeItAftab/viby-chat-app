import type React from "react";

import {
  Check,
  CheckCheck,
  Clock,
  File,
  ImageIcon,
  Mic,
  Phone,
  Video,
} from "lucide-react";
import {
  ListItem,
  ListItemAvatar,
  ListItemContent,
  ListItemHeader,
  ListItemTitle,
  ListItemMeta,
  ListItemDescription,
  ListItemActions,
} from "@/components/ui/list-item";
import { UnreadBadge } from "@/components/ui/unread-badge";
import { ActionButton } from "@/components/ui/action-button";
import type { Chat } from "@/types/message";
import { formatTime } from "@/lib/helper";

interface ChatListItemProps {
  chat: Chat;
  isSelected?: boolean;
  onClick?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
}

export function ChatListItem({
  chat,
  isSelected = false,
  onClick,
  onCall,
  onVideoCall,
}: ChatListItemProps) {
  const avatarFallback = chat.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const getStatusIcon = () => {
    if (!chat.last_message?.is_sender) return null;

    switch (chat.last_message?.state) {
      case "sending":
        return (
          <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 animate-pulse" />
        );
      case "sent":
        return (
          <Check className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
        );
      case "delivered":
        return (
          <CheckCheck className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
        );
      case "read":
        return (
          <CheckCheck className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
        );
      default:
        return null;
    }
  };

  const getMessageIcon = (type: string) => {
    const iconClass = "w-3.5 h-3.5 text-slate-500 dark:text-slate-400";
    switch (type) {
      case "image":
        return <ImageIcon className={iconClass} />;
      case "video":
        return <Video className={iconClass} />;
      case "audio":
        return <Mic className={iconClass} />;
      case "file":
        return <File className={iconClass} />;
      default:
        return null;
    }
  };

  const getMessagePreview = () => {
    if (!chat.last_message) {
      return (
        <span className="text-slate-400 dark:text-slate-500 italic text-sm">
          No messages yet
        </span>
      );
    }

    const { type, text_content } = chat.last_message;

    if (type === "text") {
      return text_content;
    }

    if (text_content) {
      return text_content;
    }

    const typeLabels = {
      image: "Photo",
      video: "Video",
      audio: "Voice message",
      file: "File",
    };

    return typeLabels[type as keyof typeof typeLabels] || "Message";
  };

  return (
    <ListItem selected={isSelected} onClick={onClick}>
      <ListItemAvatar
        src={chat.avatar}
        alt={chat.name}
        fallback={avatarFallback}
        online={chat.online}
      />
      <ListItemContent>
        <ListItemHeader>
          <ListItemTitle className="font-semibold text-slate-900 dark:text-slate-100">
            {chat.name}
          </ListItemTitle>
          <div className="flex items-center gap-2">
            <ListItemMeta className="text-xs text-slate-500 dark:text-slate-400">
              {chat.last_message?.timestamp &&
                formatTime(chat.last_message.timestamp)}
            </ListItemMeta>
            <ListItemActions visible="hover">
              {onCall && (
                <ActionButton
                  icon={<Phone className="w-4 h-4" />}
                  tooltip="Call"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    onCall();
                  }}
                />
              )}
              {onVideoCall && (
                <ActionButton
                  icon={<Video className="w-4 h-4" />}
                  tooltip="Video Call"
                  onClick={(e) => {
                    e.stopPropagation();
                    onVideoCall();
                  }}
                />
              )}
            </ListItemActions>
          </div>
        </ListItemHeader>

        <div className="flex items-center justify-between mt-1">
          {chat.isTyping ? (
            <ListItemDescription className="flex items-center gap-2 flex-1 min-w-0">
              <span className="truncate text-sm font-semibold text-blue-600 dark:text-blue-400 leading-relaxed">
                typing...
              </span>
            </ListItemDescription>
          ) : chat.isRecording ? (
            <span className="truncate text-sm font-semibold text-blue-600 dark:text-blue-400 leading-relaxed">
              <Mic className="inline w-4 h-4 mr-1" />
              recording...
            </span>
          ) : (
            <>
              <ListItemDescription className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  {getStatusIcon()}
                  {chat.last_message && getMessageIcon(chat.last_message.type)}
                  <span className="truncate text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {getMessagePreview()}
                  </span>
                </div>
              </ListItemDescription>

              {(chat?.unread_count ?? 0) > 0 && (
                <div className="flex-shrink-0 ml-2">
                  <UnreadBadge
                    className="text-xs font-medium"
                    count={chat.unread_count ?? 0}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </ListItemContent>
    </ListItem>
  );
}
