const express = require("express");
const { protect } = require("./../controllers/protect");
const {
  createMessage,
  getMessages,
} = require("./../controllers/messageController");

const {
  createMessageValidator,
  getMessagesValidator,
} = require("./../utils/validators/messageValidator");

const router = express.Router();

router.use(protect);
router.post("/", createMessageValidator, createMessage);
router.get("/:chatId", getMessagesValidator, getMessages);

module.exports = router;
