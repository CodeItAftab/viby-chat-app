import SocketEvents from "@/constants/event";
import { SocketContext } from "@/context/socket";
import { useAuth } from "@/hooks/auth";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import {
  HandleMessageRead,
  HandleNewMessage,
  HanldeMessageDelivered,
  handleRecordingStatus,
  HanldeTypingStatus,
  HanldeNewFriendRequest,
  HanldeFriendRequestCancelled,
  HanldeFriendRequestRejected,
  HanldeFriendRequestAccepted,
  HandleFrinedOnlineStatusChange,
} from "@/provider/socket-handlers";
import { useEffect, useState, useCallback, useRef } from "react";
import type { Socket } from "socket.io-client";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const socketRef = useRef<Socket | null>(null);
  const [shouldReconnect, setShouldReconnect] = useState(false);

  const handleDisconnect = useCallback(() => {
    console.log("🔌 Socket disconnected, will attempt to reconnect...");
    if (socketRef.current) {
      disconnectSocket();
      socketRef.current = null;
    }
    setShouldReconnect(true);
  }, []);

  const connectToSocket = useCallback(() => {
    if (!user?._id) return;

    console.log("🔄 Attempting to connect socket...");
    const newSocket = connectSocket(user._id);
    socketRef.current = newSocket;
    setShouldReconnect(false);
  }, [user?._id]);

  // Initial connection + reconnection
  useEffect(() => {
    if (!user?._id) return;

    if (!socketRef.current || shouldReconnect) {
      connectToSocket();
    }

    return () => {
      if (socketRef.current) {
        handleDisconnect();
      }
    };
  }, [user?._id, shouldReconnect, connectToSocket, handleDisconnect]);

  // Connection status listeners
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("connect", () => {
      console.log("✅ Socket connected\n👤 SocketId:", socket.id);
      setShouldReconnect(false);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected. Reason:", reason);
      handleDisconnect();
    });

    socket.on("connect_error", (error) => {
      console.log("🚫 Socket connection error:", error);
      setTimeout(() => {
        setShouldReconnect(true);
      }, 2000);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [handleDisconnect]);

  // Business event listeners
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on(SocketEvents.New_Message, HandleNewMessage);
    socket.on(SocketEvents.Message_Read, HandleMessageRead);
    socket.on(SocketEvents.Message_Delivered, HanldeMessageDelivered);
    socket.on(SocketEvents.Typing, HanldeTypingStatus);
    socket.on(SocketEvents.Recording, handleRecordingStatus);
    socket.on(SocketEvents.New_Friend_Request, HanldeNewFriendRequest);
    socket.on(
      SocketEvents.Friend_Request_Accepted,
      HanldeFriendRequestAccepted
    );
    socket.on(
      SocketEvents.Friend_Request_Declined,
      HanldeFriendRequestRejected
    );
    socket.on(
      SocketEvents.Friend_Request_Cancelled,
      HanldeFriendRequestCancelled
    );
    socket.on(
      SocketEvents.Friend_Online_Status_Changed,
      HandleFrinedOnlineStatusChange
    );

    return () => {
      socket.off(SocketEvents.New_Message, HandleNewMessage);
      socket.off(SocketEvents.Message_Read, HandleMessageRead);
      socket.off(SocketEvents.Message_Delivered, HanldeMessageDelivered);
      socket.off(SocketEvents.Typing, HanldeTypingStatus);
      socket.off(SocketEvents.Recording, handleRecordingStatus);
      socket.off(SocketEvents.New_Friend_Request, HanldeNewFriendRequest);
      socket.off(
        SocketEvents.Friend_Request_Accepted,
        HanldeFriendRequestAccepted
      );
      socket.off(
        SocketEvents.Friend_Request_Declined,
        HanldeFriendRequestRejected
      );
      socket.off(
        SocketEvents.Friend_Request_Cancelled,
        HanldeFriendRequestCancelled
      );
      socket.off(
        SocketEvents.Friend_Online_Status_Changed,
        HandleFrinedOnlineStatusChange
      );
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
