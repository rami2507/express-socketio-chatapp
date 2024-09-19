const Message = require("../models/messageModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("./../utils/ApiError");

// CREATE MESSAGE
exports.createMessage = asyncHandler(async (req, res) => {
  const { chatId, senderId, text } = req.body;

  const newMessage = await Message.create({ chatId, senderId, text });

  res.status(201).json(newMessage);
});

// GET MESSAGES OF A CERTAIN CHAT
exports.getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const messages = await Message.find({ chatId });

  if (!messages.length) {
    return next(new ApiError("The conversation is empty!", 404));
  }

  res.status(200).json(messages);
});
