import { SocketContext } from "@/context/socket";
import { useContext } from "react";

const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    console.warn("useSocket called outside of SocketProvider");
    return { socket: null };
  }

  return { socket: context };
};

export { useSocket };
