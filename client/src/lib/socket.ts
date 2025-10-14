import { BASE_SERVER_URL } from "@/config/config";
import { io, Socket } from "socket.io-client";

let _socket: Socket | null = null;

const connectSocket = (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required to connect to the socket");
  }

  // Always create a new socket if there isn't one or if the existing one is disconnected
  if (!_socket || _socket.disconnected) {
    console.log(userId, "Connecting to socket with userId");
    _socket = io(BASE_SERVER_URL, {
      query: {
        userId,
      },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
  }

  return _socket;
};

const disconnectSocket = () => {
  if (_socket) {
    _socket.disconnect();
  }
  _socket = null;
};

export { connectSocket, disconnectSocket };
