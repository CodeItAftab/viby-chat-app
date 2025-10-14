import { cn } from "@/lib/utils";
import type { Message } from "@/types/message";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

// const RenderMessageContent = (message: Message) => {
//   switch (message.type) {
//     case "audio":
//       return <></>;
//     default: {
//       const isShortMessage =
//         typeof message.text_content === "string" &&
//         message.text_content.length <= 25;
//       const isMediumMessage =
//         typeof message.text_content === "string" &&
//         message.text_content.length <= 80;

//       if (isShortMessage) {
//         return (
//           <div className="px-3 py-2 relative">
//             <p className="text-sm leading-relaxed whitespace-pre-wrap break-words pr-20">
//               {message.text_content}
//             </p>
//           </div>
//         );
//       } else if (isMediumMessage) {
//         return (
//           <div className="px-3 py-2 relative">
//             <p className="text-sm leading-relaxed whitespace-pre-wrap break-words pr-16 pb-1">
//               {message.text_content}
//             </p>
//           </div>
//         );
//       } else {
//         return (
//           <div className="px-3 py-2 relative">
//             <div className="relative">
//               <p
//                 className="text-sm leading-relaxed whitespace-pre-wrap break-words"
//                 style={{
//                   paddingRight: "4px",
//                   marginBottom: "-18px",
//                   paddingBottom: "18px",
//                 }}
//               >
//                 {message.text_content}
//                 <span
//                   className="inline-block align-bottom ml-1"
//                   style={{
//                     width: "54px",
//                     height: "16px",
//                   }}
//                 />
//               </p>
//             </div>
//           </div>
//         );
//       }
//     }
//   }
// };

// const RenderMessageContent = (message: Message) => {
//   switch (message.type) {
//     case "audio":
//       return <></>;
//     default:
//       return <></>;
//   }
// };

// export const MessageBubble = ({ message }: MessageBubbleProps) => {
//   console.log("MessageBubble", message);

//   return (
//     <div
//       className={cn(
//         "flex group animate-in slide-in-from-bottom-2 fade-in duration-300 mb-3",
//         message.is_sender ? "justify-end" : "justify-start"
//         //   isGrouped ? "mb-1" : "mb-3"
//       )}
//     >
//       <div
//         className={cn(
//           "relative inline-block",
//           // Improved width calculation based on message length
//           message.type === "text" && typeof message.text_content === "string"
//             ? message.text_content.length <= 25
//               ? "max-w-fit" // Short messages: fit to text_content
//               : message.text_content.length <= 80
//               ? "max-w-[75%] sm:max-w-[65%]" // Medium messages
//               : "max-w-[85%] sm:max-w-[75%]" // Long messages
//             : "max-w-[85%] sm:max-w-[70%]"
//         )}
//       >
//         <div
//           className={cn(
//             "shadow-sm transition-all duration-200 group-hover:shadow-md relative backdrop-blur-sm",
//             // getBubbleRadius(),
//             "rounded-2xl",
//             message.is_sender
//               ? "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-blue-500/15"
//               : "bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 shadow-slate-900/5",
//             // Refined borders
//             message.type === "text"
//               ? message.is_sender
//                 ? "border border-blue-500/20"
//                 : "border border-slate-200/50 dark:border-slate-700/50"
//               : "p-2 border border-slate-200/30 dark:border-slate-700/30"
//           )}
//         >
//           {RenderMessageContent(message)}
//           <div
//             className={cn(
//               "absolute flex items-center gap-1 text-xs pointer-events-none select-none z-10",
//               "bottom-1.5 right-2.5",
//               message.is_sender
//                 ? "text-white/80"
//                 : "text-slate-500 dark:text-slate-400"
//             )}
//             style={{
//               textShadow: message.is_sender
//                 ? "0 1px 2px rgba(0,0,0,0.15)"
//                 : "0 1px 1px rgba(255,255,255,0.8)",
//             }}
//           >
//             <span className="font-medium whitespace-nowrap text-[10px] tracking-wide">
//               {new Date(message.timestamp).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 hour12: true,
//               })}
//             </span>
//             {message.is_sender && (
//               <CheckCheck className="h-3 w-3 text-current opacity-75 flex-shrink-0" />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const TextMessage = ({ message }: { message: Message }) => {
  const isMultiLineMessage =
    message.text_content && message.text_content.length > 32;
  return (
    <div
      className={`${
        // message?.sameSender
        //   ? "rounded-sm"
        //   :
        message?.is_sender
          ? "chat-bubble-right mt-3 rounded-l-md rounded-b-md self-end border border-blue-500/20"
          : "chat-bubble-left mt-3 rounded-r-md rounded-b-md border border-slate-200/50 dark:border-slate-700/50"
      } ${
        message?.is_sender
          ? "self-end bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-blue-500/15"
          : "bg-white/95 dark:bg-slate-800/95 hover:bg-white dark:hover:bg-slate-800 shadow-slate-900/5"
      }  relative min-w-16 h-fit w-fit max-w-[320px]  shrink-0  shadow-sm transition-all duration-200 group-hover:shadow-md backdrop-blur-sm `}
    >
      <p
        className={`w-fit text-base inline-block  ${
          isMultiLineMessage ? "pt-1" : "py-[6px]"
        } px-2 overflow-ellipsis break-all text-sm leading-relaxed whitespace-pre-wrap break-words font-gei `}
      >
        {/* Lorem ipsum dolor sit Lorem Lore Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Voluptatem, dolorem. */}
        {message.text_content}
      </p>
      <span
        className={`float-right relative inline-block ${
          isMultiLineMessage ? "mt-0 mb-[2px]" : "mt-[11px]"
        }  self-end h-5 w-[72px] shrink-0 bg-rded-200`}
      >
        <div className="h-full  w-full flex items-center justify-center pr-1 gap-1 flex-shrink-0">
          <span className="text-[10px] relative ">
            {message?.timestamp &&
              new Date(message?.timestamp).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
          </span>
          {message?.is_sender && (
            <span className="flex items-center justify-center">
              {message?.state === "read" && (
                <CheckCheck
                  size={16}
                  color="#1976d2"
                  className="self-end text-slate-500"
                />
              )}
              {message?.state === "delivered" && (
                <Check size={16} className="self-end text-slate-500" />
              )}
              {message?.state === "sent" && (
                <Check size={16} className="self-end text-slate-500" />
              )}
            </span>
          )}
        </div>
      </span>
    </div>
  );
};

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  console.log("MessageBubble", message);
  return (
    <>
      <TextMessage message={message} />
    </>
  );
};
