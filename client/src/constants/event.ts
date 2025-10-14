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
  Call_Invite: "call:invite",
  Call_Answer: "call:answer",
  Call_Signal: "call:signal",
  Call_End: "call:end",
  Call_Renegotiate: "call:renegotiate",
};

export default SocketEvents;
