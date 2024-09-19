const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.ObjectId,
      ref: "Chat",
      required: [true, "Chat ID is required with Message"],
    },
    senderId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User ID is required with Message"],
    },
    text: {
      type: String,
      required: [true, "A message must have a text"],
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
