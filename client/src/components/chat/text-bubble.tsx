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
      <div
        className={`relative max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl`}
      >
        <div
          className={`
            relative px-3 py-2 rounded-lg shadow-sm
            ${
              message.is_sender
                ? "bg-blue-600 text-white removed-chat-bubble-right"
                : "bg-white text-gray-800 border border-gray-100 removed-chat-bubble-left"
            }
          `}
        >
          <div className="relative">
            <span className="text-sm leading-relaxed break-words pr-19">
              {message.text_content}
            </span>

            {/* Inline timestamp and status - positioned absolutely */}
            <span
              className={`
                absolute bottom-0 right-0 flex items-center space-x-1 text-[12px] shrink-0 w-fit
                ${message.is_sender ? "text-white/80" : "text-gray-500"}
                ml-2 pl-2
              `}
            >
              <span className="shrink-o w-fit">
                {formatTime(message.timestamp)}
              </span>
              {message.is_sender && message.state && getStatusIcon()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
