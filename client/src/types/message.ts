export interface Media {
  url: string;
  public_id: string;
  name?: string; // Optional name for the media
  resource_type: "image" | "video" | "file" | "audio" | "raw";
  duration?: number; // For video/audio
  format?: string; // File format, e.g., "mp4", "jpg"
  thumbnail_url?: string; // Optional thumbnail for images/videos
  is_audio?: boolean; // Flag to indicate if the media is audio
  bytes: number; // Size of the file in bytes
  _id?: string; // Optional ID for the media, if stored in a database
  aspectRatio?: number; // Optional aspect ratio for images/videos
  width?: number; // Optional width for images/videos
  height?: number; // Optional height for images/videos
}

export interface Message {
  _id: string;
  chatId: string;
  sender: string;
  type: "text" | "image" | "video" | "file" | "audio" | "raw";
  text_content?: string;
  media?: Media[] | File[];
  state: "sent" | "delivered" | "read" | "failed" | "sending";
  timestamp: string;
  is_sender: boolean;
}

export interface LastMessage {
  text_content?: string;
  media?: Media[];
  sender: string;
  state: "sent" | "delivered" | "read" | "failed" | "sending";
  timestamp: string;
  type: "text" | "image" | "video" | "file" | "audio";
  is_sender: boolean;
  sender_name?: string;
}

export interface Chat {
  _id: string;
  name: string;
  friendId: string;
  username?: string; // Optional username for the chat
  online: boolean;
  avatar?: string;
  last_message?: LastMessage;
  unread_count?: number;
  isTyping?: boolean; // Optional typing indicator
  isRecording?: boolean; // Optional recording indicator
}
