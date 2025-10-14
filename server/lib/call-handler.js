const callHandler = (io, socket) => {
  console.log(`User connected for calls: ${socket.id}`);

  // Store active calls and user mappings
  const activeCalls = socket.server.activeCalls || new Map();
  const userSockets = socket.server.userSockets || new Map();

  // Ensure maps are shared across sockets
  socket.server.activeCalls = activeCalls;
  socket.server.userSockets = userSockets;

  // Register user socket
  socket.on("user_connect", (data) => {
    const { userId } = data;
    userSockets.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} registered with socket ${socket.id}`);

    // Notify user is online
    socket.broadcast.emit("user_online", { userId });
  });

  // Call invitation
  socket.on("Call_Invite", (data) => {
    console.log("Call_Invite received:", data);

    const { callId, fromUserId, toUserId, mode, timestamp } = data;
    const actualFromUserId = socket.userId || fromUserId;

    // Validate required fields
    if (!callId || !actualFromUserId || !toUserId || !mode) {
      socket.emit("Call_Error", {
        error: "Missing required fields",
        callId,
        code: "INVALID_INVITE",
      });
      return;
    }

    // Check if user is already in a call
    const existingCall = Array.from(activeCalls.values()).find(
      (call) =>
        (call.fromUserId === actualFromUserId ||
          call.toUserId === actualFromUserId) &&
        call.status !== "ended" &&
        call.status !== "rejected"
    );

    if (existingCall) {
      socket.emit("Call_Error", {
        error: "User already in a call",
        callId,
        code: "USER_BUSY",
      });
      return;
    }

    // Store call information
    activeCalls.set(callId, {
      callId,
      fromUserId: actualFromUserId,
      toUserId,
      mode,
      status: "calling",
      timestamp: timestamp || Date.now(),
      initiatorSocketId: socket.id,
    });

    // Find target user's socket
    const targetSocketId = userSockets.get(toUserId);
    if (targetSocketId) {
      const targetSocket = io.sockets.sockets.get(targetSocketId);
      if (targetSocket && targetSocket.connected) {
        targetSocket.emit("Call_Invite", {
          callId,
          fromUserId: actualFromUserId,
          toUserId,
          mode,
          timestamp: timestamp || Date.now(),
        });
        console.log(`Call invite sent to user ${toUserId}`);
      } else {
        console.log(`Target socket ${targetSocketId} not connected`);
        activeCalls.delete(callId);
        socket.emit("Call_Error", {
          error: "User not available",
          callId,
          code: "USER_OFFLINE",
        });
      }
    } else {
      console.log(`User ${toUserId} not found online`);
      activeCalls.delete(callId);
      socket.emit("Call_Error", {
        error: "User not online",
        callId,
        code: "USER_NOT_FOUND",
      });
    }
  });

  // Call offer (WebRTC offer)
  socket.on("Call_Offer", (data) => {
    console.log("Call_Offer received:", data);

    const { callId, fromUserId, toUserId, signal, timestamp } = data;
    const call = activeCalls.get(callId);

    if (!call) {
      console.log(`Call ${callId} not found`);
      socket.emit("Call_Error", {
        error: "Call not found",
        callId,
        code: "CALL_NOT_FOUND",
      });
      return;
    }

    // Update call status
    call.status = "connecting";
    call.offer = signal;
    call.offerTime = timestamp || Date.now();
    activeCalls.set(callId, call);

    // Forward offer to target user
    const targetSocketId = userSockets.get(toUserId);
    if (targetSocketId) {
      const targetSocket = io.sockets.sockets.get(targetSocketId);
      if (targetSocket && targetSocket.connected) {
        targetSocket.emit("Call_Offer", {
          callId,
          fromUserId: socket.userId || fromUserId,
          toUserId,
          signal,
          timestamp: timestamp || Date.now(),
        });
        console.log(`Call offer forwarded to user ${toUserId}`);
      } else {
        console.log(`Target socket ${targetSocketId} not connected`);
        socket.emit("Call_Error", {
          error: "Target user disconnected",
          callId,
          code: "USER_DISCONNECTED",
        });
      }
    } else {
      console.log(`Target user ${toUserId} not found`);
      socket.emit("Call_Error", {
        error: "Target user not found",
        callId,
        code: "USER_NOT_FOUND",
      });
    }
  });

  // Call answer (WebRTC answer)
  socket.on("Call_Answer", (data) => {
    console.log("Call_Answer received:", data);

    const { callId, fromUserId, toUserId, signal, timestamp } = data;
    const call = activeCalls.get(callId);

    if (!call) {
      console.log(`Call ${callId} not found`);
      socket.emit("Call_Error", {
        error: "Call not found",
        callId,
        code: "CALL_NOT_FOUND",
      });
      return;
    }

    // Update call status
    call.status = "connected";
    call.answer = signal;
    call.answerTime = timestamp || Date.now();
    call.connectTime = timestamp || Date.now();
    activeCalls.set(callId, call);

    // Forward answer to initiator
    const targetSocketId = userSockets.get(toUserId);
    if (targetSocketId) {
      const targetSocket = io.sockets.sockets.get(targetSocketId);
      if (targetSocket && targetSocket.connected) {
        targetSocket.emit("Call_Answer", {
          callId,
          fromUserId: socket.userId || fromUserId,
          toUserId,
          signal,
          timestamp: timestamp || Date.now(),
        });
        console.log(`Call answer forwarded to user ${toUserId}`);
      } else {
        console.log(`Target socket ${targetSocketId} not connected`);
        socket.emit("Call_Error", {
          error: "Target user disconnected",
          callId,
          code: "USER_DISCONNECTED",
        });
      }
    } else {
      console.log(`Target user ${toUserId} not found`);
      socket.emit("Call_Error", {
        error: "Target user not found",
        callId,
        code: "USER_NOT_FOUND",
      });
    }
  });

  // Call signaling (ICE candidates, etc.)
  socket.on("Call_Signal", (data) => {
    console.log("Call_Signal received:", data);

    const { callId, fromUserId, toUserId, signal, timestamp } = data;

    // Validate call exists
    const call = activeCalls.get(callId);
    if (!call) {
      console.log(`Call ${callId} not found for signaling`);
      return;
    }

    // Forward signal to target user
    const targetSocketId = userSockets.get(toUserId);
    if (targetSocketId) {
      const targetSocket = io.sockets.sockets.get(targetSocketId);
      if (targetSocket && targetSocket.connected) {
        targetSocket.emit("Call_Signal", {
          callId,
          fromUserId: socket.userId || fromUserId,
          toUserId,
          signal,
          timestamp: timestamp || Date.now(),
        });
        console.log(`Call signal forwarded to user ${toUserId}`);
      } else {
        console.log(
          `Target socket ${targetSocketId} not connected for signaling`
        );
      }
    } else {
      console.log(`Target user ${toUserId} not found for signaling`);
    }
  });

  // Call rejection
  socket.on("Call_Reject", (data) => {
    console.log("Call_Reject received:", data);

    const { callId, fromUserId, toUserId, reason, timestamp } = data;
    const call = activeCalls.get(callId);

    if (call) {
      // Update call status
      call.status = "rejected";
      call.endReason = reason || "declined";
      call.endTime = timestamp || Date.now();
      call.duration = call.endTime - call.timestamp;

      // Log rejection
      console.log(
        `Call ${callId} rejected by ${socket.userId}. Reason: ${call.endReason}`
      );

      // Remove call after a delay
      setTimeout(() => {
        activeCalls.delete(callId);
      }, 5000);
    }

    // Forward rejection to initiator
    const targetSocketId = userSockets.get(toUserId);
    if (targetSocketId) {
      const targetSocket = io.sockets.sockets.get(targetSocketId);
      if (targetSocket && targetSocket.connected) {
        targetSocket.emit("Call_Reject", {
          callId,
          fromUserId: socket.userId || fromUserId,
          toUserId,
          reason: reason || "declined",
          timestamp: timestamp || Date.now(),
        });
        console.log(`Call rejection forwarded to user ${toUserId}`);
      }
    }
  });

  // Call end
  socket.on("Call_End", (data) => {
    console.log("Call_End received:", data);

    const { callId, fromUserId, toUserId, reason, timestamp } = data;
    const call = activeCalls.get(callId);

    if (call) {
      // Update call status
      call.status = "ended";
      call.endReason = reason || "user_ended";
      call.endTime = timestamp || Date.now();
      call.duration = call.endTime - call.timestamp;

      // Log call statistics
      console.log(
        `Call ${callId} ended by ${socket.userId}. Duration: ${call.duration}ms, Reason: ${call.endReason}`
      );

      // Remove call after a delay
      setTimeout(() => {
        activeCalls.delete(callId);
      }, 5000);
    }

    // Forward end signal to other user
    const targetSocketId = userSockets.get(toUserId);
    if (targetSocketId) {
      const targetSocket = io.sockets.sockets.get(targetSocketId);
      if (targetSocket && targetSocket.connected) {
        targetSocket.emit("Call_End", {
          callId,
          fromUserId: socket.userId || fromUserId,
          toUserId,
          reason: reason || "user_ended",
          timestamp: timestamp || Date.now(),
        });
        console.log(`Call end forwarded to user ${toUserId}`);
      }
    }
  });

  // Call reconnection
  socket.on("Call_Reconnect", (data) => {
    console.log("Call_Reconnect received:", data);

    const { callId, fromUserId, toUserId, reason, timestamp } = data;
    const call = activeCalls.get(callId);

    if (call) {
      // Update call status
      call.status = "reconnecting";
      call.reconnectReason = reason || "connection_lost";
      call.reconnectTime = timestamp || Date.now();
      call.reconnectAttempts = (call.reconnectAttempts || 0) + 1;

      console.log(
        `Call ${callId} reconnection attempt ${call.reconnectAttempts}`
      );
    }

    // Forward reconnection request to other user
    const targetSocketId = userSockets.get(toUserId);
    if (targetSocketId) {
      const targetSocket = io.sockets.sockets.get(targetSocketId);
      if (targetSocket && targetSocket.connected) {
        targetSocket.emit("Call_Reconnect", {
          callId,
          fromUserId: socket.userId || fromUserId,
          toUserId,
          reason: reason || "connection_lost",
          timestamp: timestamp || Date.now(),
        });
        console.log(`Call reconnect forwarded to user ${toUserId}`);
      }
    }
  });

  // Get call status
  socket.on("Call_Status", (data) => {
    const { callId } = data;
    const call = activeCalls.get(callId);

    socket.emit("Call_Status_Response", {
      callId,
      call: call || null,
      found: !!call,
    });
  });

  // Get active calls for user
  socket.on("Get_Active_Calls", () => {
    const userCalls = Array.from(activeCalls.values()).filter(
      (call) =>
        (call.fromUserId === socket.userId ||
          call.toUserId === socket.userId) &&
        call.status !== "ended" &&
        call.status !== "rejected"
    );

    socket.emit("Active_Calls_Response", {
      calls: userCalls,
    });
  });

  // Heartbeat for call quality monitoring
  socket.on("Call_Heartbeat", (data) => {
    const { callId, quality, metrics, timestamp } = data;
    const call = activeCalls.get(callId);

    if (call) {
      call.lastHeartbeat = timestamp || Date.now();
      call.quality = quality;
      call.metrics = metrics;

      // Forward to other participant for monitoring
      const otherUserId =
        call.fromUserId === socket.userId ? call.toUserId : call.fromUserId;
      const otherSocketId = userSockets.get(otherUserId);

      if (otherSocketId) {
        const otherSocket = io.sockets.sockets.get(otherSocketId);
        if (otherSocket && otherSocket.connected) {
          otherSocket.emit("Call_Quality_Update", {
            callId,
            fromUserId: socket.userId,
            quality,
            metrics,
            timestamp: timestamp || Date.now(),
          });
        }
      }
    }
  });

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id}, reason: ${reason}`);

    // Find and clean up user's calls
    if (socket.userId) {
      // Notify user is offline
      socket.broadcast.emit("user_offline", { userId: socket.userId });

      // End any active calls for this user
      for (const [callId, call] of activeCalls.entries()) {
        if (
          (call.fromUserId === socket.userId ||
            call.toUserId === socket.userId) &&
          call.status !== "ended" &&
          call.status !== "rejected"
        ) {
          console.log(`Ending call ${callId} due to user disconnect`);

          // Notify the other user
          const otherUserId =
            call.fromUserId === socket.userId ? call.toUserId : call.fromUserId;
          const otherSocketId = userSockets.get(otherUserId);

          if (otherSocketId) {
            const otherSocket = io.sockets.sockets.get(otherSocketId);
            if (otherSocket && otherSocket.connected) {
              otherSocket.emit("Call_End", {
                callId,
                fromUserId: socket.userId,
                toUserId: otherUserId,
                reason: "connection_lost",
                timestamp: Date.now(),
              });
            }
          }

          // Update call record
          call.status = "ended";
          call.endReason = "connection_lost";
          call.endTime = Date.now();
          call.duration = call.endTime - call.timestamp;

          // Remove call after delay
          setTimeout(() => {
            activeCalls.delete(callId);
          }, 5000);
        }
      }

      // Remove user from online users
      userSockets.delete(socket.userId);
    }
  });

  // Error handling
  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);

    // End any active calls for this user due to error
    if (socket.userId) {
      for (const [callId, call] of activeCalls.entries()) {
        if (
          (call.fromUserId === socket.userId ||
            call.toUserId === socket.userId) &&
          call.status !== "ended" &&
          call.status !== "rejected"
        ) {
          const otherUserId =
            call.fromUserId === socket.userId ? call.toUserId : call.fromUserId;
          const otherSocketId = userSockets.get(otherUserId);

          if (otherSocketId) {
            const otherSocket = io.sockets.sockets.get(otherSocketId);
            if (otherSocket && otherSocket.connected) {
              otherSocket.emit("Call_End", {
                callId,
                fromUserId: socket.userId,
                toUserId: otherUserId,
                reason: "error",
                timestamp: Date.now(),
              });
            }
          }

          activeCalls.delete(callId);
        }
      }
    }
  });
};

module.exports = callHandler;
