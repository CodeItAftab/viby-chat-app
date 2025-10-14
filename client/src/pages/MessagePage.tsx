import { useEffect } from "react";
import { ChatView } from "@/components/chat/chat-view";
import { useDispatch } from "react-redux";
import { setSelectedChatId } from "@/store/slices/app";
import { useParams } from "react-router-dom";

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isOwn: boolean;
  type: "text" | "image" | "video" | "audio" | "file";
  files?: File[];
  createdAt: Date;
}

export interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  online: boolean;
  messages: Message[];
}

// Mock data with proper dates - Fixed to ensure all messages have createdAt
// const mockChats: Chat[] = [
//   {
//     id: "1",
//     name: "Alice Johnson",
//     avatar: "/placeholder.svg?height=40&width=40",
//     lastMessage: "Hey! How are you doing?",
//     timestamp: "2m ago",
//     unread: 2,
//     online: true,
//     messages: [
//       {
//         id: "1",
//         content: "Hey! How are you doing?",
//         sender: "Alice Johnson",
//         timestamp: "2:30 PM",
//         isOwn: false,
//         type: "text",
//         createdAt: new Date(
//           Date.now() - 2 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000
//         ),
//       },
//       {
//         id: "2",
//         content:
//           "I'm doing great! Just working on some new projects. How about you?",
//         sender: "You",
//         timestamp: "2:32 PM",
//         isOwn: true,
//         type: "text",
//         createdAt: new Date(
//           Date.now() - 2 * 24 * 60 * 60 * 1000 - 28 * 60 * 1000
//         ),
//       },
//       {
//         id: "3",
//         content:
//           "That sounds awesome! I'd love to hear more about your projects.",
//         sender: "Alice Johnson",
//         timestamp: "2:35 PM",
//         isOwn: false,
//         type: "text",
//         createdAt: new Date(
//           Date.now() - 2 * 24 * 60 * 60 * 1000 - 25 * 60 * 1000
//         ),
//       },
//       {
//         id: "4",
//         content:
//           "I'm working on a new chat application with some really cool features.",
//         sender: "You",
//         timestamp: "10:15 AM",
//         isOwn: true,
//         type: "text",
//         createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 - 10 * 60 * 1000),
//       },
//       {
//         id: "5",
//         content: "Wow, that's exciting! Can you tell me more?",
//         sender: "Alice Johnson",
//         timestamp: "10:17 AM",
//         isOwn: false,
//         type: "text",
//         createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 - 8 * 60 * 1000),
//       },
//       {
//         id: "6",
//         content:
//           "It has real-time messaging, file sharing, voice messages, and much more!",
//         sender: "You",
//         timestamp: "3:30 PM",
//         isOwn: true,
//         type: "text",
//         createdAt: new Date(Date.now() - 30 * 60 * 1000),
//       },
//       {
//         id: "7",
//         content: "That sounds amazing! I can't wait to try it out.",
//         sender: "Alice Johnson",
//         timestamp: "3:35 PM",
//         isOwn: false,
//         type: "text",
//         createdAt: new Date(Date.now() - 25 * 60 * 1000),
//       },
//     ],
//   },
// ];

export default function MessagePage() {
  // const [selectedChat, setSelectedChat] = useState<string>("1");
  // const [chats, setChats] = useState<Chat[]>(mockChats);

  // const handleSendMessage = (
  //   content: string,
  //   type: "text" | "image" | "video" | "audio" | "file",
  //   files?: File[]
  // ) => {
  //   const now = new Date();
  //   const newMessage: Message = {
  //     id: Date.now().toString(),
  //     content,
  //     sender: "You",
  //     timestamp: now.toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     }),
  //     isOwn: true,
  //     type,
  //     files,
  //     createdAt: now, // Ensure createdAt is always set
  //   };

  //   setChats((prev) =>
  //     prev.map((chat) =>
  //       chat.id === selectedChat
  //         ? {
  //             ...chat,
  //             messages: [...chat.messages, newMessage],
  //             lastMessage: content || "File shared",
  //             timestamp: "now",
  //           }
  //         : chat
  //     )
  //   );
  // };

  const dispatch = useDispatch();
  const { chatId } = useParams();

  useEffect(() => {
    dispatch(setSelectedChatId(chatId || ""));

    return () => {
      dispatch(setSelectedChatId(""));
    };
  }, [chatId, dispatch]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <ChatView
      // selectedChat={selectedChat}
      // chats={chats}
      // onSendMessage={handleSendMessage}
      />
    </div>
  );
}
