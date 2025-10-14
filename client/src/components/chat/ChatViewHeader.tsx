import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { useGetSelectedChatInfoQuery } from "@/store/api/viby";

const ChatViewHeader = () => {
  const chatId = useParams<{ chatId: string }>().chatId;
  const { data: chat = null } = useGetSelectedChatInfoQuery(chatId || "");

  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    console.log("Back button clicked");
    navigate("/chat");
    // navigate(-1);
  }, [navigate]);

  useEffect(() => {});

  return (
    <div className="relative flex-shrink-0">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-purple-600/10" />
      <div className="absolute inset-0 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80" />
      <div className="relative flex items-center justify-between p-3 sm:p-4 border-b border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="lg:hidden h-8 w-8 sm:h-10 sm:w-10 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors rounded-xl flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="relative flex-shrink-0">
            <Avatar className="h-9 w-9 sm:h-12 sm:w-12 ring-2 ring-blue-200 dark:ring-blue-800 shadow-lg">
              <AvatarImage src={chat?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm sm:text-lg">
                {chat?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {/* {chat?.online && (
              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" />
            )} */}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm sm:text-lg">
              {chat?.name}
            </h3>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300",
                  chat?.online
                    ? "bg-emerald-500 shadow-emerald-500/50 shadow-sm"
                    : "bg-slate-400"
                )}
              />
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                {chat && chat.isTyping ? (
                  <span className="flex items-center gap-1">
                    <span>typing</span>
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  </span>
                ) : chat?.online ? (
                  "Online"
                ) : (
                  "Last seen recently"
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors rounded-xl group"
          >
            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors rounded-xl group"
          >
            <Video className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-xl"
          >
            <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 dark:text-slate-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatViewHeader;
