import { useGetMessagesQuery } from "@/store/api/viby";
import type { Message } from "@/types/message";
import React from "react";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import AudioBubble from "./audio-bubble";
import ImageBubble from "./image-bubble";
import VideoBubble from "./video-bubble";
import FileBubble from "./file-bubble";
import TextBubble from "./text-bubble";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/types";

const MessageList: React.FC = () => {
  const chatId = useParams<{ chatId: string }>().chatId;

  const { isTyping } = useSelector((state: RootState) => state.app);

  const { data: messages } = useGetMessagesQuery(chatId || "");

  const GroupMessagesByDate = useCallback((messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      let timestamp = message.timestamp;

      // Fallback to createdAt or now
      if (!timestamp || isNaN(new Date(timestamp).getTime())) {
        timestamp = message.timestamp || new Date().toISOString();
      }

      const dateKey = new Date(timestamp).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return groups;
  }, []);

  const FormatDateSeparator = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      const now = new Date();
      const isSameYear = date.getFullYear() === now.getFullYear();

      // Check if within the last 7 days (excluding today and yesterday)
      const daysAgo = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysAgo < 7 && daysAgo > 1 && isSameYear) {
        // Show day name (e.g., "Monday")
        return date.toLocaleDateString("en-US", { weekday: "long" });
      } else if (isSameYear) {
        // Show month and day (e.g., "March 5")
        return date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        });
      } else {
        // Show month, day, and year (e.g., "March 5, 2023")
        return date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      }
    }
  }, []);

  const messageGroups = GroupMessagesByDate([...(messages || [])]);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950">
      <div className="p-3 sm:p-6">
        {Object.entries(messageGroups).map(([dateString, dateMessages]) => (
          <div key={dateString} className="mb-6 flex flex-col">
            {/* Date Separator */}
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/80 w-28 text-center dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {FormatDateSeparator(dateString)}
                </span>
              </div>
            </div>

            {/* Messages for this date - Tighter grouping */}
            <div className="space-y-0 flex flex-col flex-grow">
              {dateMessages.map((message, index) => {
                switch (message.type) {
                  case "audio":
                    return (
                      <AudioBubble
                        key={message._id || index}
                        message={message}
                      />
                    );
                  case "image":
                    return (
                      <ImageBubble
                        key={message._id || index}
                        message={message}
                      />
                    );
                  case "video":
                    return (
                      <VideoBubble
                        key={message._id || index}
                        message={message}
                      />
                    );
                  // Add cases for other message types as needed
                  case "file":
                    return (
                      <FileBubble
                        key={message._id || index}
                        message={message}
                      />
                    );
                  default:
                    return (
                      <TextBubble
                        key={message._id || index}
                        message={message}
                      />
                    );
                }
              })}
            </div>
          </div>
        ))}

        {/* Enhanced Typing Indicator */}
        {isTyping && (
          <div className="flex gap-2 sm:gap-4 max-w-[85%] sm:max-w-[80%] mr-auto animate-in slide-in-from-left-2 duration-300 mb-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-md px-3 py-2 sm:px-5 sm:py-4 shadow-xs border border-blue-100 dark:border-blue-900">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {/* <div ref={messagesEndRef} /> */}
      </div>
    </div>
  );
};

export default MessageList;
