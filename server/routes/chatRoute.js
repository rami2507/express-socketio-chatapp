const express = require("express");
const {
  createChat,
  findChat,
  findUserChats,
} = require("./../controllers/chatController");
const {
  createChatValidator,
  findUserChatsValidator,
  findChatValidator,
} = require("./../utils/validators/chatValidator");
const { protect } = require("./../controllers/protect");

const router = express.Router();

router.use(protect);

router.post("/", createChatValidator, createChat);
router.get("/:userId", findUserChatsValidator, findUserChats);
router.get("/find/:firstId/:secondId", findChatValidator, findChat);

module.exports = router;
