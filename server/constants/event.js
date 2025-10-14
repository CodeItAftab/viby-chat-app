const SocketEvents = {
  New_Message: "new_message",
  Message_Read: "message_read",
  Message_Delivered: "message_delivered",
  Typing: "typing",
  Recording: "recording",
  New_Friend_Request: "new_friend_request",
  Friend_Request_Accepted: "friend_request_accepted",
  Friend_Request_Declined: "friend_request_declined",
  Friend_Request_Cancelled: "friend_request_cancelled",
  Friend_Online_Status_Changed: "friend_online_status_changed",
  // Call events
  Call_Invite: "Call_Invite",
  Call_Offer: "Call_Offer",
  Call_Answer: "Call_Answer",
  Call_Signal: "Call_Signal",
  Call_Reject: "Call_Reject",
  Call_End: "Call_End",
  Call_Reconnect: "Call_Reconnect",
  Call_Error: "Call_Error",
  Active_Calls_Response: "Active_Calls_Response",
};

module.exports = { SocketEvents };
