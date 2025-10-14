const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "file", "video", "audio", "raw"],
      default: "text",
    },
    text_content: {
      type: String,
    },
    media: [
      {
        url: String,
        public_id: String,
        resource_type: {
          type: String,
          enum: ["image", "video", "file", "audio", "raw"],
        },
        bytes: Number,
        duration: Number,
        thumbnail_url: String,
        format: String,
        name: String,
      },
    ],
    state: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    read_list: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    delivered_list: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reply_to: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

module.exports = model("Message", schema);
