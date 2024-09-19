const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const ApiError = require("../utils/ApiError");

const findChatBetweenUsers = async (firstId, secondId) => {
  return await Chat.findOne({ members: { $all: [firstId, secondId] } });
};

// CREATE CHAT
exports.createChat = asyncHandler(async (req, res) => {
  const { firstId, secondId } = req.body;

  // SEARCH FOR THE CHAT
  const chat = await findChatBetweenUsers(firstId, secondId);

  // CHECK IF THE CHAT EXISTS
  if (chat) return res.status(200).json(chat);

  // IF IT DOES NOT EXIST, CREATE A NEW CHAT
  const newChat = await Chat.create({ members: [firstId, secondId] });

  // SEND RESPONSE
  res.status(201).json(newChat);
});

// FIND USER CHATS
exports.findUserChats = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const chats = await Chat.find({
    members: { $in: [userId] },
  });

  if (chats.length === 0) {
    return next(
      new ApiError(`No chats found for user with ID: ${userId}`, 404)
    );
  }

  res.status(200).json(chats);
});

// FIND CHAT
exports.findChat = asyncHandler(async (req, res) => {
  const { firstId, secondId } = req.params;

  const chat = await findChatBetweenUsers(firstId, secondId);

  if (!chat) {
    return next(
      new ApiError(
        `No chat found between users ${firstId} and ${secondId}`,
        404
      )
    );
  }

  res.status(200).json(chat);
});
