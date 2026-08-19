import type { Message } from "@/types/message";
import { Check, CheckCheck, Clock } from "lucide-react";

interface TextBubbleProps {
  message: Message;
}

export default function TextBubble({ message }: TextBubbleProps) {
  const formatTime = (date: string | Date) => {
    const NewDate = new Date(date);

    return NewDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusIcon = () => {
    switch (message.state) {
      case "sending":
        return <Clock className="h-3 w-3 text-white/70 animate-spin" />;
      case "sent":
        return <Check className="h-3 w-3 text-white/70" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-white/70" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-700" />;
      default:
        return null;
    }
  };

  if (message.type !== "text" || !message.text_content) {
    return;
  }

  return (
    <div
      className={`flex ${
        message.is_sender ? "justify-end" : "justify-start"
      } mb-1`}
    >
      <div className="max-w-[min(82vw,36rem)]">
        <div
          className={`
            relative rounded-2xl px-3 py-2 shadow-sm
            ${
              message.is_sender
                ? "rounded-br-md bg-blue-600 text-white"
                : "rounded-bl-md border border-gray-100 bg-white text-gray-800"
            }
          `}
        >
          <div className="flex items-end gap-2">
            <span className="min-w-0 flex-1 break-words text-sm leading-relaxed">
              {message.text_content}
            </span>

            <span
              className={`flex shrink-0 items-center gap-1 text-[11px] ${
                message.is_sender ? "text-white/80" : "text-gray-500"
              }`}
            >
              <span>{formatTime(message.timestamp)}</span>
              {message.is_sender && message.state && getStatusIcon()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
